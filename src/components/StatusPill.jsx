/**
 * src/components/StatusPill.jsx
 * ------------------------------------------------------------------
 * Tiny status indicator for <StackLayout />.
 * Shows: READY | IN PROGRESS | SOLVED
 * Override via slots.status if you want your own.
 * ------------------------------------------------------------------
 */

import './StatusPill.css';

const LABELS = {
  ready: 'READY',
  'in-progress': 'IN PROGRESS',
  solved: 'SOLVED',
};

export function StatusPill({ status = 'ready', label }) {
  const text = label != null ? label : LABELS[status] ?? LABELS.ready;

  return (
    <div className="rhs-status" data-status={status} role="status" aria-live="polite">
      {text}
    </div>
  );
}

export default StatusPill;