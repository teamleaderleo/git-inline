// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { lilconfig } from 'lilconfig';
import { createRequire } from 'module';
import { register } from 'ts-node';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Register ts-node with proper ESM settings
register({
  esm: true,
  experimentalSpecifierResolution: 'node',
  moduleTypes: {
    "**/*.ts": "esm"
  }
});

async function loadGitInlineConfig() {
  try {
    const explorer = lilconfig('gitinline', {
      searchPlaces: [
        'gitinline.config.ts',
        'gitinline.config.js',
        '.gitinlinerc',
        '.gitinlinerc.json',
        'package.json'
      ],
      loaders: {
        '.ts': async (filepath) => {
          // For TypeScript files, use dynamic import
          const { pathToFileURL } = await import('url');
          const module = await import(pathToFileURL(filepath).href);
          return module.default || module;
        }
      }
    });
    
    const result = await explorer.search();
    return result?.config || {
      owner: 'teamleaderleo',
      repo: 'git-inline'
    };
  } catch (error) {
    console.warn('Error in loadGitInlineConfig:', error);
    return {
      owner: 'teamleaderleo',
      repo: 'git-inline'
    };
  }
}

export default defineConfig(async () => {
  const gitInlineConfig = await loadGitInlineConfig();
  
  return {
    plugins: [react()],
    root: './demo',
    define: {
      '__GIT_INLINE_CONFIG__': JSON.stringify(gitInlineConfig)
    },
    // Add proper resolution for TypeScript files
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    }
  };
});