/**
 * src/context.js
 * ------------------------------------------------------------------
 * Context + hooks for <StackLayout /> internals and slot overrides.
 *
 *   const { activeIndex, solved, goNext } = useRushHour();
 *   const board = useActiveBoard();
 *   const board = useBoard('p1');
 * ------------------------------------------------------------------
 */

import { createContext, useContext } from 'react';

/**
 * The context value shape (documented for clarity — not enforced):
 *
 * {
 *   // ---- state ----
 *   activeIndex: number,
 *   activeId: string,
 *   activeConfig: object,
 *   puzzles: array,
 *   solved: Record<string, boolean>,
 *   revealed: Set<string>,           // revealed letters on active board
 *   status: 'ready'|'in-progress'|'solved',
 *
 *   // ---- navigation ----
 *   goNext: () => void,
 *   goPrev: () => void,
 *   goTo: (id: string) => void,
 *   goToIndex: (i: number) => void,
 *   canGoNext: boolean,
 *   canGoPrev: boolean,
 *
 *   // ---- board access ----
 *   getBoard: (id: string) => Board,
 *   getActiveBoard: () => Board,
 *
 *   // ---- actions ----
 *   reset: () => void,
 *   setSolved: (id: string, value: boolean) => void,
 *   revealCar: (id: string, letter: string) => void,
 *
 *   // ---- config (already normalized) ----
 *   config: object,   // full normalized config from normalizeConfig()
 * }
 */
export const RushHourContext = createContext(null);
RushHourContext.displayName = 'RushHourContext';

/* ---------- base hook ---------- */

/**
 * Read the full context. Throws if used outside <StackLayout /> so
 * mistakes surface early instead of returning `null`.
 */
export function useRushHour() {
  const ctx = useContext(RushHourContext);
  if (!ctx) {
    throw new Error(
      '[rush-hour-skills] useRushHour() must be used inside <StackLayout />.',
    );
  }
  return ctx;
}

/**
 * Same as useRushHour but returns null instead of throwing.
 * Useful for components that may be rendered both inside and outside.
 */
export function useRushHourOptional() {
  return useContext(RushHourContext);
}

/* ---------- board accessors ---------- */

/**
 * Get the live Board instance for a given puzzle id.
 * Returns undefined if the id is unknown.
 */
export function useBoard(id) {
  const { getBoard } = useRushHour();
  return id != null ? getBoard(id) : undefined;
}

/**
 * Get the Board instance for the currently active puzzle.
 */
export function useActiveBoard() {
  const { getActiveBoard } = useRushHour();
  return getActiveBoard();
}

/* ---------- state slices (small conveniences) ---------- */

/** Current status string: 'ready' | 'in-progress' | 'solved' */
export function useStatus() {
  return useRushHour().status;
}

/** Solved map: { [puzzleId]: true } */
export function useSolved() {
  return useRushHour().solved;
}

/** Is the given puzzle solved? */
export function useIsSolved(id) {
  return !!useRushHour().solved[id];
}

/** Full normalized config (tokens, layout, behavior, animation, rules) */
export function useConfig() {
  return useRushHour().config;
}

export default RushHourContext;