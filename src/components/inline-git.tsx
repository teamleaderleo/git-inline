import { useCallback } from 'react';
import { getCommitDetails } from '../github-api.js';
import { useGitHistory } from '../hooks/use-git-history.js';
import {
  GitCommitLoader,
  GitHistoryLoader,
} from '../types/git-types.js';
import GitHistory, { GitHistoryProps } from './git-history.js';

export interface InlineGitProps
  extends Omit<
    GitHistoryProps,
    'commits' | 'path' | 'isLoading' | 'error' | 'onRetry' | 'loadCommitDetails'
  > {
  owner: string;
  repo: string;
  path: string;
  branch?: string;
  limit?: number;
  page?: number;
  enabled?: boolean;
  historyLoader?: GitHistoryLoader;
  commitLoader?: GitCommitLoader;
}

export function InlineGit({
  owner,
  repo,
  path,
  branch,
  limit = 10,
  page = 1,
  enabled = true,
  historyLoader,
  commitLoader = getCommitDetails,
  ...historyProps
}: InlineGitProps) {
  const { commits, error, isLoading, refresh } = useGitHistory({
    owner,
    repo,
    path,
    branch,
    limit,
    page,
    enabled,
    loader: historyLoader,
  });

  const loadCommitDetails = useCallback(
    (sha: string) => commitLoader({ owner, repo, path, sha }),
    [commitLoader, owner, path, repo],
  );

  return (
    <GitHistory
      {...historyProps}
      commits={commits}
      path={path}
      isLoading={isLoading}
      error={error}
      onRetry={refresh}
      loadCommitDetails={loadCommitDetails}
    />
  );
}

export default InlineGit;
