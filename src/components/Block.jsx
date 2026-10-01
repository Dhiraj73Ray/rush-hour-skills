import { getCornerVars } from '../utils/corners.js';
import { getRotation } from '../utils/rotation.js';
import './Block.css';

export function Block({
  letter,
  car,
  size,
  cellSize,
  skillName,
  revealed,
  selected,
  dragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) {
  const isH = car.direction === 'H';
  const isMain = letter === 'A';

  const widthPct = (isH ? car.length : 1) / size * 100;
  const heightPct = (isH ? 1 : car.length) / size * 100;
  const leftPct = (car.col / size) * 100;
  const topPct = (car.row / size) * 100;

  // Auto-shrink font based on block pixel size and label length
  const widthPx = (isH ? car.length : 1) * cellSize;
  const heightPx = (isH ? 1 : car.length) * cellSize;
  const labelLen = Math.max(skillName.length, 1);
  const byHeight = heightPx * 0.5;
  const byWidth = (widthPx - 10) / labelLen * 1.6;
  const fontSize = Math.max(8, Math.min(byHeight, byWidth, 22));

  const cornerVars = getCornerVars(letter);
  const rotation = getRotation(letter);
  const isVertical = !isH;

  const classes = [
    'rhs-block',
    isMain ? 'rhs-block-main' : 'rhs-block-obstacle',
    revealed ? 'revealed' : '',
    selected ? 'rhs-block-selected' : '',
    dragging ? 'rhs-block-dragging' : '',
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'rhs-skill-label',
    isVertical ? 'rhs-vertical' : '',
    isVertical && rotation === 270 ? 'rhs-reverse' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{
        left: `calc(${leftPct}% + 2px)`,
        top: `calc(${topPct}% + 2px)`,
        width: `calc(${widthPct}% - 4px)`,
        height: `calc(${heightPct}% - 4px)`,
        '--rx': cornerVars.rx,
        '--ry': cornerVars.ry,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onPointerUp}
    >
      <div className="rhs-block-bright">
        <span className={labelClasses} style={{ fontSize: `${fontSize}px` }}>
          {skillName}
        </span>
      </div>
      <div className="rhs-block-dark" />
    </div>
  );
}