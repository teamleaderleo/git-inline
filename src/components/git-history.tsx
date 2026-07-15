import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { CommitInfo } from '../types/git-types.js';

export interface GitHistoryProps {
  commits: CommitInfo[];
  path?: string;
  title?: ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  loadCommitDetails?: (sha: string) => Promise<CommitInfo>;
  className?: string;
  style?: CSSProperties;
  emptyMessage?: ReactNode;
}

const styles: Record<string, CSSProperties> = {
  root: {
    width: '100%',
    maxWidth: 720,
    border: '1px solid #d8dee4',
    borderRadius: 12,
    background: '#ffffff',
    color: '#1f2328',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '14px 16px',
    borderBottom: '1px solid #d8dee4',
  },
  heading: {
    margin: 0,
    fontSize: 14,
    fontWeight: 650,
    lineHeight: 1.4,
  },
  path: {
    color: '#57606a',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: 12,
    overflowWrap: 'anywhere',
  },
  state: {
    padding: 16,
    color: '#57606a',
    fontSize: 13,
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  item: {
    borderBottom: '1px solid #d8dee4',
  },
  trigger: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) auto',
    gap: 12,
    padding: '14px 16px',
    border: 0,
    background: 'transparent',
    color: 'inherit',
    textAlign: 'left',
    cursor: 'pointer',
  },
  message: {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.45,
    overflowWrap: 'anywhere',
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    color: '#57606a',
    fontSize: 12,
    lineHeight: 1.4,
  },
  sha: {
    alignSelf: 'start',
    padding: '2px 6px',
    border: '1px solid #d0d7de',
    borderRadius: 6,
    background: '#f6f8fa',
    color: '#57606a',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: 11,
  },
  details: {
    padding: '0 16px 16px',
  },
  stats: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
    color: '#57606a',
    fontSize: 12,
  },
  patch: {
    maxHeight: 360,
    margin: 0,
    padding: 12,
    overflow: 'auto',
    border: '1px solid #d0d7de',
    borderRadius: 8,
    background: '#f6f8fa',
    color: '#1f2328',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: 11,
    lineHeight: 1.55,
    whiteSpace: 'pre',
  },
  link: {
    display: 'inline-block',
    marginTop: 10,
    color: '#0969da',
    fontSize: 12,
    textDecoration: 'none',
  },
  retry: {
    marginLeft: 8,
    padding: '3px 8px',
    border: '1px solid #d0d7de',
    borderRadius: 6,
    background: '#f6f8fa',
    color: '#1f2328',
    cursor: 'pointer',
  },
};

function formatDate(date: string): string {
  if (!date) {
    return 'Unknown date';
  }

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleString();
}

function firstLine(message: string): string {
  return message.split('\n')[0] || 'Untitled commit';
}

export function GitHistory({
  commits,
  path,
  title = 'File history',
  isLoading = false,
  error = null,
  onRetry,
  loadCommitDetails,
  className,
  style,
  emptyMessage = 'No commits found for this file.',
}: GitHistoryProps) {
  const [expandedSha, setExpandedSha] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, CommitInfo>>({});
  const [loadingSha, setLoadingSha] = useState<string | null>(null);
  const [detailErrors, setDetailErrors] = useState<Record<string, Error>>({});

  useEffect(() => {
    setExpandedSha(null);
    setDetails({});
    setLoadingSha(null);
    setDetailErrors({});
  }, [path]);

  const toggleCommit = useCallback(
    async (commit: CommitInfo) => {
      if (expandedSha === commit.sha) {
        setExpandedSha(null);
        return;
      }

      setExpandedSha(commit.sha);

      if (!loadCommitDetails || commit.file || details[commit.sha]) {
        return;
      }

      setLoadingSha(commit.sha);
      setDetailErrors((current) => {
        const next = { ...current };
        delete next[commit.sha];
        return next;
      });

      try {
        const detail = await loadCommitDetails(commit.sha);
        setDetails((current) => ({ ...current, [commit.sha]: detail }));
      } catch (nextError) {
        const errorValue =
          nextError instanceof Error ? nextError : new Error(String(nextError));
        setDetailErrors((current) => ({
          ...current,
          [commit.sha]: errorValue,
        }));
      } finally {
        setLoadingSha((current) => (current === commit.sha ? null : current));
      }
    },
    [details, expandedSha, loadCommitDetails],
  );

  return (
    <section className={className} style={{ ...styles.root, ...style }}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.heading}>{title}</h2>
          {path ? <div style={styles.path}>{path}</div> : null}
        </div>
      </header>

      {isLoading ? <div style={styles.state}>Loading commit history…</div> : null}

      {!isLoading && error ? (
        <div style={styles.state} role="alert">
          {error.message}
          {onRetry ? (
            <button type="button" onClick={onRetry} style={styles.retry}>
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      {!isLoading && !error && commits.length === 0 ? (
        <div style={styles.state}>{emptyMessage}</div>
      ) : null}

      {!isLoading && !error && commits.length > 0 ? (
        <ol style={styles.list}>
          {commits.map((commit, index) => {
            const expanded = expandedSha === commit.sha;
            const detail = details[commit.sha] ?? commit;
            const detailError = detailErrors[commit.sha];
            const panelId = `git-inline-${commit.sha}`;

            return (
              <li
                key={commit.sha}
                style={index === commits.length - 1 ? undefined : styles.item}
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => void toggleCommit(commit)}
                  style={styles.trigger}
                >
                  <div>
                    <p style={styles.message}>{firstLine(commit.message)}</p>
                    <div style={styles.meta}>
                      <span>{commit.author.name}</span>
                      <span>{formatDate(commit.date)}</span>
                    </div>
                  </div>
                  <code style={styles.sha}>{commit.shortSha}</code>
                </button>

                {expanded ? (
                  <div id={panelId} style={styles.details}>
                    {loadingSha === commit.sha ? (
                      <div style={styles.state}>Loading file diff…</div>
                    ) : null}

                    {detailError ? (
                      <div style={styles.state} role="alert">
                        {detailError.message}
                      </div>
                    ) : null}

                    {!loadingSha && !detailError && detail.file ? (
                      <>
                        <div style={styles.stats}>
                          <span>{detail.file.status}</span>
                          <span>+{detail.file.additions}</span>
                          <span>−{detail.file.deletions}</span>
                        </div>
                        {detail.file.patch ? (
                          <pre style={styles.patch}>{detail.file.patch}</pre>
                        ) : (
                          <div style={styles.state}>Patch unavailable for this file.</div>
                        )}
                      </>
                    ) : null}

                    {!loadingSha && !detailError && !detail.file ? (
                      <div style={styles.state}>Open the commit to inspect its changes.</div>
                    ) : null}

                    <a
                      href={detail.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.link}
                    >
                      View commit on GitHub ↗
                    </a>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : null}
    </section>
  );
}

export default GitHistory;
