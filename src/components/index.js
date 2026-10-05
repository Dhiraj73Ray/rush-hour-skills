/**
 * src/index.js
 * ------------------------------------------------------------------
 * Public API of rush-hour-skills.
 *
 * Exports are grouped:
 *   1. Primary component
 *   2. Default data
 *   3. Context hooks (for slot overrides)
 *   4. Sub-components (advanced — for custom layouts)
 *   5. Engine (Board + parser)
 *   6. Config utilities & defaults
 * ------------------------------------------------------------------
 */

/* ---------- 1. PRIMARY ---------- */
export { StackLayout } from './components/StackLayout.jsx';
export { default as StackLayoutDefault } from './components/StackLayout.jsx';

/* ---------- 2. DATA ---------- */
export { PUZZLES, STORAGE_KEY } from '../constants.js';

/* ---------- 3. CONTEXT HOOKS ---------- */
export {
  useRushHour,
  useRushHourOptional,
  useBoard,
  useActiveBoard,
  useStatus,
  useSolved,
  useIsSolved,
  useConfig,
} from './context.js';

/* ---------- 4. SUB-COMPONENTS (advanced usage) ---------- */
export { Header } from './components/Header.jsx';
export { StatusPill } from './components/StatusPill.jsx';
export { ResetButton } from './components/ResetButton.jsx';
export { Caption } from './components/Caption.jsx';
export { Dots } from './components/Dots.jsx';
export { Lock } from './components/Lock.jsx';
export { Stack } from './components/Stack.jsx';
export { MiniBoard } from './components/MiniBoard.jsx';
export { Block } from './components/Block.jsx';
export { BoardPreview } from './components/BoardPreview.jsx';

/* ---------- 5. ENGINE ---------- */
export { Board, parsePuzzle, detectSize } from './engine/index.js';

/* ---------- 6. CONFIG UTILITIES & DEFAULTS ---------- */
export {
  DEFAULT_TOKENS,
  LIGHT_TOKENS,
  DEFAULT_HEADER,
  DEFAULT_LAYOUT,
  DEFAULT_BEHAVIOR,
  DEFAULT_ANIMATION,
  DEFAULT_RULES,
} from './config/defaults.js';

export { toCssVars, mergeTokens } from './config/toCssVars.js';
export { normalizeConfig, resolveTokens } from './config/normalize.js';

/* ---------- 7. HOOKS (advanced) ---------- */
export { useRushHourState } from './hooks/useRushHourState.js';
export { useSwipe } from './hooks/useSwipe.js';