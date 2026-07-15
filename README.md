# git-inline

Display a file's GitHub history directly inside a React app.

Git Inline is intentionally small: give it a public repository and an explicit file path, and it renders a compact commit history with file diffs loaded on demand.

## Install

```bash
npm install git-inline
```

React 18 or newer is required.

## Quick start

```tsx
import { InlineGit } from 'git-inline';

export function HeaderHistory() {
  return (
    <InlineGit
      owner="teamleaderleo"
      repo="git-inline"
      path="src/components/inline-git.tsx"
      limit={10}
    />
  );
}
```

The browser can call GitHub directly for public repositories. GitHub's unauthenticated API rate limit applies.

## Private repositories and authenticated requests

Keep GitHub credentials on your server. Supply loaders that call your own endpoint:

```tsx
import type {
  GitCommitLoader,
  GitHistoryLoader,
} from 'git-inline';
import { InlineGit } from 'git-inline';

const historyLoader: GitHistoryLoader = async (request) => {
  const query = new URLSearchParams({
    owner: request.owner,
    repo: request.repo,
    path: request.path,
    branch: request.branch ?? '',
    limit: String(request.limit ?? 10),
    page: String(request.page ?? 1),
  });

  const response = await fetch(`/api/git-history?${query}`, {
    signal: request.signal,
  });

  if (!response.ok) {
    throw new Error('Unable to load Git history');
  }

  return response.json();
};

const commitLoader: GitCommitLoader = async (request) => {
  const query = new URLSearchParams({
    owner: request.owner,
    repo: request.repo,
    path: request.path,
    sha: request.sha,
  });

  const response = await fetch(`/api/git-commit?${query}`, {
    signal: request.signal,
  });

  if (!response.ok) {
    throw new Error('Unable to load commit details');
  }

  return response.json();
};

export function PrivateHistory() {
  return (
    <InlineGit
      owner="your-org"
      repo="private-repo"
      path="src/components/Header.tsx"
      historyLoader={historyLoader}
      commitLoader={commitLoader}
    />
  );
}
```

## Use the pieces separately

### Fetch data

```ts
import { getCommitDetails, getFileHistory } from 'git-inline';

const commits = await getFileHistory({
  owner: 'teamleaderleo',
  repo: 'git-inline',
  path: 'src/index.ts',
  limit: 10,
});

const commit = await getCommitDetails({
  owner: 'teamleaderleo',
  repo: 'git-inline',
  path: 'src/index.ts',
  sha: commits[0].sha,
});
```

The low-level functions also accept a `token` for server-side use.

### Use the hook

```tsx
import { GitHistory, useGitHistory } from 'git-inline';

export function CustomHistory() {
  const history = useGitHistory({
    owner: 'teamleaderleo',
    repo: 'git-inline',
    path: 'src/index.ts',
  });

  return (
    <GitHistory
      commits={history.commits}
      path="src/index.ts"
      isLoading={history.isLoading}
      error={history.error}
      onRetry={history.refresh}
    />
  );
}
```

### Render supplied data

`GitHistory` is a presentational component. Pass normalized `CommitInfo[]` data from GitHub, another Git provider, a local service, or a static build step.

## API

### `InlineGit`

| Prop | Type | Purpose |
| --- | --- | --- |
| `owner` | `string` | GitHub repository owner |
| `repo` | `string` | GitHub repository name |
| `path` | `string` | Explicit repository-relative file path |
| `branch` | `string` | Optional branch or ref |
| `limit` | `number` | Commit count, clamped from 1 to 100 |
| `page` | `number` | GitHub API page, starting at 1 |
| `enabled` | `boolean` | Enables or pauses requests |
| `historyLoader` | `GitHistoryLoader` | Replaces the history request |
| `commitLoader` | `GitCommitLoader` | Replaces the lazy detail request |

`InlineGit` also accepts the visual props from `GitHistory`, including `title`, `className`, `style`, and `emptyMessage`.

## Design choices

- File paths are explicit. Bundlers do not reliably expose the source file that rendered a component.
- Commit summaries load first. File patches load only when a commit expands.
- Styling ships inside the component, with no CSS framework requirement.
- Data loaders are replaceable, so private repositories and other Git providers stay possible without placing credentials in client code.

## Development

```bash
npm install
npm run dev
npm test
npm run build
```

## License

MIT
