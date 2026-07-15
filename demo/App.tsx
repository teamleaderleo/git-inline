import { createRoot } from 'react-dom/client';
import { InlineGit } from '../src';

const pageStyle = {
  minHeight: '100vh',
  padding: '48px 20px',
  background: '#f6f8fa',
  color: '#1f2328',
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const contentStyle = {
  width: '100%',
  maxWidth: 760,
  margin: '0 auto',
};

export default function App() {
  return (
    <main style={pageStyle}>
      <div style={contentStyle}>
        <p style={{ margin: '0 0 8px', color: '#57606a', fontSize: 13 }}>
          Git Inline demo
        </p>
        <h1 style={{ margin: '0 0 12px', fontSize: 32 }}>
          The history of the history component
        </h1>
        <p style={{ margin: '0 0 28px', color: '#57606a', lineHeight: 1.6 }}>
          Expand a commit to fetch the file-specific patch from GitHub.
        </p>

        <InlineGit
          owner="teamleaderleo"
          repo="git-inline"
          path="src/components/inline-git.tsx"
          limit={8}
        />
      </div>
    </main>
  );
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(<App />);
}
