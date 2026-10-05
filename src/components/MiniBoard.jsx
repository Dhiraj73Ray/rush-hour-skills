/**
 * src/components/MiniBoard.jsx
 * ------------------------------------------------------------------
 * Active board renderer with drag-to-move cars.
 *
 * Props (all optional except `board`):
 *   board        Board instance (required)
 *   skills       { A: 'Python', ... }
 *   revealed     Set<string> of revealed letters
 *   tick         number — bump to force re-render
 *   onReveal     (letter) => void
 *   onMoveStart  () => void
 *   onSolved     () => void
 *   onMove       ({ car, steps, state }) => void
 *   renderBlock  (props) => ReactNode — override car visuals
 *   disabled     boolean — disable dragging
 *   animation    { blockMoveMs } — override CSS timing
 *   ariaLabel    string — for the grid
 * ------------------------------------------------------------------
 */

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Block } from './Block.jsx';
import { getCarDragBounds } from '../utils/dragBounds.js';
import './MiniBoard.css';

export function MiniBoard({
  board,
  skills = {},
  revealed,
  tick,
  onReveal,
  onMoveStart,
  onSolved,
  onMove,
  renderBlock,
  disabled = false,
  animation,
  ariaLabel = 'Rush Hour puzzle board',
}) {
  const [previewCar, setPreviewCar] = useState(null);
  const [previewOffset, setPreviewOffset] = useState(0);
  const [cellSize, setCellSize] = useState(50);
  const [, forceUpdate] = useState(0);

  const dragRef = useRef(null);
  const boardRef = useRef(null);

  // ---- measure cell size, keep blocks aligned ----
  useLayoutEffect(() => {
    if (!boardRef.current) return;
    const el = boardRef.current;
    const update = () =>
      setCellSize(el.getBoundingClientRect().width / board.size);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [board]);

  // ---- drag handlers ----
  const handlePointerDown = (e, letter) => {
    if (disabled) return;
    if (dragRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);

    onMoveStart?.();
    onReveal?.(letter);

    const car = board.cars[letter];
    const bounds = getCarDragBounds(board.board, letter, board.cars, board.size);

    dragRef.current = {
      car: letter,
      startX: e.clientX,
      startY: e.clientY,
      axis: car.direction,
      min: bounds.min,
      max: bounds.max,
    };
    setPreviewCar(letter);
    setPreviewOffset(0);
  };

  const handlePointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    const delta = drag.axis === 'H' ? dx : dy;
    const raw = Math.round(delta / cellSize);
    const clamped = Math.max(drag.min, Math.min(drag.max, raw));
    setPreviewOffset(clamped);
  };

  const handlePointerUp = () => {
    const drag = dragRef.current;
    if (!drag) return;

    if (previewOffset !== 0) {
      const wasWonBefore = board.isWon();
      const result = board.move(drag.car, previewOffset);
      forceUpdate((n) => n + 1);

      const isWonNow = board.isWon();
      if (!wasWonBefore && isWonNow) onSolved?.();

      onMove?.({
        car: drag.car,
        steps: previewOffset,
        status: result?.status ?? 'ok',
        state: board.getState(),
      });
    }
    setPreviewCar(null);
    setPreviewOffset(0);
    dragRef.current = null;
  };

  // ---- compute visual positions (drag preview) ----
  const visualCars = useMemo(() => {
    const cars = board.cars;
    if (!previewCar || previewOffset === 0) return cars;
    const car = cars[previewCar];
    if (!car) return cars;
    const shifted = { ...cars };
    shifted[previewCar] =
      car.direction === 'H'
        ? { ...car, col: car.col + previewOffset }
        : { ...car, row: car.row + previewOffset };
    return shifted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, previewCar, previewOffset, board]);

  const size = board.size;
  const exitOffsetPct = ((board.exit.position + 0.5) / size) * 100;
  const exitStyle =
    board.exit.side === 'right' || board.exit.side === 'left'
      ? { top: `${exitOffsetPct}%` }
      : { left: `${exitOffsetPct}%` };

  const rootStyle = {
    '--rhs-size': size,
    ...(animation?.blockMoveMs != null && {
      '--rhs-block-move-ms': `${animation.blockMoveMs}ms`,
    }),
  };

  const renderCar = (letter, car) => {
    const common = {
      letter,
      car,
      size,
      cellSize,
      skillName: skills[letter] || letter,
      revealed: revealed?.has(letter) ?? false,
      selected: false,
      dragging: previewCar === letter,
      disabled,
      onPointerDown: (e) => handlePointerDown(e, letter),
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    };

    if (renderBlock) return renderBlock(common);
    return <Block key={letter} {...common} />;
  };

  return (
    <div className="rhs-board-frame" style={rootStyle}>
      <div
        ref={boardRef}
        className="rhs-board"
        role="grid"
        aria-label={ariaLabel}
        data-disabled={disabled || undefined}
      >
        {/* invisible spacer grid keeps aspect ratio */}
        {Array.from({ length: size * size }).map((_, i) => (
          <div key={i} className="rhs-cell-spacer" />
        ))}

        {Object.entries(visualCars).map(([letter, car]) =>
          renderCar(letter, car),
        )}
      </div>

      <div
        className={`rhs-exit-slot rhs-exit-slot-${board.exit.side}`}
        style={exitStyle}
        aria-hidden
      />
    </div>
  );
}

export default MiniBoard;