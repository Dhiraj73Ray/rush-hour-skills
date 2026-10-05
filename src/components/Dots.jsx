/**
 * src/components/Dots.jsx
 * ------------------------------------------------------------------
 * Default pagination dots for <StackLayout />.
 * Each dot: active (current) | solved (past) | default (upcoming).
 * Clicking a reachable dot navigates to that puzzle.
 * Override via slots.dots if you want your own.
 * ------------------------------------------------------------------
 */

import './Dots.css';

export function Dots({
  puzzles = [],
  activeIndex = 0,
  solved = {},
  lockedIds,
  onSelect,
  interactive = true,
}) {
  if (!puzzles.length) return null;

  const handleClick = (i) => {
    if (!interactive || !onSelect) return;
    const id = puzzles[i]?.id;
    if (id && lockedIds && lockedIds.has(id)) return; // locked → ignore
    onSelect(i);
  };

  return (
    <div className="rhs-dots" role="tablist" aria-label="Puzzle navigation">
      {puzzles.map((p, i) => {
        const isActive = i === activeIndex;
        const isSolved = !!solved[p.id];
        const isLocked = !!(lockedIds && lockedIds.has(p.id));
        const canClick = interactive && !isLocked && onSelect;

        const classes = [
          'rhs-dot',
          isActive && 'active',
          isSolved && !isActive && 'solved',
          isLocked && 'locked',
          canClick && 'clickable',
        ]
          .filter(Boolean)
          .join(' ');

        const label = isSolved
          ? `Solved: ${p.title || p.id}`
          : `Go to puzzle ${i + 1}${p.title ? `: ${p.title}` : ''}`;

        return (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={label}
            aria-disabled={isLocked || undefined}
            tabIndex={isActive ? 0 : -1}
            className={classes}
            onClick={() => handleClick(i)}
            disabled={!canClick}
          />
        );
      })}
    </div>
  );
}

export default Dots;