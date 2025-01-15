# git-inline

Visualize Git history inline with your web app!

[![npm version](https://badge.fury.io/js/git-inline.svg)](https://www.npmjs.com/package/git-inline)

## Installation

```bash
npm install git-inline
```

## Usage

```typescript
// Just track the current file!
<InlineGit />  // Uses config for owner/repo

// Track a specific file!
<InlineGit files="src/components/Header.tsx" />

// Track multiple specific files!
<InlineGit files={[
  'src/components/Header.tsx',
  'src/components/Footer.tsx'
]} />

// Track the entire directory!
<InlineGit files={{ 
  path: 'src/components',
  recursive: true 
}} />

// Track the entire repo!
<InlineGit files="*" />

// Override config settings!
<InlineGit 
  owner="different-owner"
  repo="different-repo"
  files="src/components/Header.tsx"
/>

```

## Features

- Fetch Git commit history for specific files
- More features coming soon!

## Contributing

Pull requests are welcome! For major changes, please open an issue first.
