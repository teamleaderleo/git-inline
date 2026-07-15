export { getCommitDetails, getFileHistory } from './github-api';
export { useGitHistory } from './hooks/use-git-history';
export type {
  UseGitHistoryOptions,
  UseGitHistoryResult,
} from './hooks/use-git-history';
export { default as GitHistory } from './components/git-history';
export type { GitHistoryProps } from './components/git-history';
export { default as InlineGit } from './components/inline-git';
export type { InlineGitProps } from './components/inline-git';
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
} from './types/git-types';
