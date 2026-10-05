/**
 * src/config/toCssVars.js
 * ------------------------------------------------------------------
 * Convert a plain object of tokens into CSS custom properties.
 *
 *   { boardSize: '380px', panelGradient: 'linear-gradient(...)' }
 *      ↓
 *   { '--rhs-board-size': '380px', '--rhs-panel-gradient': 'linear-gradient(...)' }
 *
 * Notes:
 * - Numbers are converted to px (unless already a string).
 * - `null` / `undefined` values are skipped so they don't nuke defaults.
 * - No prefix if the key already starts with `--`.
 * ------------------------------------------------------------------
 */

const PREFIX = '--rhs-';

/** camelCase / PascalCase / snake_case → kebab-case */
function toKebab(key) {
  return String(key)
    // insert dash between lowercase→uppercase and digit→uppercase
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

/** normalize a single value */
function toValue(v) {
  if (typeof v === 'number' && Number.isFinite(v)) return `${v}px`;
  return String(v);
}

/**
 * @param {Record<string, string|number>} tokens
 * @returns {Record<string, string>}  CSS variable map ready to spread into `style={}`
 */
export function toCssVars(tokens = {}) {
  const out = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (value == null) continue;
    const varName = key.startsWith('--') ? key : PREFIX + toKebab(key);
    out[varName] = toValue(value);
  }
  return out;
}

/**
 * Merge multiple token sources left→right (later wins).
 * Handy: toCssVars(mergeTokens(DEFAULT_TOKENS, LIGHT_TOKENS, userTokens))
 */
export function mergeTokens(...sources) {
  return Object.assign({}, ...sources.filter(Boolean));
}

export default toCssVars;