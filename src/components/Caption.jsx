/**
 * src/components/Caption.jsx
 * ------------------------------------------------------------------
 * Default caption for <StackLayout />.
 * Renders: "{title} · 01 / 06"
 * Override via slots.caption if you want your own.
 * ------------------------------------------------------------------
 */

import './Caption.css';

/** 1 → "01", 12 → "12" */
function pad2(n) {
  return String(n).padStart(2, '0');
}

export function Caption({
  title,
  subtitle,
  index,
  total,
  showIndex = true,
}) {
  const hasTitle = title != null && title !== '';
  const hasIndex = showIndex && Number.isFinite(index) && Number.isFinite(total);

  if (!hasTitle && !hasIndex) return null;

  return (
    <div className="rhs-caption">
      {hasTitle && <span className="rhs-caption-title">{title}</span>}

      {hasTitle && subtitle && (
        <>
          <span className="rhs-caption-sep"> · </span>
          <span className="rhs-caption-subtitle">{subtitle}</span>
        </>
      )}

      {hasIndex && (
        <>
          {hasTitle && <span className="rhs-caption-sep"> · </span>}
          <span className="rhs-caption-index">
            {pad2(index + 1)} / {pad2(total)}
          </span>
        </>
      )}
    </div>
  );
}

export default Caption;