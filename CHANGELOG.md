# Changelog

## [0.1.0] - Unreleased

### Changed

- Rebuilt the public API around one explicit repository file path.
- Replaced bundler-injected configuration with ordinary React props and replaceable loaders.
- Loaded commit summaries first and file-specific patches only when a commit expands.
- Made the history viewer flow inline with its parent and removed the Tailwind dependency.
- Added declaration and source-map generation for published builds.
- Moved React to peer dependencies and narrowed the runtime dependency list to Octokit.

### Added

- `useGitHistory` hook.
- `getCommitDetails` for lazy file-diff requests.
- Custom history and commit loader support for private repositories and other Git providers.
- A small self-referential demo and CI build workflow.

### Removed

- Current-file auto-detection.
- Directory and multi-file wildcard handling.
- Vite-specific config injection and runtime debug panels.

## [0.0.2] - 2025-01-15

### Added

- Auto-detection of current file paths.
- Support for directory-wide Git history tracking.
- Multiple-file tracking support.
- Configurable source root directory.
- Improved error handling and debugging information.
- Better path resolution for various project layouts.

### Fixed

- ESM and TypeScript configuration issues.
- Path resolution in different environments.
- Config file loading and detection.
- GitHub API path handling.

## [0.0.1] - Initial release

- Basic Git history visualization.
- GitHub API integration.
- Simple file tracking.
