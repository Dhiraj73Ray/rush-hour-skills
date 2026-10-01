import { BoardPreview } from './BoardPreview.jsx';
import './Stack.css';

export function Stack({ boards, side, solved, lockedIds }) {
  const count = boards.length;
  if (count === 0) return null;

  const isLeft = side === 'left';
  const gapPercent = count > 1 ? Math.min(15, 37.5 / count) : 17.5;

  return (
    <div className={`rhs-stack rhs-stack-${side}`} style={{ '--stack-gap': `${gapPercent}%`,'--stack-shift': (count - 1) * gapPercent, }}>
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

        // Lock only for right stack, not-solved
        const showLock =
          side === 'right' && lockedIds && lockedIds.has(item.id);

        return (
          <div
            key={item.id}
            className={
              'rhs-stack-slot' +
              (isClear ? ' is-clear' : '') +
              (isTop ? ' is-top' : '')
            }
            style={{ zIndex: z, transform: transformStyle }}
          >
            <BoardPreview board={item.board} />

            {showLock && (
              <div className="rhs-stack-lock" aria-hidden>
                <svg
                  className="rhs-stack-lock-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 1 1 8 0v4" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}