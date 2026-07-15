export { getCommitDetails, getFileHistory } from './github-api.js';
export { useGitHistory } from './hooks/use-git-history.js';
export type {
  UseGitHistoryOptions,
  UseGitHistoryResult,
} from './hooks/use-git-history.js';
export { default as GitHistory } from './components/git-history.js';
export type { GitHistoryProps } from './components/git-history.js';
export { default as InlineGit } from './components/inline-git.js';
export type { InlineGitProps } from './components/inline-git.js';
export type {
  CommitInfo,
  GitAuthor,
  GitCommitLoader,
  GitCommitRequest,
  GitFileChange,
  GitHistoryLoader,
  GitHistoryRequest,
  GitHubCommitRequest,
  GitHubHistoryRequest,
} from './types/git-types.js';
