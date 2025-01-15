import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { InlineGit } from '../src';

const App = () => {

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
        <InlineGit 
            owner="teamleaderleo" 
            repo="git-inline"
            files={['src/components/git-history.tsx']}
        />
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}