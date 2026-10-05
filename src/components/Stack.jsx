/**
 * src/components/Stack.jsx
 * ------------------------------------------------------------------
 * Left or right stack of mini boards (BoardPreview).
 * - LEFT stack: newest on top, boards shift right as new ones are added
 * - RIGHT stack: next on top, boards shift left
 * - Locked (unreachable) boards get a Lock overlay
 *
 * Props:
 *   boards        [{ id, board }]  — required
 *   side          'left' | 'right' — required
 *   solved        { [id]: true }
 *   lockedIds     Set<string> — only used on the right stack
 *   slots         { lock?: (props) => ReactNode }
 *   renderPreview (props) => ReactNode — override BoardPreview
 * ------------------------------------------------------------------
 */

import { BoardPreview } from './BoardPreview.jsx';
import { Lock } from './Lock.jsx';
import './Stack.css';

export function Stack({
  boards,
  side,
  solved,
  lockedIds,
  slots,
  renderPreview,
}) {
  const count = boards.length;
  if (count === 0) return null;

  const isLeft = side === 'left';
  const gapPercent = count > 1 ? Math.min(15, 37.5 / count) : 17.5;

  return (
    <div
      className={`rhs-stack rhs-stack-${side}`}
      style={{
        '--stack-gap': `${gapPercent}%`,
        '--stack-shift': (count - 1) * gapPercent,
      }}
    >
      {boards.map((item, i) => {
        // z-index: LEFT → newest on top, RIGHT → next on top
        const z = isLeft ? i + 1 : count - i;

        // horizontal offset
        const offset = isLeft
          ? i * gapPercent
          : (count - 1 - i) * gapPercent;

        const transformStyle = isLeft
          ? `translateX(${offset}%)`
          : `translateX(-${offset}%)`;

        // Top of stack: LEFT = last item, RIGHT = first item
        const isTop = isLeft ? i === count - 1 : i === 0;

        // Is this board solved?
        const isSolved = !!(solved && solved[item.id]);

        // No mask + full opacity for top & solved
        const isClear = isTop || isSolved;

        // Lock only for right stack, not-solved, and in lockedIds
        const showLock =
          side === 'right' &&
          lockedIds &&
          lockedIds.has(item.id) &&
          !isSolved;

        const slotClass =
          'rhs-stack-slot' +
          (isClear ? ' is-clear' : '') +
          (isTop ? ' is-top' : '');

        const previewNode = renderPreview
          ? renderPreview({ board: item.board, id: item.id, isTop, isSolved })
          : <BoardPreview board={item.board} />;

        const lockNode = showLock
          ? slots?.lock
            ? slots.lock({ id: item.id })
            : <Lock />
          : null;

        return (
          <div
            key={item.id}
            className={slotClass}
            style={{ zIndex: z, transform: transformStyle }}
          >
            {previewNode}
            {lockNode}
          </div>
        );
      })}
    </div>
  );
}

export default Stack;