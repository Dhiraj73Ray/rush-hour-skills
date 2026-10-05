/**
 * src/dev/App.jsx
 * ------------------------------------------------------------------
 * Local playground — try every prop live.
 * Run: npm run dev  →  http://localhost:5174
 * ------------------------------------------------------------------
 */

import { useRef, useState } from 'react';
import { PUZZLES } from '../constants.js';
import { StackLayout } from '../components/StackLayout.jsx';

/* ---------- tiny UI atoms ---------- */

function Toggle({ label, checked, onChange }) {
  return (
    <label className="dev-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="dev-field">
      <span className="dev-field-label">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Section({ title, children }) {
  return (
    <div className="dev-section">
      <div className="dev-section-title">{title}</div>
      <div className="dev-section-body">{children}</div>
    </div>
  );
}

/* ---------- main ---------- */

export default function App() {
  const rhs = useRef(null);

  /* ---- theme ---- */
  const [theme, setTheme] = useState('auto');

  /* ---- tokens ---- */
  const [accent, setAccent] = useState('');
  const [boardSize, setBoardSize] = useState('');
  const [radius, setRadius] = useState('');

  /* ---- layout ---- */
  const [layout, setLayout] = useState({
    showHeader: true,
    showStacks: true,
    showDots: true,
    showStatus: true,
    showCaption: true,
    showReset: true,
    showFooter: true,
  });

  /* ---- behavior ---- */
  const [behavior, setBehavior] = useState({
    autoAdvance: true,
    persist: false,
    lockAhead: true,
    revealOnDrag: true,
  });

  /* ---- animation ---- */
  const [animation] = useState({});

  /* ---- slots ---- */
  const [useCustomHeader, setUseCustomHeader] = useState(false);
  const [useCustomReset, setUseCustomReset] = useState(false);

  /* ---- live state readout ---- */
  const [liveState, setLiveState] = useState(null);

  /* ---- compose tokens ---- */
  const tokens = {};
  if (accent) tokens.accent = accent;
  if (boardSize) tokens.boardSize = boardSize;
  if (radius) tokens.radius = radius;

  /* ---- compose slots ---- */
  const slots = {};
  if (useCustomHeader) {
    slots.header = ({ title }) => (
      <h1 style={{
        fontFamily: 'Georgia, serif',
        fontSize: 40,
        margin: '0 0 24px',
        background: 'linear-gradient(90deg, #ff6b35, #56d9ff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
      }}>
        {title} ✨
      </h1>
    );
  }
  if (useCustomReset) {
    slots.reset = ({ onClick }) => (
      <button
        onClick={onClick}
        style={{
          flex: 1,
          padding: '10px 14px',
          borderRadius: 10,
          border: '2px dashed #ff6b35',
          background: 'transparent',
          color: '#ff6b35',
          fontWeight: 900,
          letterSpacing: '0.15em',
          fontSize: 10,
          cursor: 'pointer',
        }}
      >
        ↻ RESTART
      </button>
    );
  }

  return (
    <div className="dev-root">
      {/* ---------------- CONTROLS PANEL ---------------- */}
      <aside className="dev-panel">
        <div className="dev-panel-header">
          <span className="dev-badge">DEV</span>
          <h2>Playground</h2>
        </div>

        {/* Theme */}
        <Section title="Theme">
          <div className="dev-btn-row">
            {['auto', 'light', 'dark'].map((t) => (
              <button
                key={t}
                className={`dev-chip ${theme === t ? 'active' : ''}`}
                onClick={() => setTheme(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </Section>

        {/* Tokens */}
        <Section title="Tokens">
          <TextInput
            label="accent"
            value={accent}
            onChange={setAccent}
            placeholder="#56d9ff"
          />
          <TextInput
            label="boardSize"
            value={boardSize}
            onChange={setBoardSize}
            placeholder="400px"
          />
          <TextInput
            label="radius"
            value={radius}
            onChange={setRadius}
            placeholder="16px"
          />
        </Section>

        {/* Layout */}
        <Section title="Layout">
          {Object.keys(layout).map((k) => (
            <Toggle
              key={k}
              label={k}
              checked={layout[k]}
              onChange={(v) => setLayout((p) => ({ ...p, [k]: v }))}
            />
          ))}
        </Section>

        {/* Behavior */}
        <Section title="Behavior">
          {Object.keys(behavior).map((k) => (
            <Toggle
              key={k}
              label={k}
              checked={behavior[k]}
              onChange={(v) => setBehavior((p) => ({ ...p, [k]: v }))}
            />
          ))}
        </Section>

        {/* Slots */}
        <Section title="Slots">
          <Toggle
            label="custom header"
            checked={useCustomHeader}
            onChange={setUseCustomHeader}
          />
          <Toggle
            label="custom reset"
            checked={useCustomReset}
            onChange={setUseCustomReset}
          />
        </Section>

        {/* Ref actions */}
        <Section title="Ref actions">
          <div className="dev-btn-row wrap">
            <button
              className="dev-btn"
              onClick={() => rhs.current?.goNext()}
            >
              goNext
            </button>
            <button
              className="dev-btn"
              onClick={() => rhs.current?.goPrev()}
            >
              goPrev
            </button>
            <button
              className="dev-btn"
              onClick={() => rhs.current?.reset()}
            >
              reset
            </button>
            <button
              className="dev-btn"
              onClick={() => {
                const st = rhs.current?.getState();
                setLiveState(st);
              }}
            >
              getState
            </button>
            <button
              className="dev-btn"
              onClick={() => {
                rhs.current?.setSolved('p1', true);
                setLiveState(rhs.current?.getState());
              }}
            >
              setSolved(p1)
            </button>
            <button
              className="dev-btn"
              onClick={() => {
                rhs.current?.revealCar('p1', 'A');
                setLiveState(rhs.current?.getState());
              }}
            >
              revealCar(p1,A)
            </button>
          </div>
        </Section>

        {/* Live state */}
        {liveState && (
          <Section title="State">
            <pre className="dev-pre">
              {JSON.stringify(liveState, null, 2)}
            </pre>
          </Section>
        )}

        <div className="dev-panel-footer">
          <code>npm run dev</code> · port 5174
        </div>
      </aside>

      {/* ---------------- LIVE PREVIEW ---------------- */}
      <main className="dev-preview">
        <StackLayout
          ref={rhs}
          puzzles={PUZZLES}
          theme={theme}
          tokens={tokens}
          layout={layout}
          behavior={behavior}
          animation={animation}
          slots={slots}
          onSolvePuzzle={(id) => console.log('[solve]', id)}
          onMove={(id, ctx) => console.log('[move]', id, ctx)}
          onReveal={(id, letter, skill) =>
            console.log('[reveal]', id, letter, skill)
          }
          onBoardChange={(id, i, dir) =>
            console.log('[boardChange]', id, i, dir)
          }
          onReset={(id) => console.log('[reset]', id)}
          onSlide={(dir) => console.log('[slide]', dir)}
          onReady={({ total }) => console.log('[ready] total:', total)}
        />
      </main>
    </div>
  );
}