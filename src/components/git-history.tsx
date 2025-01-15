import React, { useState } from 'react';
import { CommitInfo } from '../types/git-types';

interface GitHistoryProps {
  commits: CommitInfo[];
}

const GitHistory: React.FC<GitHistoryProps> = ({ commits }) => {
  const [selectedCommit, setSelectedCommit] = useState<CommitInfo | null>(null);

  return (
    <div className="fixed right-4 top-4 w-96 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">File History</h2>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {commits.map((commit) => (
          <div 
            key={commit.sha}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedCommit(commit)}
          >
            <div className="text-sm text-gray-600">
              {new Date(commit.date).toLocaleString()}
            </div>
            <div className="mt-1 text-sm">
              {commit.message}
            </div>
            {selectedCommit?.sha === commit.sha && commit.changes && (
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                {commit.changes}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GitHistory;