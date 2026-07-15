import { useCallback, useEffect, useRef, useState } from 'react';
import { getFileHistory } from '../github-api.js';
import type {
  CommitInfo,
  GitHistoryLoader,
  GitHistoryRequest,
} from '../types/git-types.js';

export interface UseGitHistoryOptions extends GitHistoryRequest {
  enabled?: boolean;
  loader?: GitHistoryLoader;
}

export interface UseGitHistoryResult {
  commits: CommitInfo[];
  error: Error | null;
  isLoading: boolean;
  refresh: () => void;
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export function useGitHistory({
  owner,
  repo,
  path,
  branch,
  limit = 10,
  page = 1,
  enabled = true,
  loader = getFileHistory,
}: UseGitHistoryOptions): UseGitHistoryResult {
  const [commits, setCommits] = useState<CommitInfo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [refreshKey, setRefreshKey] = useState(0);
  const requestId = useRef(0);

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setCommits([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const currentRequest = ++requestId.current;

    setIsLoading(true);
    setError(null);

    loader({
      owner,
      repo,
      path,
      branch,
      limit,
      page,
      signal: controller.signal,
    })
      .then((nextCommits) => {
        if (currentRequest === requestId.current && !controller.signal.aborted) {
          setCommits(nextCommits);
        }
      })
      .catch((nextError: unknown) => {
        if (currentRequest === requestId.current && !controller.signal.aborted) {
          setError(toError(nextError));
          setCommits([]);
        }
      })
      .finally(() => {
        if (currentRequest === requestId.current && !controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [
    owner,
    repo,
    path,
    branch,
    limit,
    page,
    enabled,
    loader,
    refreshKey,
  ]);

  return { commits, error, isLoading, refresh };
}
