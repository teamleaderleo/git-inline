import { Octokit } from '@octokit/rest';
import {
  CommitInfo,
  GitHubCommitRequest,
  GitFileChange,
  GitHubHistoryRequest,
} from './types/git-types.js';

type CommitSummary = Awaited<
  ReturnType<Octokit['rest']['repos']['listCommits']>
>['data'][number];
type CommitDetails = Awaited<
  ReturnType<Octokit['rest']['repos']['getCommit']>
>['data'];
type CommitFile = NonNullable<CommitDetails['files']>[number];

const anonymousClient = new Octokit();

function getClient(token?: string): Octokit {
  return token ? new Octokit({ auth: token }) : anonymousClient;
}

function clampLimit(limit = 10): number {
  if (!Number.isFinite(limit)) {
    return 10;
  }

  return Math.min(100, Math.max(1, Math.floor(limit)));
}

function clampPage(page = 1): number {
  return Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
}

function requestOptions(signal?: AbortSignal): { request?: { signal: AbortSignal } } {
  return signal ? { request: { signal } } : {};
}

function mapCommitSummary(commit: CommitSummary | CommitDetails): CommitInfo {
  const sha = commit.sha;
  const author = commit.author;
  const gitAuthor = commit.commit.author;
  const gitCommitter = commit.commit.committer;

  return {
    sha,
    shortSha: sha.slice(0, 7),
    date: gitAuthor?.date ?? gitCommitter?.date ?? '',
    message: commit.commit.message,
    htmlUrl: commit.html_url,
    author: {
      name: author?.login ?? gitAuthor?.name ?? 'Unknown author',
      email: gitAuthor?.email ?? undefined,
      avatarUrl: author?.avatar_url ?? undefined,
      profileUrl: author?.html_url ?? undefined,
    },
  };
}

function mapFileChange(file: CommitFile): GitFileChange {
  return {
    path: file.filename,
    previousPath: file.previous_filename ?? undefined,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    changes: file.changes,
    patch: file.patch ?? undefined,
    blobUrl: file.blob_url ?? undefined,
    rawUrl: file.raw_url ?? undefined,
  };
}

/**
 * Fetches commit summaries for one repository file.
 *
 * This function works directly in the browser for public repositories. For
 * private repositories, call it from a server or supply your own loader to the
 * React component so credentials stay outside the browser bundle.
 */
export async function getFileHistory(
  request: GitHubHistoryRequest,
): Promise<CommitInfo[]> {
  const { owner, repo, path, branch, limit, page = 1, token, signal } = request;
  const client = getClient(token);

  const response = await client.rest.repos.listCommits({
    owner,
    repo,
    path,
    sha: branch,
    per_page: clampLimit(limit),
    page: clampPage(page),
    ...requestOptions(signal),
  });

  return response.data.map(mapCommitSummary);
}

/** Fetches one commit and extracts the change for the requested file. */
export async function getCommitDetails(
  request: GitHubCommitRequest,
): Promise<CommitInfo> {
  const { owner, repo, path, sha, token, signal } = request;
  const client = getClient(token);

  const response = await client.rest.repos.getCommit({
    owner,
    repo,
    ref: sha,
    ...requestOptions(signal),
  });

  const commit = response.data;
  const matchingFile = commit.files?.find(
    (file: CommitFile) =>
      file.filename === path || file.previous_filename === path,
  );

  return {
    ...mapCommitSummary(commit),
    file: matchingFile ? mapFileChange(matchingFile) : undefined,
  };
}
