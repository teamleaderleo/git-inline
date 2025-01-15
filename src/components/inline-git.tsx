import React, { useEffect, useState } from 'react';
import GitHistory from './git-history';
import { CommitInfo } from '../types/git-types';
import { getFileHistory } from '../github-api';

interface InlineGitProps {
  owner: string;
  repo: string;
  files: string[];
}

const InlineGit: React.FC<InlineGitProps> = ({ owner, repo, files }) => {
  const [commits, setCommits] = useState<CommitInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCommits = async () => {
      try {
        const history = await getFileHistory(owner, repo, files);
        setCommits(history);
      } catch (err) {
        console.error('Error loading commits:', err);
        setError(err instanceof Error ? err.message : 'Failed to load commit history');
      }
    };

    loadCommits();
  }, [owner, repo, files]);

  if (error) {
    return <div className="text-red-500 text-sm">Failed to load git history: {error}</div>;
  }

  return commits.length > 0 ? (
    <GitHistory commits={commits} />
  ) : (
    <div className="text-gray-400 text-sm">Loading commit history...</div>
  );
};

export default InlineGit;