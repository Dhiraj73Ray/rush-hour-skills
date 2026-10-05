/**
 * src/components/Stage.jsx
 * ------------------------------------------------------------------
 * Presentational stage for <StackLayout />.
 * Renders: header + stacks + board viewport + footer/caption/dots.
 *
 * No state, no effects, no context — pure props → JSX.
 * ------------------------------------------------------------------
 */

import { MiniBoard } from './MiniBoard.jsx';
import { Stack } from './Stack.jsx';
import { Header } from './Header.jsx';
import { StatusPill } from './StatusPill.jsx';
import { ResetButton } from './ResetButton.jsx';
import { Caption } from './Caption.jsx';
import { PuzzleIndex } from './PuzzleIndex.jsx';
import { Dots } from './Dots.jsx';

export function Stage({
  /* config */
  cfg,
  puzzles,
  S, // slots

  /* active puzzle */
  activeIndex,
  activeConfig,
  activeBoard,
  activeRevealed,

  /* stacks */
  leftBoards,
  rightBoards,
  showLeftStack,
  showRightStack,

  /* state */
  solved,
  status,
  tick,
  direction,
  lockedIds,

  /* swipe */
  swipe,
  isDragging,

  /* handlers */
  onReveal,
  onMoveStart,
  onSolved,
  onMove,
  onReset,
  onSelectIndex,
}) {
  const { layout, animation, header } = cfg;
  const total = puzzles.length;
  const slideClass = direction === 'next' ? 'from-right' : 'from-left';

  return (
    <div className="rhs-container">
      {/* ---------- HEADER ---------- */}
      {layout.showHeader &&
        (S.header ? (
          <S.header
            title={header.title}
            subtitle={header.subtitle}
            index={activeIndex}
            total={total}
          />
        ) : (
          <Header title={header.title} subtitle={header.subtitle} />
        ))}

      {/* ---------- STAGE ---------- */}
      <div className="rhs-stage" {...swipe.handlers}>
        {/* LEFT stack */}
        {showLeftStack && (
          <div className="rhs-stack-left">
            <Stack boards={leftBoards} side="left" solved={solved} slots={S} />
          </div>
        )}

        {/* CENTER: board + bottom controls */}
        <div className="rhs-center-top">
          <div
            className={`rhs-board-viewport ${isDragging ? 'dragging' : ''}`}
            style={swipe.dragStyle}
          >
            <div
              key={activeConfig.id}
              className={`rhs-board-slide ${slideClass}`}
            >
              <MiniBoard
                board={activeBoard}
                skills={activeConfig.skills}
                revealed={activeRevealed}
                tick={tick}
                onReveal={onReveal}
                onMoveStart={onMoveStart}
                onSolved={onSolved}
                onMove={onMove}
                renderBlock={S.block}
                animation={animation}
              />
            </div>
          </div>

          <div className="rhs-center-bottom">
            {/* Footer: reset + status */}
            {layout.showFooter && (
              <div className="rhs-footer">
                {layout.showReset &&
                  (S.reset ? (
                    <S.reset onClick={onReset} />
                  ) : (
                    <ResetButton onClick={onReset} />
                  ))}

                {layout.showStatus &&
                  (S.status ? (
                    <S.status status={status} />
                  ) : (
                    <StatusPill status={status} />
                  ))}
              </div>
            )}

            {/* Caption: title · 01 / 06 */}
            {layout.showCaption &&
              (S.caption ? (
                <S.caption
                  config={activeConfig}
                  index={activeIndex}
                  total={total}
                />
              ) : (
                <Caption
                  title={activeConfig.title}
                  subtitle={activeConfig.subtitle}
                />
              ))}
            {layout.showCaption &&
              (!S.caption && (
                <PuzzleIndex 
                  index={activeIndex}
                  total={total}
                />
            ))}

            {/* Dots: pagination */}
            {layout.showDots &&
              (S.dots ? (
                <S.dots
                  puzzles={puzzles}
                  activeIndex={activeIndex}
                  solved={solved}
                  lockedIds={lockedIds}
                  onSelect={onSelectIndex}
                />
              ) : (
                <Dots
                  puzzles={puzzles}
                  activeIndex={activeIndex}
                  solved={solved}
                  lockedIds={lockedIds}
                  onSelect={onSelectIndex}
                />
              ))}
          </div>
        </div>

        {/* RIGHT stack */}
        {showRightStack && (
          <div className="rhs-stack-right">
            <Stack
              boards={rightBoards}
              side="right"
              solved={solved}
              lockedIds={lockedIds}
              slots={S}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Stage;