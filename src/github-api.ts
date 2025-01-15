import { Octokit } from '@octokit/rest';
import { CommitInfo } from './types/git-types';

const octokit = new Octokit();

export async function getFileHistory(
  owner: string,
  repo: string,
  files: string | string[]
): Promise<CommitInfo[]> {
  try {
    const paths = Array.isArray(files) ? files : [files];
    const commits = await octokit.repos.listCommits({
      owner,
      repo,
      path: paths.join(',')
    });
    
    return commits.data.map(commit => ({
      sha: commit.sha,
      date: commit.commit.author?.date || '',
      message: commit.commit.message,
      changes: commit.files?.[0]?.patch
    }));
  } catch (error) {
    console.error('Error fetching commit history:', error);
    throw error;
  }
}