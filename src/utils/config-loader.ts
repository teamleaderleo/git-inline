interface GitInlineConfig {
  owner: string;
  repo: string;
  defaultBranch?: string;
  sourceRoot?: string;
}

// Add type declaration for our injected config
declare const __GIT_INLINE_CONFIG__: GitInlineConfig;

const defaultConfig: GitInlineConfig = {
  owner: 'teamleaderleo',
  repo: 'git-inline',
  sourceRoot: 'src'
};

export function loadConfig(): GitInlineConfig {
  // In development/browser, use the injected config
  if (typeof __GIT_INLINE_CONFIG__ !== 'undefined') {
    console.log('Found injected config:', __GIT_INLINE_CONFIG__);
    return __GIT_INLINE_CONFIG__;
  }
  
  console.log('Using default config:', defaultConfig);
  return defaultConfig;
}

export type { GitInlineConfig };
export { defaultConfig };