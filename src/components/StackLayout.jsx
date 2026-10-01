import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Board } from "../engine/index.js";
import { MiniBoard } from "./MiniBoard.jsx";
import { Stack } from "./Stack.jsx";
import "./StackLayout.css";
import { PUZZLES } from "../constants.js";

export function StackLayout({ puzzles = PUZZLES, onSolvePuzzle, theme = "auto" }) {
  const [activeIndexRaw, setActiveIndex] = useState(0);
  const [solved, setSolved] = useState({});
  const [status, setStatus] = useState("ready");
  const [tick, setTick] = useState(0);
  const [direction, setDirection] = useState("next"); // 'next' | 'prev'
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const advanceTimerRef = useRef(null);
  const dragRef = useRef(null);

  const activeIndex = Math.max(0, Math.min(activeIndexRaw, puzzles.length - 1));
  const activeConfig = puzzles[activeIndex];

  const boardMapRef = useRef({});
  const revealedMapRef = useRef({});
  const softResetRef = useRef({});

  const getBoard = useCallback((config) => {
    if (!boardMapRef.current[config.id]) {
      boardMapRef.current[config.id] = new Board(config.puzzle, config.exit);
    }
    return boardMapRef.current[config.id];
  }, []);

  const getRevealed = useCallback((id) => {
    if (!revealedMapRef.current[id]) {
      revealedMapRef.current[id] = new Set();
    }
    return revealedMapRef.current[id];
  }, []);

  const activeBoard = getBoard(activeConfig);
  const activeRevealed = getRevealed(activeConfig.id);

  const allBoards = useMemo(
    () => puzzles.map((p) => ({ id: p.id, board: getBoard(p) })),
    [puzzles, getBoard],
  );

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  const canGoNext =
    !!solved[activeConfig.id] && activeIndex < puzzles.length - 1;
  const canGoPrev = activeIndex > 0;

 const goNext = useCallback(() => {
  if (!canGoNext) return;
  if (advanceTimerRef.current) {
    clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = null;
  }
  const nextId = puzzles[activeIndex + 1]?.id;
  setDirection("next");
  setActiveIndex((i) => Math.min(i + 1, puzzles.length - 1));
  setStatus(solved[nextId] ? "solved" : "ready");
  setTick((t) => t + 1);
}, [canGoNext, puzzles, activeIndex, solved]);

const goPrev = useCallback(() => {
  if (!canGoPrev) return;
  if (advanceTimerRef.current) {
    clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = null;
  }
  const prevId = puzzles[activeIndex - 1]?.id;
  setDirection("prev");
  setActiveIndex((i) => Math.max(i - 1, 0));
  setStatus(solved[prevId] ? "solved" : "ready");
  setTick((t) => t + 1);
}, [canGoPrev, puzzles, activeIndex, solved]);
  
  const handleReveal = useCallback(
    (letter) => {
      const id = activeConfig.id;
      const set = getRevealed(id);
      if (set.has(letter)) return;
      set.add(letter);
      softResetRef.current[id] = false;
      setTick((t) => t + 1);
    },
    [activeConfig.id, getRevealed],
  );

  const handleSolved = useCallback(() => {
    const id = activeConfig.id;
    const wasAlreadySolved = !!solved[id];

    revealedMapRef.current[id] = new Set(Object.keys(activeBoard.cars));
    softResetRef.current[id] = false;
    setSolved((prev) => ({ ...prev, [id]: true }));
    setStatus("solved");
    onSolvePuzzle?.(id);
    setTick((t) => t + 1);

    if (!wasAlreadySolved && activeIndex < puzzles.length - 1) {
  if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
  const solvedIndex = activeIndex;
  advanceTimerRef.current = setTimeout(() => {
    setActiveIndex((i) => {
      if (i !== solvedIndex) return i; // user pehle hi kahin aur chala gaya
      setDirection("next");
      setStatus("ready");
      setTick((t) => t + 1);
      return Math.min(i + 1, puzzles.length - 1);
    });
    advanceTimerRef.current = null;
  }, 900);
}
  }, [
    activeConfig.id,
    activeBoard,
    activeIndex,
    puzzles.length,
    solved,
    onSolvePuzzle,
  ]);

  const handleMoveStart = useCallback(() => {
    setStatus((s) => (s === "ready" ? "in-progress" : s));
  }, []);

  const handleReset = useCallback(() => {
    const id = activeConfig.id;
    const wasSolved = !!solved[id];
    const softDone = !!softResetRef.current[id];

    activeBoard.reset();

    if (wasSolved) {
      // solved → keep reveals
    } else if (softDone) {
      revealedMapRef.current[id] = new Set();
      softResetRef.current[id] = false;
    } else {
      softResetRef.current[id] = true;
    }

    setStatus(wasSolved ? "solved" : "ready");
    setTick((t) => t + 1);
  }, [activeConfig.id, activeBoard, solved]);

  // ---------- Slide / drag handlers (stage level) ----------
  const onPointerDown = (e) => {
    // Don't interfere with car dragging or buttons
    if (e.target.closest(".rhs-block")) return;
    if (e.target.closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX };
    setIsDragging(true);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    setDragX(e.clientX - dragRef.current.startX);
  };

  const onPointerUp = () => {
    if (!dragRef.current) return;
    const dx = dragX;
    dragRef.current = null;
    setIsDragging(false);
    setDragX(0);

    if (dx < -60 && canGoNext) goNext();
    else if (dx > 60 && canGoPrev) goPrev();
  };

  const leftBoards = allBoards.slice(0, activeIndex);
  const rightBoards = allBoards.slice(activeIndex + 1);

  const statusLabel =
    status === "solved"
      ? "SOLVED"
      : status === "in-progress"
        ? "IN PROGRESS"
        : "READY";

  const slideClass = direction === "next" ? "from-right" : "from-left";
  const dragStyle = { transform: `translateX(${dragX * 0.5}px)` };

  const lockedIds = useMemo(() => {
  const set = new Set();
  let lastSolved = -1;
  for (let i = 0; i < puzzles.length; i++) {
    if (solved[puzzles[i].id]) lastSolved = i;
    else break;
  }
  // The board right after the last-solved is reachable; the rest are locked
  for (let i = lastSolved + 2; i < puzzles.length; i++) {
    set.add(puzzles[i].id);
  }
  return set;
}, [puzzles, solved]);

  return (
    <section className="rhs-section" data-theme={theme}>
      <h1 className="rhs-title">UNLOCK MY SKILLS</h1>
      <div className="rhs-container">
        <div
          className="rhs-stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="rhs-stack-left">
  <Stack boards={leftBoards} side="left" solved={solved} />
</div>

          <div className="rhs-center-top">
            <div
              className={`rhs-board-viewport ${isDragging ? "dragging" : ""}`}
              style={dragStyle}
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
                  onReveal={handleReveal}
                  onMoveStart={handleMoveStart}
                  onSolved={handleSolved}
                />
              </div>
            </div>

            <div className="rhs-center-bottom">
              <div className="rhs-footer">
                <button className="rhs-reset-btn" onClick={handleReset}>
                  RESET
                </button>
                <div className="rhs-status" data-status={status}>
                  {statusLabel}
                </div>
              </div>

              <div className="rhs-caption">
                {activeConfig.title}
                <span className="rhs-caption-sep"> · </span>
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(puzzles.length).padStart(2, "0")}
              </div>

              <div className="rhs-dots">
                {puzzles.map((p, i) => (
                  <span
                    key={p.id}
                    className={`rhs-dot ${i === activeIndex ? "active" : ""} ${
                      solved[p.id] ? "solved" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rhs-stack-right">
  <Stack boards={rightBoards} side="right" lockedIds={lockedIds} solved={solved} />
</div>
        </div>
      </div>
    </section>
  );
}
