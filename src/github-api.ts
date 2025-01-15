import { Octokit } from '@octokit/rest';
import { CommitInfo } from './types/git-types';

const octokit = new Octokit();

export async function getFileHistory(
  owner: string,
  repo: string,
  files: string | string[]
): Promise<CommitInfo[]> {
  try {
    console.log('Getting file history for:', { owner, repo, files });
    
    const paths = Array.isArray(files) ? files : [files];
    console.log('Processed paths:', paths);

    const commits = await octokit.repos.listCommits({
      owner,
      repo,
      path: paths.join(',')
    });
    
    console.log('Raw GitHub response:', commits);

    if (!commits.data || commits.data.length === 0) {
      console.warn('No commits found for the specified path(s)');
      return [];
    }

    const processedCommits = commits.data.map(commit => ({
      sha: commit.sha,
      date: commit.commit.author?.date || '',
      message: commit.commit.message,
      changes: commit.files?.[0]?.patch
    }));

    console.log('Processed commits:', processedCommits);
    
    return processedCommits;
  } catch (error) {
    console.error('Error in getFileHistory:', error);
    if (error instanceof Error) {
      // If it's an Octokit error, it might have additional details
      const octokitError = error as any;
      if (octokitError.status) {
        console.error('GitHub API Status:', octokitError.status);
        console.error('GitHub API Message:', octokitError.message);
      }
    }
    throw error;
  }
}