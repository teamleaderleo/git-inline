import React, { useEffect, useState } from 'react';
import GitHistory from './git-history';
import { CommitInfo } from '../types/git-types';
import { getFileHistory } from '../github-api';
import { loadConfig } from '../utils/config-loader';

type FileSpec = string | {
  path: string;
  recursive?: boolean;
} | '*';  // represents entire repo

interface InlineGitProps {
  owner?: string;
  repo?: string;
  files?: FileSpec | FileSpec[];
}

function getRelativePath(url: string, sourceRoot: string = 'src'): string | null {
  try {
    // Find where the source root is in the path
    const rootIndex = url.indexOf(sourceRoot);
    if (rootIndex === -1) return null;
    
    // Get everything after the source root
    let path = url.slice(rootIndex);
    
    // Clean up any query params or hash
    path = path.split('?')[0].split('#')[0];
    
    return path;
  } catch (e) {
    console.warn('Failed to parse path:', e);
    return null;
  }
}

const defaultConfig = {
  owner: 'teamleaderleo',
  repo: 'git-inline',
  sourceRoot: 'src'  // Default source root
};

const InlineGit: React.FC<InlineGitProps> = ({ 
  owner: propsOwner,
  repo: propsRepo,
  files 
}) => {
  const [commits, setCommits] = useState<CommitInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [debug, setDebug] = useState<any>({});

  useEffect(() => {
    const initConfig = async () => {
      try {
        const loadedConfig = await loadConfig();
        console.log('Loaded config:', loadedConfig);
        setConfig({ ...defaultConfig, ...loadedConfig });
      } catch (err) {
        console.error('Config loading error:', err);
        setError(`Config loading failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    initConfig();
  }, []);

  const owner = propsOwner || config.owner;
  const repo = propsRepo || config.repo;

  useEffect(() => {
    const loadCommits = async () => {
      setIsLoading(true);
      setError(null);
      setDebug({});
      
      try {
        if (!owner || !repo) {
          throw new Error('Owner and repo must be specified either in props or config');
        }

        setDebug((prev: Record<string, any>) => ({ ...prev, owner, repo }));

        let paths: string[] = [];
        
        // If no files specified, try to get current module path
        if (!files) {
          try {
            const currentFile = import.meta.url;
            console.log('Current file URL:', currentFile);
            
            const repoPath = getRelativePath(currentFile, config.sourceRoot);
            if (!repoPath) {
              throw new Error(`Could not find source root "${config.sourceRoot}" in path`);
            }
            
            console.log('Extracted repo path:', repoPath);
            setDebug((prev: Record<string, any>) => ({ 
              ...prev, 
              currentFile,
              sourceRoot: config.sourceRoot,
              extractedPath: repoPath 
            }));
            
            paths = [repoPath];
          } catch (e) {
            console.error('Could not auto-detect current file:', e);
            throw new Error('No files specified and could not auto-detect current file');
          }
        } else {
          // Deal with various file specifications
          const fileSpecs = Array.isArray(files) ? files : [files];
          paths = fileSpecs.map(spec => {
            if (spec === '*') {
              return '';  // Empty string in GitHub API means all files
            }
            
            if (typeof spec === 'string') {
              // Always prefix with sourceRoot if it doesn't start with it
              return spec.startsWith(config.sourceRoot) ? spec : `${config.sourceRoot}/${spec}`;
            }
            
            if (spec.recursive) {
              const basePath = spec.path.startsWith(config.sourceRoot) ? 
                spec.path : 
                `${config.sourceRoot}/${spec.path}`;
              return `${basePath}/**/*`;
            }
            
            return spec.path.startsWith(config.sourceRoot) ? 
              spec.path : 
              `${config.sourceRoot}/${spec.path}`;
          });
        }

        console.log('Fetching history for paths:', paths);
        setDebug((prev: Record<string, any>) => ({ ...prev, paths }));

        const history = await getFileHistory(owner, repo, paths);
        console.log('Received history:', history);
        setDebug((prev: Record<string, any>) => ({ ...prev, history }));
        
        if (!history || history.length === 0) {
          throw new Error('No commits found for the specified path(s)');
        }

        setCommits(history);
      } catch (err) {
        console.error('Error loading commits:', err);
        setError(err instanceof Error ? err.message : 'Failed to load commit history');
      } finally {
        setIsLoading(false);
      }
    };

    loadCommits();
  }, [owner, repo, files, config.sourceRoot]);

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg">
        <div className="text-red-500 text-sm mb-2">Failed to load git history: {error}</div>
        <details className="text-xs text-gray-600">
          <summary>Debug Info</summary>
          <pre className="mt-2 p-2 bg-gray-50 rounded">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-gray-400 text-sm">
        Loading commit history...
        <details className="text-xs text-gray-600 mt-2">
          <summary>Debug Info</summary>
          <pre className="mt-2 p-2 bg-gray-50 rounded">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  return commits.length > 0 ? (
    <GitHistory commits={commits} />
  ) : (
    <div className="text-gray-400 text-sm">
      No commits found
      <details className="text-xs text-gray-600 mt-2">
        <summary>Debug Info</summary>
        <pre className="mt-2 p-2 bg-gray-50 rounded">
          {JSON.stringify(debug, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default InlineGit;