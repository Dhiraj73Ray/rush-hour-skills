import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Block } from './Block.jsx';
import { getCarDragBounds } from '../utils/dragBounds.js';
import './MiniBoard.css';

export function MiniBoard({
  board,
  skills,
  revealed,
  tick,
  onReveal,
  onMoveStart,
  onSolved,
}) {
  const [previewCar, setPreviewCar] = useState(null);
  const [previewOffset, setPreviewOffset] = useState(0);
  const [cellSize, setCellSize] = useState(50);
  const [, forceUpdate] = useState(0);

  const dragRef = useRef(null);
  const boardRef = useRef(null);

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

  const handlePointerDown = (e, letter) => {
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
      board.move(drag.car, previewOffset);
      forceUpdate((n) => n + 1);

      if (!wasWonBefore && board.isWon()) {
        onSolved?.();
      }
    }
    setPreviewCar(null);
    setPreviewOffset(0);
    dragRef.current = null;
  };

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

  return (
    <div className="rhs-board-frame" style={{ '--rhs-size': size }}>
      <div
        ref={boardRef}
        className="rhs-board"
      >
        {Array.from({ length: size * size }).map((_, i) => (
          <div key={i} className="rhs-cell-spacer" />
        ))}

        {Object.entries(visualCars).map(([letter, car]) => (
          <Block
            key={letter}
            letter={letter}
            car={car}
            size={size}
            cellSize={cellSize}
            skillName={skills[letter] || letter}
            revealed={revealed?.has(letter) ?? false}
            selected={false}
            dragging={previewCar === letter}
            onPointerDown={(e) => handlePointerDown(e, letter)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
        ))}
      </div>

   
        <div
  className={`rhs-exit-slot rhs-exit-slot-${board.exit.side}`}
  style={exitStyle}
  aria-hidden
/>
      </div>
  );
}