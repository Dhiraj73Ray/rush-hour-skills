/**
 * src/components/Lock.jsx
 * ------------------------------------------------------------------
 * Default lock overlay rendered on top of locked mini boards.
 * Override via slots.lock if you want your own.
 * ------------------------------------------------------------------
 */

import './Lock.css';

export function Lock({ label = 'Locked' }) {
  return (
    <div className="rhs-stack-lock" aria-hidden="true">
      <svg
        className="rhs-stack-lock-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label={label}
      >
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 1 1 8 0v4" />
      </svg>
    </div>
  );
}

export default Lock;