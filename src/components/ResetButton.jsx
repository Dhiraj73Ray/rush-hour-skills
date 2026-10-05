/**
 * src/components/ResetButton.jsx
 * ------------------------------------------------------------------
 * Default reset button for <StackLayout />.
 * Override via slots.reset if you want your own.
 * ------------------------------------------------------------------
 */

import './ResetButton.css';

const DEFAULT_LABEL = 'RESET';

export function ResetButton({
  onClick,
  label = DEFAULT_LABEL,
  disabled = false,
  title = 'Reset the current puzzle',
}) {
  return (
    <button
      type="button"
      className="rhs-reset-btn"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={label}
    >
      {label}
    </button>
  );
}

export default ResetButton;