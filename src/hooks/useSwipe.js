/**
 * src/hooks/useSwipe.js
 * ------------------------------------------------------------------
 * Horizontal swipe/drag detector for the stage area.
 * - Ignores pointer events starting on `.rhs-block` (cars) or `button`
 * - Tracks dragX (half-applied as visual feedback)
 * - On release: if |dx| > threshold → fires goNext / goPrev
 *
 * Config:
 *   disabled     — boolean, no-op when true
 *   threshold    — px to trigger (behavior.swipeThreshold)
 *   canGoNext    — boolean, gate for right-swipe → goNext
 *   canGoPrev    — boolean, gate for left-swipe  → goPrev
 *   goNext       — () => void
 *   goPrev       — () => void
 *   animationDisabled — boolean, skip the visual dragStyle
 *
 * Returns:
 *   { dragX, isDragging, dragStyle, handlers }
 *   where handlers = { onPointerDown, onPointerMove, onPointerUp, onPointerCancel }
 * ------------------------------------------------------------------
 */

import { useCallback, useRef, useState } from 'react';

export function useSwipe({
  disabled = false,
  threshold = 60,
  canGoNext = false,
  canGoPrev = false,
  goNext,
  goPrev,
  animationDisabled = false,
} = {}) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);

  const onPointerDown = useCallback(
    (e) => {
      if (disabled) return;
      // Don't interfere with cars or buttons
      if (e.target.closest?.('.rhs-block')) return;
      if (e.target.closest?.('button')) return;

      e.currentTarget.setPointerCapture?.(e.pointerId);
      dragRef.current = { startX: e.clientX };
      setIsDragging(true);
    },
    [disabled],
  );

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current) return;
    setDragX(e.clientX - dragRef.current.startX);
  }, []);

  const endDrag = useCallback(() => {
    if (!dragRef.current) return;
    const dx = dragX;
    dragRef.current = null;
    setIsDragging(false);
    setDragX(0);

    if (dx < -threshold && canGoNext) goNext?.();
    else if (dx > threshold && canGoPrev) goPrev?.();
  }, [dragX, threshold, canGoNext, canGoPrev, goNext, goPrev]);

  const dragStyle =
    animationDisabled || dragX === 0
      ? undefined
      : { transform: `translateX(${dragX * 0.5}px)` };

  return {
    dragX,
    isDragging,
    dragStyle,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}

export default useSwipe;