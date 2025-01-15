import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { InlineGit } from '../src';

// Example components to demonstrate different usage patterns
const SimpleDemo = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Basic Usage</h2>
      <p className="mb-4">Simplest form - tracks current file:</p>
      <div className="bg-gray-50 p-4 rounded-lg relative">
        {/* Using explicit owner/repo for demo purposes */}
        <InlineGit 
          owner="teamleaderleo"
          repo="git-inline"
        />
      </div>
      <p className="mt-4 mb-4">Or with config file defaults:</p>
      <div className="bg-gray-50 p-4 rounded-lg relative">
        <InlineGit />  {/* Will use defaults or config file values */}
      </div>
    </div>
  );
};

const MultiFileDemo = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Multiple Files</h2>
      <p className="mb-4">Tracking multiple specific files:</p>
      <div className="bg-gray-50 p-4 rounded-lg relative">
        <InlineGit 
          files={[
            'components/git-history.tsx',
            'components/inline-git.tsx'
          ]}
        />
      </div>
    </div>
  );
};

const DirectoryDemo = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Directory Tracking</h2>
      <p className="mb-4">Tracking an entire directory recursively:</p>
      <div className="bg-gray-50 p-4 rounded-lg relative">
        <InlineGit 
          files={{
            path: 'components',
            recursive: true
          }}
        />
      </div>
    </div>
  );
};

const WholeRepoDemo = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Full Repository</h2>
      <p className="mb-4">Tracking the entire repository:</p>
      <div className="bg-gray-50 p-4 rounded-lg relative">
        <InlineGit files="*" />
      </div>
    </div>
  );
};

const CustomConfigDemo = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Custom Configuration</h2>
      <p className="mb-4">Using specified owner/repo:</p>
      <div className="bg-gray-50 p-4 rounded-lg relative">
        <InlineGit 
          owner="teamleaderleo"
          repo="git-inline"
          files="src/index.ts"
        />
      </div>
    </div>
  );
};

const App = () => {
  const [selectedDemo, setSelectedDemo] = useState<string>('simple');

  const demos = {
    simple: <SimpleDemo />,
    multiFile: <MultiFileDemo />,
    directory: <DirectoryDemo />,
    wholeRepo: <WholeRepoDemo />,
    customConfig: <CustomConfigDemo />
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Git Inline Demo</h1>
      <div className="mb-6">
        <p className="text-gray-600">
          This demo showcases different ways to use the Git Inline component. 
          Select a demo below to see different usage patterns.
        </p>
      </div>

      {/* Demo selector */}
      <div className="mb-8">
        <label htmlFor="demoSelector" className="block mb-2 text-sm font-medium text-gray-700">Select a Demo</label>
        <select 
          id="demoSelector"
          className="border rounded p-2"
          value={selectedDemo}
          onChange={(e) => setSelectedDemo(e.target.value)}
        >
          <option value="simple">Basic Usage</option>
          <option value="multiFile">Multiple Files</option>
          <option value="directory">Directory Tracking</option>
          <option value="wholeRepo">Full Repository</option>
          <option value="customConfig">Custom Configuration</option>
        </select>
      </div>

      {/* Demo content */}
      <div className="relative">
        {demos[selectedDemo as keyof typeof demos]}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}