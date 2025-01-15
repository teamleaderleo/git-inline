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

    // For directory tracking, we should probably not join paths
    const isDirectory = paths.some(p => p.includes('*'));
    
    if (isDirectory) {
      // Get directory commits - GitHub API uses different endpoint
      // or different parameters for directory listing
      const directoryPath = paths[0].replace('/**/*', '');
      console.log('Getting directory commits for:', directoryPath);
      
      const commits = await octokit.repos.listCommits({
        owner,
        repo,
        path: directoryPath
      });
      
      console.log('GitHub API response:', {
        status: commits.status,
        headers: commits.headers,
        data: commits.data
      });

      return commits.data.map(commit => ({
        sha: commit.sha,
        date: commit.commit.author?.date || '',
        message: commit.commit.message,
        changes: commit.files?.[0]?.patch
      }));
    }

    // For multiple files, we need to make separate requests
    const commitPromises = paths.map(path => 
      octokit.repos.listCommits({
        owner,
        repo,
        path
      })
    );

    const results = await Promise.all(commitPromises);
    console.log('GitHub API responses:', results.map(r => ({
      status: r.status,
      headers: r.headers,
      path: r.data?.[0]?.files?.[0]?.filename
    })));

    // Merge and sort commits from all files
    const allCommits = results.flatMap(result => 
      result.data.map(commit => ({
        sha: commit.sha,
        date: commit.commit.author?.date || '',
        message: commit.commit.message,
        changes: commit.files?.[0]?.patch
      }))
    );

    // Sort by date descending
    return allCommits.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  } catch (error) {
    console.error('Error in getFileHistory:', error);
    if (error instanceof Error) {
      // If it's an Octokit error, it might have additional details
      const octokitError = error as any;
      if (octokitError.status) {
        console.error('GitHub API Status:', octokitError.status);
        console.error('GitHub API Message:', octokitError.message);
        console.error('GitHub API Response:', octokitError.response?.data);
      }
    }
    throw error;
  }
}