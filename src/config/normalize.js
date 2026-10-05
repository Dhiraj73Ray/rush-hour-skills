/**
 * src/config/normalize.js
 * ------------------------------------------------------------------
 * Merge user props with defaults → one predictable config object.
 * Handles theme resolution (auto/light/dark/custom object) too.
 * ------------------------------------------------------------------
 */

import {
  DEFAULT_TOKENS,
  LIGHT_TOKENS,
  DEFAULT_HEADER,
  DEFAULT_LAYOUT,
  DEFAULT_BEHAVIOR,
  DEFAULT_ANIMATION,
  DEFAULT_RULES,
} from './defaults.js';
import { mergeTokens } from './toCssVars.js';

/* ---------- small helpers ---------- */

const isPlainObject = (v) =>
  v != null && typeof v === 'object' && !Array.isArray(v);

/** Shallow-merge; only plain objects are merged, primitives overwrite. */
function merge(base, override) {
  if (!isPlainObject(override)) return override == null ? base : override;
  const out = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (v === undefined) continue;
    out[k] = isPlainObject(v) && isPlainObject(base?.[k])
      ? merge(base[k], v)
      : v;
  }
  return out;
}

/** Detect OS-level light preference (safe on server). */
function systemPrefersLight() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: light)').matches;
}

/** Detect user's reduced-motion preference (safe on server). */
function systemPrefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ---------- theme resolution ---------- */

/**
 * @param {'auto'|'light'|'dark'|object} theme
 * @param {object} userTokens   tokens prop
 * @param {boolean} prefersLight  pass in system value (for testability)
 * @returns {object} final merged tokens (dark base → light overrides → user)
 */
export function resolveTokens(theme, userTokens, prefersLight = false) {
  // theme can be a custom object: { bg: '#fff', accent: '#0af' }
  const themeObj = isPlainObject(theme) ? theme : null;
  const themeName = typeof theme === 'string' ? theme : 'auto';

  const useLight =
    themeName === 'light' || (themeName === 'auto' && prefersLight);

  const base = useLight
    ? mergeTokens(DEFAULT_TOKENS, LIGHT_TOKENS)
    : DEFAULT_TOKENS;

  return mergeTokens(base, themeObj || {}, userTokens || {});
}

/* ---------- main normalize ---------- */

/**
 * @param {object} props  raw props from <StackLayout />
 * @returns {{
 *   theme: 'auto'|'light'|'dark'|object,
 *   resolvedThemeName: 'light'|'dark',
 *   tokens: object,           // final token map (unprefixed camelCase)
 *   header: object,
 *   layout: object,
 *   behavior: object,
 *   animation: object,
 *   rules: object,
 *   slots: object,            // user-provided render props
 *   callbacks: object,        // extracted on* handlers
 *   className: string,
 *   style: object,
 *   unstyled: boolean,
 *   puzzles: array,
 *   engine: Function|null,
 *   parser: Function|null,
 *   validator: Function|null,
 * }}
 */
export function normalizeConfig(props = {}) {
  const {
    theme = 'auto',
    tokens: userTokens,
    header: userHeader,
    layout: userLayout,
    behavior: userBehavior,
    animation: userAnimation,
    rules: userRules,
    slots: userSlots,
    className = '',
    style,
    unstyled = false,
    puzzles,
    engine = null,
    parser = null,
    validator = null,

    // ---- callbacks ----
    onSolvePuzzle,
    onMove,
    onReveal,
    onBoardChange,
    onReset,
    onSlide,
    onReady,
  } = props;

  const prefersLight = systemPrefersLight();
  const prefersReducedMotion = systemPrefersReducedMotion();

  // resolve theme + tokens
  const resolvedTokens = resolveTokens(theme, userTokens, prefersLight);
  const resolvedThemeName =
    theme === 'dark'
      ? 'dark'
      : theme === 'light'
        ? 'light'
        : theme === 'auto'
          ? prefersLight
            ? 'light'
            : 'dark'
          : prefersLight
            ? 'light'
            : 'dark'; // custom object → still tag with system

  // animation.disable inherits from prefers-reduced-motion
  const resolvedAnimation = merge(
    { ...DEFAULT_ANIMATION, disable: prefersReducedMotion },
    userAnimation,
  );

  return {
    // theme
    theme,
    resolvedThemeName,
    tokens: resolvedTokens,

    // content
    header: merge(DEFAULT_HEADER, userHeader),
    puzzles, // pass-through; StackLayout handles default PUZZLES

    // sections
    layout: merge(DEFAULT_LAYOUT, userLayout),
    behavior: merge(DEFAULT_BEHAVIOR, userBehavior),
    animation: resolvedAnimation,
    rules: merge(DEFAULT_RULES, userRules),

    // slots (only pass-through; defaults live in StackLayout)
    slots: userSlots || {},

    // callbacks collected
    callbacks: {
      onSolvePuzzle,
      onMove,
      onReveal,
      onBoardChange,
      onReset,
      onSlide,
      onReady,
    },

    // shell
    className,
    style: style || {},
    unstyled: !!unstyled,

    // engine extensibility
    engine,
    parser,
    validator,
  };
}

export default normalizeConfig;