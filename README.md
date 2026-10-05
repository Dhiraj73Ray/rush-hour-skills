# rush-hour-skills

> A Rush Hour puzzle as your portfolio's skills section.
> Each car is a skill. Solve the puzzle → the skills reveal.

[![npm version](https://img.shields.io/npm/v/rush-hour-skills.svg)](https://www.npmjs.com/package/rush-hour-skills)
[![license](https://img.shields.io/npm/l/rush-hour-skills.svg)](./LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/rush-hour-skills)](https://bundlephobia.com/package/rush-hour-skills)

**Live demo:** https://rush-hour-skills.vercel.app

---

## ✨ Features

- 🚗 **Drag-and-drop puzzle** — solve a real Rush Hour board
- 🎨 **Fully themeable** — dark, light, or bring your own tokens
- 🧩 **Slot-based** — override any UI piece with your own component
- 🎛️ **Imperative API** — control it from outside via `ref`
- 🪝 **React hooks** — `useRushHour()`, `useBoard()`, `useStatus()`
- 📦 **Zero backend** — client-only, no server needed
- 💾 **Persistence** — optional localStorage save/resume
- ♿ **Accessible** — ARIA labels, keyboard focus, reduced-motion support
- 🧠 **Customizable engine** — plug your own `Board`, parser, or rules

---

## 📦 Installation

```bash
npm install rush-hour-skills
```

Peer dependencies:

```bash
npm install react react-dom
```

> Requires React 18+.

---

## 🚀 Quick Start

```jsx
import { StackLayout, PUZZLES } from 'rush-hour-skills';
import 'rush-hour-skills/style.css';

export default function App() {
  return <StackLayout puzzles={PUZZLES} />;
}
```

That's it. Board renders, cars drag, skills reveal on solve.

---

## 🧩 Custom Puzzles

Each puzzle defines the grid, the exit, and the skill map.

```js
const MY_PUZZLES = [
  {
    id: 'p1',
    title: 'Foundation',
    subtitle: 'The three languages everything starts with.',
    puzzle: '.A.. .A.C .A.C .BBC',   // 4x4 grid, whitespace ignored
    exit: { side: 'bottom', position: 1 },
    skills: { A: 'Python', B: 'JavaScript', C: 'SQL' },
  },
];

<StackLayout puzzles={MY_PUZZLES} />
```

**Grid rules:**
- Row-major string, `.` = empty cell
- Same letter = one car (must be 2+ cells)
- Car `A` is the **hero car** — it must reach the exit
- Exit `side`: `'top' | 'right' | 'bottom' | 'left'`
- Exit `position`: row index (for left/right) or col index (for top/bottom)

---

## 📋 Props

All props are **optional**. `<StackLayout />` works with zero config.

### Content

| Prop | Type | Default | Description |
|---|---|---|---|
| `puzzles` | `PuzzleConfig[]` | `PUZZLES` | Your puzzle list |
| `header` | `{ title?, subtitle? }` | `{ title: 'UNLOCK MY SKILLS' }` | Header text |

### Theming

| Prop | Type | Default | Description |
|---|---|---|---|
| `theme` | `'auto' \| 'light' \| 'dark' \| Tokens` | `'auto'` | Theme mode or custom token object |
| `tokens` | `Partial<Tokens>` | — | Override any CSS variable |
| `className` | `string` | `''` | Extra class on root `<section>` |
| `style` | `CSSProperties` | `{}` | Inline styles on root |
| `unstyled` | `boolean` | `false` | Skip bundled CSS (bring your own) |

### Layout

| Prop | Type | Default | Description |
|---|---|---|---|
| `layout.showHeader` | `boolean` | `true` | Render header |
| `layout.showStacks` | `boolean` | `true` | Render left/right mini-board stacks |
| `layout.showDots` | `boolean` | `true` | Render pagination dots |
| `layout.showStatus` | `boolean` | `true` | Render status pill |
| `layout.showCaption` | `boolean` | `true` | Render title · 01 / 06 |
| `layout.showReset` | `boolean` | `true` | Render reset button |
| `layout.showFooter` | `boolean` | `true` | Render footer row |
| `layout.stackSide` | `'auto' \| 'left' \| 'right' \| 'both' \| 'none'` | `'auto'` | Which stacks to show |

### Behavior

| Prop | Type | Default | Description |
|---|---|---|---|
| `behavior.autoAdvance` | `boolean` | `true` | Auto-slide after solving |
| `behavior.advanceDelay` | `number` | `900` | ms before auto-slide |
| `behavior.lockAhead` | `boolean` | `true` | Lock unreachable boards |
| `behavior.persist` | `boolean` | `false` | Save progress to localStorage |
| `behavior.storageKey` | `string` | `'rush-hour-skills-v1'` | localStorage key |
| `behavior.startIndex` | `number` | `0` | Starting puzzle index |
| `behavior.revealAllOnSolve` | `boolean` | `true` | Reveal all skills on solve |
| `behavior.revealOnDrag` | `boolean` | `true` | Reveal skill on touch |
| `behavior.swipeThreshold` | `number` | `60` | px to trigger swipe |

### Animation

| Prop | Type | Default | Description |
|---|---|---|---|
| `animation.slideMs` | `number` | `360` | Board slide duration |
| `animation.revealMs` | `number` | `600` | Skill reveal duration |
| `animation.blockMoveMs` | `number` | `110` | Car move duration |
| `animation.stackShiftMs` | `number` | `300` | Stack shift duration |
| `animation.exitGlowMs` | `number` | `2000` | Exit pulse duration |
| `animation.disable` | `boolean` | `false` | Disable all animations |

### Callbacks

| Prop | Signature | Fires when |
|---|---|---|
| `onSolvePuzzle` | `(id, state) => void` | A puzzle is solved |
| `onMove` | `(id, { car, steps, status, state }) => void` | A car is moved |
| `onReveal` | `(id, letter, skill) => void` | A car's skill is revealed |
| `onBoardChange` | `(id, index, direction) => void` | Active puzzle changes |
| `onReset` | `(id) => void` | Reset button pressed |
| `onSlide` | `(direction) => void` | Swipe navigation |
| `onReady` | `({ puzzles, total, getBoard }) => void` | Component mounts |

### Advanced

| Prop | Type | Description |
|---|---|---|
| `engine` | `typeof Board` | Custom Board class |
| `parser` | `(string) => { size, cars }` | Custom grid parser |
| `validator` | `(board) => void` | Validate each board at creation |
| `rules` | `RulesConfig` | Reserved for future constraints |

---

## 🎨 Slots

Override any UI piece by passing a component. If not provided, the default renders.

```jsx
<StackLayout
  slots={{
    header: ({ title, subtitle, index, total }) => (
      <h1 className="my-header">{title}</h1>
    ),
    footer: MyFooter,
    status: ({ status }) => <MyPill status={status} />,
    reset: ({ onClick }) => <button onClick={onClick}>↻</button>,
    caption: ({ config, index, total }) => (
      <span>{config.title} ({index + 1}/{total})</span>
    ),
    dots: ({ puzzles, activeIndex, solved, onSelect }) => (
      <MyDots items={puzzles} current={activeIndex} onPick={onSelect} />
    ),
    block: ({ letter, car, skillName, dragging, revealed, onPointerDown }) => (
      <MyCustomCar
        label={skillName}
        dragging={dragging}
        revealed={revealed}
        onPointerDown={onPointerDown}
      />
    ),
    lock: ({ id }) => <MyLock puzzleId={id} />,
    empty: () => <div>No puzzles yet</div>,
  }}
/>
```

### Slot props reference

| Slot | Props passed |
|---|---|
| `header` | `{ title, subtitle, index, total }` |
| `footer` | `{ ...state }` (full context) |
| `status` | `{ status }` |
| `reset` | `{ onClick }` |
| `caption` | `{ config, index, total }` |
| `dots` | `{ puzzles, activeIndex, solved, lockedIds, onSelect }` |
| `block` | `{ letter, car, skillName, revealed, dragging, size, cellSize, onPointerDown, onPointerMove, onPointerUp }` |
| `lock` | `{ id }` |
| `empty` | — |

> ⚠️ If you override `block`, you must position it absolutely inside the board grid. Base `<Block />` handles `left/top/width/height` via percentages.

---

## 🎛️ Imperative API (ref)

Control the section from outside.

```jsx
import { useRef } from 'react';
import { StackLayout } from 'rush-hour-skills';

export default function App() {
  const rhs = useRef();

  return (
    <>
      <button onClick={() => rhs.current.goNext()}>Next</button>
      <button onClick={() => rhs.current.reset()}>Reset</button>
      <button onClick={() => console.log(rhs.current.getState())}>
        Log state
      </button>

      <StackLayout ref={rhs} />
    </>
  );
}
```

### Methods

| Method | Returns | Description |
|---|---|---|
| `goNext()` | `void` | Advance to next puzzle (if solved) |
| `goPrev()` | `void` | Go back |
| `goTo(id)` | `void` | Jump to puzzle by id |
| `goToIndex(i)` | `void` | Jump by index |
| `reset()` | `void` | Reset active board |
| `getBoard(id)` | `Board \| undefined` | Live Board instance |
| `getActiveBoard()` | `Board \| null` | Active Board instance |
| `getState()` | `{ activeIndex, solved, status, direction }` | Snapshot |
| `setSolved(id, bool)` | `void` | Force solved state |
| `revealCar(id, letter)` | `void` | Reveal a specific car |

---

## 🪝 Context Hooks

Read Rush Hour state from inside slot components without prop drilling.

```jsx
import { useRushHour, useBoard, useStatus } from 'rush-hour-skills';

function MyFooter() {
  const { status, canGoNext, goNext, solved } = useRushHour();
  const solvedCount = Object.values(solved).filter(Boolean).length;

  return (
    <div>
      <span>Status: {status}</span>
      <span>Solved: {solvedCount}</span>
      <button disabled={!canGoNext} onClick={goNext}>
        Next →
      </button>
    </div>
  );
}

<StackLayout slots={{ footer: MyFooter }} />
```

### Available hooks

| Hook | Returns |
|---|---|
| `useRushHour()` | Full context (state + actions). Throws if outside `<StackLayout>` |
| `useRushHourOptional()` | Same, but returns `null` instead of throwing |
| `useBoard(id)` | `Board` instance for a puzzle id |
| `useActiveBoard()` | Active `Board` instance |
| `useStatus()` | `'ready' \| 'in-progress' \| 'solved'` |
| `useSolved()` | `{ [id]: boolean }` |
| `useIsSolved(id)` | `boolean` |
| `useConfig()` | Normalized config (tokens, layout, etc.) |

---

## 🎨 Theming with Tokens

Every visual aspect is driven by CSS variables. Override any via the `tokens` prop.

```jsx
<StackLayout
  tokens={{
    accent: '#ff6b35',
    success: '#00ff88',
    bg: '#0a0a0a',
    text: '#f5f5f5',
    boardSize: '320px',
    radius: '8px',
  }}
/>
```

Or pass a custom theme object directly:

```jsx
<StackLayout
  theme={{
    bg: '#1a1a2e',
    accent: '#e94560',
    panelGradient: 'linear-gradient(145deg, #16213e, #0f3460)',
  }}
/>
```

### Token reference

<details>
<summary><strong>Click to expand all tokens</strong></summary>

**Surface & text**
- `bg`, `text`, `muted`, `accent`, `success`

**Panels**
- `panelGradient`, `panelBorder`

**Board tray**
- `trayBg`, `trayShadow`

**Preview tray**
- `previewTrayBg`

**Buttons**
- `btnBg`, `btnBgHover`, `btnBorder`

**Dots**
- `dotBg`

**Cars**
- `blockMainBg`, `blockObstacleBg`, `blockDarkOverlay`, `blockShadow`, `blockRadius`

**Preview pieces**
- `previewPieceBg`, `previewMainBg`

**Exit**
- `exitBg`, `exitGlow`

**Lock**
- `lockBg`, `lockIconColor`

**Sizing**
- `boardSize`, `sectionPadding`, `sectionGap`, `sectionMaxWidth`, `radius`, `radiusInner`, `arrowPad`

</details>

You can also override via plain CSS:

```css
.rhs-section {
  --rhs-accent: #ff6b35;
  --rhs-board-size: 320px;
}
```

---

## 💾 Persistence

Save and resume progress automatically.

```jsx
<StackLayout
  behavior={{
    persist: true,
    storageKey: 'my-portfolio-rush-hour',
  }}
/>
```

Stored under `localStorage[storageKey]`:

```json
{
  "solved": { "p1": true, "p2": true },
  "activeIndex": 2,
  "revealed": { "p1": ["A", "B", "C"] }
}
```

---

## 🎭 Examples

### Minimal (zero config)

```jsx
<StackLayout />
```

### Branded portfolio

```jsx
<StackLayout
  header={{ title: 'MY SKILLS', subtitle: 'Solve to reveal' }}
  tokens={{ accent: '#ff6b35', boardSize: '320px' }}
  behavior={{ persist: true }}
/>
```

### Custom header + reset button

```jsx
<StackLayout
  layout={{ showStacks: false, showDots: false }}
  slots={{
    header: () => <h2 className="text-4xl font-bold">Solve the puzzle</h2>,
    reset: ({ onClick }) => (
      <button className="btn" onClick={onClick}>Restart</button>
    ),
  }}
/>
```

### External controls

```jsx
function App() {
  const rhs = useRef();

  return (
    <div>
      <nav>
        <button onClick={() => rhs.current.goPrev()}>←</button>
        <button onClick={() => rhs.current.goNext()}>→</button>
      </nav>
      <StackLayout ref={rhs} onSolvePuzzle={(id) => track(id)} />
    </div>
  );
}
```

### Analytics

```jsx
<StackLayout
  onSolvePuzzle={(id, state) => {
    gtag('event', 'puzzle_solved', { puzzle_id: id });
  }}
  onBoardChange={(id, index, dir) => {
    gtag('event', 'board_changed', { id, index, dir });
  }}
  onReady={({ total }) => {
    console.log(`Loaded ${total} puzzles`);
  }}
/>
```

### Only run one puzzle

```jsx
<StackLayout
  puzzles={[MY_PUZZLES[0]]}
  layout={{ showStacks: false, showDots: false, showCaption: false }}
  behavior={{ autoAdvance: false }}
/>
```

---

## 🧠 Custom Engine (Advanced)

Plug your own board logic:

```jsx
import { Board } from 'rush-hour-skills';

class MyBoard extends Board {
  isWon() {
    // Custom win condition
    return super.isWon() && this.cars.B?.col === 0;
  }
}

<StackLayout engine={MyBoard} />
```

Or custom parser:

```jsx
<StackLayout
  parser={(str) => {
    // Your own grid format
    return { size: 6, cars: { A: {...} } };
  }}
/>
```

---

## 📘 TypeScript

Full type definitions included. No `@types` needed.

```tsx
import type {
  StackLayoutProps,
  StackLayoutHandle,
  PuzzleConfig,
  Tokens,
  Slots,
} from 'rush-hour-skills';

const puzzle: PuzzleConfig = { /* ... */ };

const ref = useRef<StackLayoutHandle>(null);
```

---

## ♿ Accessibility

- `role="grid"` on the board
- `role="tablist"` on pagination dots
- `aria-live="polite"` on status pill
- `aria-label` on all interactive controls
- Full keyboard focus support (`focus-visible`)
- `prefers-reduced-motion` respected (auto-disables animations)

---

## 🌐 Browser Support

- Chrome / Edge 90+
- Firefox 90+
- Safari 15+
- All modern mobile browsers

Requires CSS `color-mix()` (with graceful fallback) and `mask-image`.

---

## 🔄 Migration from 0.1.x

**Zero breaking changes.** All existing code works:

```jsx
<StackLayout puzzles={MY} onSolvePuzzle={fn} theme="dark" />
```

New features added in 0.2.0:
- `tokens`, `layout`, `behavior`, `animation`, `slots` props
- Imperative `ref` API
- Context hooks (`useRushHour`, etc.)
- Persistence
- Custom engine / parser

---

## 🛠️ Development

```bash
git clone https://github.com/dhiraj73ray/rush-hour-skills.git
cd rush-hour-skills
npm install
npm run dev        # local playground
npm run build      # library build
```

---

## 📄 License

MIT © [Dhiraj Ray](https://github.com/dhiraj73ray)

---

## 🙏 Contributing

Issues and PRs welcome. If you build something cool with this, [let me know](https://github.com/dhiraj73ray)!

**If this helped you, drop a ⭐ on [GitHub](https://github.com/dhiraj73ray/rush-hour-skills) — it means a lot.**
