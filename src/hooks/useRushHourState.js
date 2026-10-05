/**
 * src/hooks/useRushHourState.js
 * ------------------------------------------------------------------
 * The brain of <StackLayout />.
 * Holds state, refs, navigation, solve/reveal/reset, persistence,
 * and builds the imperative-handle object.
 *
 * Usage:
 *   const s = useRushHourState(cfg, puzzles);
 *   s.solved, s.activeIndex, s.goNext(), s.imperative, ...
 * ------------------------------------------------------------------
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Board } from '../engine/index.js';
import { PUZZLES } from '../constants.js';

/* ---------- persistence helpers (module-scope, pure) ---------- */

function loadPersisted(storageKey) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePersisted(storageKey, payload) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  } catch {
    // ignore quota / private-mode errors
  }
}

/* ---------- hook ---------- */

export function useRushHourState(cfg, puzzlesProp) {
  const puzzles = puzzlesProp ?? PUZZLES;
  const hasPuzzles = Array.isArray(puzzles) && puzzles.length > 0;

  /* ---- persisted snapshot (read once) ---- */
  const persistedOnceRef = useRef(null);
  if (persistedOnceRef.current === null) {
    persistedOnceRef.current = cfg.behavior.persist
      ? loadPersisted(cfg.behavior.storageKey) || {}
      : {};
  }
  const initialPersisted = persistedOnceRef.current;

  /* ---- state ---- */
  const [solved, setSolved] = useState(() => initialPersisted.solved || {});

  const [activeIndexRaw, setActiveIndex] = useState(() => {
    if (typeof initialPersisted.activeIndex === 'number') {
      return initialPersisted.activeIndex;
    }
    return cfg.behavior.startIndex ?? 0;
  });

  const [status, setStatus] = useState('ready');
  const [tick, setTick] = useState(0);
  const [direction, setDirection] = useState('next');

  /* ---- refs ---- */
  const advanceTimerRef = useRef(null);
  const boardMapRef = useRef({});
  const softResetRef = useRef({});

  const revealedMapRef = useRef(null);
  if (revealedMapRef.current === null) {
    revealedMapRef.current = {};
    const savedRevealed = initialPersisted.revealed;
    if (savedRevealed) {
      for (const [id, letters] of Object.entries(savedRevealed)) {
        revealedMapRef.current[id] = new Set(letters);
      }
    }
  }

  /* ---- derived active index ---- */
  const activeIndex = hasPuzzles
    ? Math.max(0, Math.min(activeIndexRaw, puzzles.length - 1))
    : 0;
  const activeConfig = hasPuzzles ? puzzles[activeIndex] : null;

  /* ---- board factory ---- */
  const BoardClass = cfg.engine ?? Board;

  const getBoard = useCallback(
    (config) => {
      if (!config) return null;
      if (!boardMapRef.current[config.id]) {
        const b = new BoardClass(config.puzzle, config.exit);
        cfg.validator?.(b);
        boardMapRef.current[config.id] = b;
      }
      return boardMapRef.current[config.id];
    },
    [BoardClass, cfg.validator],
  );

  const getRevealed = useCallback((id) => {
    if (!revealedMapRef.current[id]) {
      revealedMapRef.current[id] = new Set();
    }
    return revealedMapRef.current[id];
  }, []);

  const activeBoard = activeConfig ? getBoard(activeConfig) : null;
  const activeRevealed = activeConfig ? getRevealed(activeConfig.id) : null;

  const allBoards = useMemo(
    () =>
      hasPuzzles
        ? puzzles.map((p) => ({ id: p.id, board: getBoard(p) }))
        : [],
    [puzzles, getBoard, hasPuzzles],
  );

  /* ---- cleanup timer on unmount ---- */
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  /* ---- navigation ---- */
  const canGoNext =
    hasPuzzles && !!solved[activeConfig.id] && activeIndex < puzzles.length - 1;
  const canGoPrev = hasPuzzles && activeIndex > 0;

  const goToIndex = useCallback(
    (idx) => {
      if (!hasPuzzles) return;
      if (idx < 0 || idx >= puzzles.length) return;
      if (idx === activeIndex) return;

      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }

      const dir = idx > activeIndex ? 'next' : 'prev';
      const newId = puzzles[idx]?.id;

      setDirection(dir);
      setActiveIndex(idx);
      setStatus(solved[newId] ? 'solved' : 'ready');
      setTick((t) => t + 1);

      cfg.callbacks.onBoardChange?.(newId, idx, dir);
      cfg.callbacks.onSlide?.(dir);
    },
    [hasPuzzles, puzzles, activeIndex, solved, cfg.callbacks],
  );

  const goNext = useCallback(() => {
    if (!canGoNext) return;
    goToIndex(activeIndex + 1);
  }, [canGoNext, activeIndex, goToIndex]);

  const goPrev = useCallback(() => {
    if (!canGoPrev) return;
    goToIndex(activeIndex - 1);
  }, [canGoPrev, activeIndex, goToIndex]);

  const goTo = useCallback(
    (id) => {
      const idx = puzzles.findIndex((p) => p.id === id);
      if (idx === -1) return;
      goToIndex(idx);
    },
    [puzzles, goToIndex],
  );

  /* ---- reveal / solve / move / reset ---- */
  const revealCar = useCallback(
    (id, letter) => {
      const set = getRevealed(id);
      if (set.has(letter)) return;
      set.add(letter);
      softResetRef.current[id] = false;
      setTick((t) => t + 1);
      const skill = puzzles.find((p) => p.id === id)?.skills?.[letter];
      cfg.callbacks.onReveal?.(id, letter, skill);
    },
    [getRevealed, puzzles, cfg.callbacks],
  );

  const handleReveal = useCallback(
    (letter) => {
      if (!cfg.behavior.revealOnDrag) return;
      if (!activeConfig) return;
      revealCar(activeConfig.id, letter);
    },
    [cfg.behavior.revealOnDrag, activeConfig, revealCar],
  );

  const handleMove = useCallback(
    ({ car, steps, status: moveStatus, state }) => {
      if (!activeConfig) return;
      cfg.callbacks.onMove?.(activeConfig.id, {
        car,
        steps,
        status: moveStatus,
        state,
      });
    },
    [activeConfig, cfg.callbacks],
  );

  const handleMoveStart = useCallback(() => {
    setStatus((s) => (s === 'ready' ? 'in-progress' : s));
  }, []);

  const handleSolved = useCallback(() => {
    if (!activeConfig || !activeBoard) return;
    const id = activeConfig.id;
    const wasAlreadySolved = !!solved[id];

    if (cfg.behavior.revealAllOnSolve) {
      revealedMapRef.current[id] = new Set(Object.keys(activeBoard.cars));
    }
    softResetRef.current[id] = false;
    setSolved((prev) => ({ ...prev, [id]: true }));
    setStatus('solved');
    cfg.callbacks.onSolvePuzzle?.(id, activeBoard.getState());
    setTick((t) => t + 1);

    if (
      !wasAlreadySolved &&
      cfg.behavior.autoAdvance &&
      activeIndex < puzzles.length - 1
    ) {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      const solvedIndex = activeIndex;
      advanceTimerRef.current = setTimeout(() => {
        setActiveIndex((i) => {
          if (i !== solvedIndex) return i; // user moved away meanwhile
          setDirection('next');
          setStatus('ready');
          setTick((t) => t + 1);
          cfg.callbacks.onBoardChange?.(
            puzzles[solvedIndex + 1]?.id,
            solvedIndex + 1,
            'next',
          );
          return Math.min(i + 1, puzzles.length - 1);
        });
        advanceTimerRef.current = null;
      }, cfg.behavior.advanceDelay);
    }
  }, [
    activeConfig,
    activeBoard,
    activeIndex,
    puzzles,
    solved,
    cfg.behavior.autoAdvance,
    cfg.behavior.advanceDelay,
    cfg.behavior.revealAllOnSolve,
    cfg.callbacks,
  ]);

  const handleReset = useCallback(() => {
    if (!activeConfig || !activeBoard) return;
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

    setStatus(wasSolved ? 'solved' : 'ready');
    setTick((t) => t + 1);
    cfg.callbacks.onReset?.(id);
  }, [activeConfig, activeBoard, solved, cfg.callbacks]);

  /* ---- lockedIds (reachable-set) ---- */
  const lockedIds = useMemo(() => {
    const set = new Set();
    if (!cfg.behavior.lockAhead) return set;
    let lastSolved = -1;
    for (let i = 0; i < puzzles.length; i++) {
      if (solved[puzzles[i].id]) lastSolved = i;
      else break;
    }
    for (let i = lastSolved + 2; i < puzzles.length; i++) {
      set.add(puzzles[i].id);
    }
    return set;
  }, [puzzles, solved, cfg.behavior.lockAhead]);

  /* ---- persistence effect ---- */
  useEffect(() => {
    if (!cfg.behavior.persist) return;
    const revealed = {};
    for (const [id, set] of Object.entries(revealedMapRef.current)) {
      revealed[id] = Array.from(set);
    }
    savePersisted(cfg.behavior.storageKey, {
      solved,
      activeIndex,
      revealed,
    });
  }, [
    cfg.behavior.persist,
    cfg.behavior.storageKey,
    solved,
    activeIndex,
    tick,
  ]);

  /* ---- onReady (once on mount) ---- */
  const onReadyRef = useRef(cfg.callbacks.onReady);
  onReadyRef.current = cfg.callbacks.onReady;
  useEffect(() => {
    onReadyRef.current?.({
      puzzles,
      total: puzzles?.length ?? 0,
      getBoard,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- imperative handle object ---- */
  const imperative = useMemo(
    () => ({
      goNext,
      goPrev,
      goTo,
      goToIndex,
      reset: handleReset,
      getBoard: (id) => boardMapRef.current[id],
      getActiveBoard: () => activeBoard,
      getState: () => ({ activeIndex, solved, status, direction }),
      setSolved: (id, value) => {
        setSolved((prev) => ({ ...prev, [id]: !!value }));
        setTick((t) => t + 1);
      },
      revealCar,
    }),
    [
      goNext,
      goPrev,
      goTo,
      goToIndex,
      handleReset,
      activeBoard,
      activeIndex,
      solved,
      status,
      direction,
      revealCar,
    ],
  );

  /* ---- return everything ---- */
  return {
    // derived
    puzzles,
    hasPuzzles,
    activeIndex,
    activeConfig,
    activeBoard,
    activeRevealed,
    allBoards,
    canGoNext,
    canGoPrev,
    lockedIds,

    // state
    solved,
    status,
    tick,
    direction,

    // setters (rarely needed outside)
    setSolved,
    setStatus,
    setTick,
    setDirection,

    // actions
    goNext,
    goPrev,
    goTo,
    goToIndex,
    revealCar,
    handleReveal,
    handleMove,
    handleMoveStart,
    handleSolved,
    handleReset,
    getBoard,
    getRevealed,

    // imperative handle
    imperative,
  };
}

export default useRushHourState;