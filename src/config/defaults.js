/**
 * src/config/defaults.js
 * ------------------------------------------------------------------
 * Single source of truth for every default value used by <StackLayout />.
 * Pure data — no imports, no logic, no side effects.
 * ------------------------------------------------------------------
 */

/**
 * Theme tokens (dark = base). Every key here becomes a CSS variable
 * `--rhs-<kebab-case>` on the root section element.
 *
 * Example: `panelGradient` → `--rhs-panel-gradient`
 */
export const DEFAULT_TOKENS = {
  // ---- Surface / text ----
  bg: '#080d19',
  text: '#edf2ff',
  muted: '#7f8ba5',
  accent: '#56d9ff',
  success: '#48e09b',

  // ---- Panels (frames around boards & stacks) ----
  panelGradient: 'linear-gradient(145deg, #1c2536, #0d1420)',
  panelBorder: 'rgba(255, 255, 255, 0.06)',

  // ---- Board tray (the grid background inside a board) ----
  trayBg: '#364255',
  trayShadow:
    'inset 0 3px 6px rgba(0, 0, 0, 0.55), inset 0 -1px 0 rgba(255, 255, 255, 0.06)',

  // ---- Preview tray (mini boards on the left/right stacks) ----
  previewTrayBg: '#2a3547',

  // ---- Buttons / pills ----
  btnBg: 'rgba(139, 124, 255, 0.1)',
  btnBgHover: 'rgba(139, 124, 255, 0.2)',
  btnBorder: 'rgba(255, 255, 255, 0.1)',

  // ---- Dots (pagination) ----
  dotBg: 'rgba(255, 255, 255, 0.15)',

  // ---- Blocks (cars on the active board) ----
  blockMainBg: 'linear-gradient(160deg, #e63946 0%, #d62828 55%, #b81d1d 100%)',
  blockObstacleBg:
    'linear-gradient(160deg, #6b7280 0%, #4b5563 55%, #374151 100%)',
  blockDarkOverlay: 'rgba(13, 18, 28, 0.958)',
  blockShadow: '0 3px 6px rgba(0, 0, 0, 0.4)',
  blockRadius: '7px',

  // ---- Preview pieces (mini boards) ----
  previewPieceBg:
    'linear-gradient(160deg, #6b7280 0%, #4b5563 55%, #374151 100%)',
  previewMainBg:
    'linear-gradient(160deg, #e63946 0%, #d62828 55%, #b81d1d 100%)',

  // ---- Exit slot ----
  exitBg: 'linear-gradient(180deg, #ef4444 0%, #dc2626 60%, #b91c1c 100%)',
  exitGlow: '0 0 14px rgba(239, 68, 68, 0.55)',

  // ---- Lock overlay (on locked mini boards) ----
  lockBg: 'rgba(72, 88, 116, 0.45)',
  lockIconColor: 'rgba(255, 255, 255, 0.95)',

  // ---- Sizing ----
  boardSize: 'clamp(240px, min(35vw, 55vh), 400px)',
  sectionPadding: '20px',
  sectionGap: '40px',
  sectionMaxWidth: '1400px',
  radius: '16px',            // outer panel radius
  radiusInner: '11px',       // inner tray radius
  arrowPad: '14px',          // space around board for slide arrows
};

/**
 * Light theme overrides. Merged on top of DEFAULT_TOKENS when
 * theme === 'light', or when theme === 'auto' and the OS prefers light.
 * Keys not listed here fall through to the dark defaults.
 */
export const LIGHT_TOKENS = {
  bg: '#dfe5ef',
  text: '#20283a',
  muted: '#68738a',
  accent: '#3c91b2',
  success: '#29996b',

  panelGradient: 'linear-gradient(145deg, #eef1f6, #d7deea)',
  panelBorder: 'rgba(55, 65, 90, 0.15)',

  trayBg: '#b8c0cc',
  trayShadow:
    'inset 0 3px 6px rgba(55, 65, 90, 0.3), inset 0 -1px 0 rgba(255, 255, 255, 0.5)',

  previewTrayBg: '#a8b0bc',

  btnBg: 'rgba(116, 100, 217, 0.1)',
  btnBgHover: 'rgba(116, 100, 217, 0.2)',
  btnBorder: 'rgba(55, 65, 90, 0.15)',

  dotBg: 'rgba(55, 65, 90, 0.15)',

  blockDarkOverlay: 'rgba(50, 60, 80, 0.9)',
  blockShadow: '0 3px 6px rgba(55, 65, 90, 0.25)',

  previewPieceBg:
    'linear-gradient(160deg, #9aa3b2 0%, #7c8697 55%, #64707f 100%)',
  previewMainBg:
    'linear-gradient(160deg, #ef4444 0%, #dc2626 55%, #b91c1c 100%)',

  lockBg: 'rgba(220, 226, 236, 0.78)',
  lockIconColor: 'rgba(55, 65, 90, 0.75)',
};

/**
 * Header defaults — title & optional subtitle above the stage.
 */
export const DEFAULT_HEADER = {
  title: 'UNLOCK MY SKILLS',
  subtitle: null,
};

/**
 * Layout toggles — which UI parts to render at all.
 * `stackSide`: 'auto' | 'left' | 'right' | 'both' | 'none'
 */
export const DEFAULT_LAYOUT = {
  showHeader: true,
  showStacks: true,
  showDots: true,
  showStatus: true,
  showCaption: true,
  showReset: true,
  showFooter: true,
  stackSide: 'auto',
};

/**
 * Behavior — runtime logic flags.
 */
export const DEFAULT_BEHAVIOR = {
  autoAdvance: true,         // auto-slide after solving
  advanceDelay: 900,         // ms before auto-slide
  lockAhead: true,           // show lock overlay on far-ahead boards
  persist: false,            // save state to localStorage
  storageKey: 'rush-hour-skills-v1',
  startIndex: 0,
  loop: false,
  revealAllOnSolve: true,    // reveal every skill once solved
  revealOnDrag: true,        // reveal a car's skill on first touch
  swipeThreshold: 60,        // px of horizontal drag to change board
};

/**
 * Animation — all timings in ms.
 * `disable: true` forces instant transitions (also auto-enabled
 * when user prefers-reduced-motion).
 */
export const DEFAULT_ANIMATION = {
  slideMs: 360,
  revealMs: 600,
  blockMoveMs: 110,
  stackShiftMs: 300,
  exitGlowMs: 2000,
  disable: false,
};

/**
 * Rules — optional gameplay constraints / hooks.
 * Set any to `null` to disable.
 */
export const DEFAULT_RULES = {
  maxMoves: null,      // number | null
  hint: null,          // (board) => { car, steps } | null
  canAdvance: null,    // (id, state) => boolean | null
  winCondition: null,  // (board) => boolean | null
};