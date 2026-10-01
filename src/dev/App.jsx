import { useState } from 'react';
import { PUZZLES } from '../constants.js';
import { StackLayout } from '../components/StackLayout.jsx';

export default function App() {
  const [theme, setTheme] = useState('auto');

  return (
    <>
      {/* <div
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 9999,
          display: 'flex',
          gap: 4,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {['auto', 'light', 'dark'].map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              padding: '6px 10px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              border: '1px solid rgba(128,128,128,0.3)',
              background: theme === t ? 'rgba(86,217,255,0.2)' : 'transparent',
              color: theme === t ? '#56d9ff' : '#888',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div> */}
      <StackLayout theme={theme} />
    </>
  );
}