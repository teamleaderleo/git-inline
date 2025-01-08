import { Octokit } from '@octokit/rest';

const octokit = new Octokit();

export async function getFileHistory(
  owner: string,
  repo: string,
  path: string
) {
  try {
    const commits = await octokit.repos.listCommits({
      owner,
      repo,
      path,
    });
    
    return commits.data;
  } catch (error) {
    console.error('Error fetching commit history:', error);
    throw error;
  }
}

export const hello = () => {
  console.log("git-inline initialized");
};