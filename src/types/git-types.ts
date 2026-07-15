export interface GitAuthor {
  name: string;
  email?: string;
  avatarUrl?: string;
  profileUrl?: string;
}

export interface GitFileChange {
  path: string;
  previousPath?: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  blobUrl?: string;
  rawUrl?: string;
}

export interface CommitInfo {
  sha: string;
  shortSha: string;
  date: string;
  message: string;
  htmlUrl: string;
  author: GitAuthor;
  file?: GitFileChange;
}

export interface GitHistoryRequest {
  owner: string;
  repo: string;
  path: string;
  branch?: string;
  limit?: number;
  page?: number;
  signal?: AbortSignal;
}

export interface GitHubHistoryRequest extends GitHistoryRequest {
  token?: string;
}

export interface GitCommitRequest {
  owner: string;
  repo: string;
  path: string;
  sha: string;
  signal?: AbortSignal;
}

export interface GitHubCommitRequest extends GitCommitRequest {
  token?: string;
}

export type GitHistoryLoader = (
  request: GitHistoryRequest,
) => Promise<CommitInfo[]>;

export type GitCommitLoader = (
  request: GitCommitRequest,
) => Promise<CommitInfo>;
