/**
 * src/components/StackLayout.jsx
 * ------------------------------------------------------------------
 * Config-driven Rush Hour skills section — thin orchestrator.
 *
 * All business logic lives in:
 *   - config/normalize.js    (props → config)
 *   - hooks/useRushHourState (state, nav, solve, persistence)
 *   - hooks/useSwipe         (stage-level drag)
 *   - components/Stage       (presentational JSX)
 *
 * This file only:
 *   - normalizes props
 *   - wires hooks
 *   - provides context
 *   - forwards imperative handle
 *   - renders <Stage />
 * ------------------------------------------------------------------
 */

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';

import { normalizeConfig } from '../config/normalize.js';
import { toCssVars } from '../config/toCssVars.js';
import { useRushHourState } from '../hooks/useRushHourState.js';
import { useSwipe } from '../hooks/useSwipe.js';
import { RushHourContext } from '../context.js';
import { Stage } from './Stage.jsx';

import './StackLayout.css';

export const StackLayout = forwardRef(function StackLayout(props, ref) {
  /* ---- 1. normalize ---- */
  const cfg = useMemo(
    () => normalizeConfig(props),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      props.theme,
      props.tokens,
      props.header,
      props.layout,
      props.behavior,
      props.animation,
      props.rules,
      props.slots,
      props.className,
      props.style,
      props.unstyled,
      props.engine,
      props.parser,
      props.validator,
    ],
  );
  const S = cfg.slots;

  /* ---- 2. state brain ---- */
  const s = useRushHourState(cfg, props.puzzles);

  /* ---- 3. swipe ---- */
  const swipe = useSwipe({
    threshold: cfg.behavior.swipeThreshold,
    canGoNext: s.canGoNext,
    canGoPrev: s.canGoPrev,
    goNext: s.goNext,
    goPrev: s.goPrev,
    animationDisabled: cfg.animation.disable,
  });

  /* ---- 4. imperative handle ---- */
  useImperativeHandle(ref, () => s.imperative, [s.imperative]);

  /* ---- 5. context value ---- */
  const ctxValue = useMemo(
    () => ({
      activeIndex: s.activeIndex,
      activeId: s.activeConfig?.id,
      activeConfig: s.activeConfig,
      puzzles: s.puzzles,
      solved: s.solved,
      revealed: s.activeRevealed,
      status: s.status,
      goNext: s.goNext,
      goPrev: s.goPrev,
      goTo: s.goTo,
      goToIndex: s.goToIndex,
      canGoNext: s.canGoNext,
      canGoPrev: s.canGoPrev,
      getBoard: s.getBoard,
      getActiveBoard: () => s.activeBoard,
      reset: s.handleReset,
      setSolved: s.setSolved,
      revealCar: s.revealCar,
      config: cfg,
    }),
    [
      s.activeIndex,
      s.activeConfig,
      s.puzzles,
      s.solved,
      s.activeRevealed,
      s.status,
      s.goNext,
      s.goPrev,
      s.goTo,
      s.goToIndex,
      s.canGoNext,
      s.canGoPrev,
      s.getBoard,
      s.activeBoard,
      s.handleReset,
      s.setSolved,
      s.revealCar,
      cfg,
    ],
  );

  /* ---- 6. derived stack visibility ---- */
  const showLeftStack =
    cfg.layout.showStacks &&
    (cfg.layout.stackSide === 'auto' ||
      cfg.layout.stackSide === 'both' ||
      cfg.layout.stackSide === 'left');

  const showRightStack =
    cfg.layout.showStacks &&
    (cfg.layout.stackSide === 'auto' ||
      cfg.layout.stackSide === 'both' ||
      cfg.layout.stackSide === 'right');

  const leftBoards = s.allBoards.slice(0, s.activeIndex);
  const rightBoards = s.allBoards.slice(s.activeIndex + 1);

  /* ---- 7. root style ---- */
  const rootStyle = {
    ...toCssVars(cfg.tokens),
    '--rhs-slide-ms': `${cfg.animation.slideMs}ms`,
    '--rhs-reveal-ms': `${cfg.animation.revealMs}ms`,
    '--rhs-block-move-ms': `${cfg.animation.blockMoveMs}ms`,
    '--rhs-stack-shift-ms': `${cfg.animation.stackShiftMs}ms`,
    '--rhs-exit-glow-ms': `${cfg.animation.exitGlowMs}ms`,
    ...cfg.style,
  };

  /* ---- 8. empty state ---- */
  if (!s.hasPuzzles) {
    return (
      <RushHourContext.Provider value={ctxValue}>
        <section
          className={`rhs-section ${cfg.className}`.trim()}
          data-theme={cfg.resolvedThemeName}
          style={rootStyle}
        >
          {S.empty ? (
            <S.empty />
          ) : (
            <div className="rhs-empty">No puzzles provided.</div>
          )}
        </section>
      </RushHourContext.Provider>
    );
  }

  /* ---- 9. render ---- */
  return (
    <RushHourContext.Provider value={ctxValue}>
      <section
        className={`rhs-section ${cfg.className}`.trim()}
        data-theme={cfg.resolvedThemeName}
        style={rootStyle}
      >
        <Stage
          cfg={cfg}
          puzzles={s.puzzles}
          S={S}
          activeIndex={s.activeIndex}
          activeConfig={s.activeConfig}
          activeBoard={s.activeBoard}
          activeRevealed={s.activeRevealed}
          leftBoards={leftBoards}
          rightBoards={rightBoards}
          showLeftStack={showLeftStack}
          showRightStack={showRightStack}
          solved={s.solved}
          status={s.status}
          tick={s.tick}
          direction={s.direction}
          lockedIds={s.lockedIds}
          swipe={swipe}
          isDragging={swipe.isDragging}
          onReveal={s.handleReveal}
          onMoveStart={s.handleMoveStart}
          onSolved={s.handleSolved}
          onMove={s.handleMove}
          onReset={s.handleReset}
          onSelectIndex={s.goToIndex}
        />
      </section>
    </RushHourContext.Provider>
  );
});

export default StackLayout;