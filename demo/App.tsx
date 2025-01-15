import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GitHistory, getFileHistory, CommitInfo } from '../src';

const App = () => {
  const [commits, setCommits] = useState<CommitInfo[]>([]);

  useEffect(() => {
    const loadCommits = async () => {
      const history = await getFileHistory(
        'teamleaderleo',
        'git-inline',
        'src/index.ts'
      );
      setCommits(history);
    };

    loadCommits();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Git Inline Demo</h1>
      <div className="relative min-h-screen">
        {/* Some example content */}
        <div className="max-w-2xl">
          <p className="mb-4">This is a demo page showing how the Git Inline component works.</p>
          <p className="mb-4">The Git history component will appear as an overlay on the right side.</p>
        </div>
        
        {/* Git History component */}
        {commits.length > 0 && <GitHistory commits={commits} />}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}