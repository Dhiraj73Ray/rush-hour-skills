/**
 * index.d.ts
 * ------------------------------------------------------------------
 * TypeScript definitions for rush-hour-skills.
 * ------------------------------------------------------------------
 */

import type {
  ComponentType,
  CSSProperties,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  SetStateAction,
} from 'react';

/* ============================================================
 * 1. PUZZLE DATA
 * ============================================================ */

export interface PuzzleConfig {
  /** Unique id, e.g. 'p1' */
  id: string;
  /** Display title, e.g. 'Foundation' */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Puzzle grid string, e.g. '.A.. .A.C .A.C .BBC' */
  puzzle: string;
  /** Exit location */
  exit: {
    side: 'top' | 'right' | 'bottom' | 'left';
    /** Row index (for left/right) or col index (for top/bottom) */
    position: number;
  };
  /** Map car letter → skill name, e.g. { A: 'Python', B: 'SQL' } */
  skills: Record<string, string>;
}

/* ============================================================
 * 2. TOKENS (theme)
 * ============================================================ */

export interface Tokens {
  // surface / text
  bg?: string;
  text?: string;
  muted?: string;
  accent?: string;
  success?: string;

  // panels
  panelGradient?: string;
  panelBorder?: string;

  // tray
  trayBg?: string;
  trayShadow?: string;

  // preview tray
  previewTrayBg?: string;

  // buttons
  btnBg?: string;
  btnBgHover?: string;
  btnBorder?: string;

  // dots
  dotBg?: string;

  // blocks
  blockMainBg?: string;
  blockObstacleBg?: string;
  blockDarkOverlay?: string;
  blockShadow?: string;
  blockRadius?: string;

  // preview pieces
  previewPieceBg?: string;
  previewMainBg?: string;

  // exit
  exitBg?: string;
  exitGlow?: string;

  // lock
  lockBg?: string;
  lockIconColor?: string;

  // sizing
  boardSize?: string | number;
  sectionPadding?: string | number;
  sectionGap?: string | number;
  sectionMaxWidth?: string | number;
  radius?: string | number;
  radiusInner?: string | number;
  arrowPad?: string | number;

  // allow any extra custom var
  [key: string]: string | number | undefined;
}

export type ThemeOption = 'auto' | 'light' | 'dark' | Partial<Tokens>;

/* ============================================================
 * 3. CONFIG SECTIONS
 * ============================================================ */

export interface HeaderConfig {
  title?: string | null;
  subtitle?: string | null;
}

export type StackSide = 'auto' | 'left' | 'right' | 'both' | 'none';

export interface LayoutConfig {
  showHeader?: boolean;
  showStacks?: boolean;
  showDots?: boolean;
  showStatus?: boolean;
  showCaption?: boolean;
  showReset?: boolean;
  showFooter?: boolean;
  stackSide?: StackSide;
}

export interface BehaviorConfig {
  autoAdvance?: boolean;
  advanceDelay?: number;
  lockAhead?: boolean;
  persist?: boolean;
  storageKey?: string;
  startIndex?: number;
  loop?: boolean;
  revealAllOnSolve?: boolean;
  revealOnDrag?: boolean;
  swipeThreshold?: number;
}

export interface AnimationConfig {
  slideMs?: number;
  revealMs?: number;
  blockMoveMs?: number;
  stackShiftMs?: number;
  exitGlowMs?: number;
  disable?: boolean;
}

export interface RulesConfig {
  maxMoves?: number | null;
  hint?: ((board: Board) => { car: string; steps: number } | null) | null;
  canAdvance?: ((id: string, state: StackState) => boolean) | null;
  winCondition?: ((board: Board) => boolean) | null;
}

/* ============================================================
 * 4. RUNTIME STATE
 * ============================================================ */

export type Status = 'ready' | 'in-progress' | 'solved';

export interface StackState {
  activeIndex: number;
  solved: Record<string, boolean>;
  status: Status;
  direction: 'next' | 'prev';
}

/* ============================================================
 * 5. ENGINE
 * ============================================================ */

export interface Car {
  row: number;
  col: number;
  length: number;
  direction: 'H' | 'V';
}

export interface BoardState {
  size: number;
  cars: Record<string, Car>;
  board: string[][];
  isWon: boolean;
  exit: PuzzleConfig['exit'];
}

export interface MoveResult {
  status: 'ok' | 'blocked' | 'wall' | 'invalid' | 'not_found';
  message: string;
}

export declare class Board {
  constructor(puzzleString: string, exit: PuzzleConfig['exit']);
  readonly size: number;
  readonly cars: Record<string, Car>;
  readonly board: string[][];
  readonly exit: PuzzleConfig['exit'];
  readonly puzzleString: string;
  isWon(): boolean;
  move(carId: string, steps: number): MoveResult;
  moveSingleStep(carId: string, step: number): MoveResult['status'];
  render(): void;
  validate(): void;
  reset(): void;
  getState(): BoardState;
}

export type ParserFn = (puzzleString: string) => {
  size: number;
  cars: Record<string, Car>;
};

export type ValidatorFn = (board: Board) => void;

/* ============================================================
 * 6. CALLBACKS
 * ============================================================ */

export interface MoveContext {
  car: string;
  steps: number;
  status: MoveResult['status'];
  state: BoardState;
}

export interface ReadyContext {
  puzzles: PuzzleConfig[];
  total: number;
  getBoard: (id: string) => Board | undefined;
}

export interface Callbacks {
  onSolvePuzzle?: (id: string, state: BoardState) => void;
  onMove?: (id: string, ctx: MoveContext) => void;
  onReveal?: (id: string, letter: string, skill: string | undefined) => void;
  onBoardChange?: (
    id: string,
    index: number,
    direction: 'next' | 'prev',
  ) => void;
  onReset?: (id: string) => void;
  onSlide?: (direction: 'next' | 'prev') => void;
  onReady?: (ctx: ReadyContext) => void;
}

/* ============================================================
 * 7. SLOTS
 * ============================================================ */

export interface HeaderSlotProps {
  title?: string | null;
  subtitle?: string | null;
  index: number;
  total: number;
}

export interface StatusSlotProps {
  status: Status;
}

export interface ResetSlotProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}

export interface CaptionSlotProps {
  config: PuzzleConfig;
  index: number;
  total: number;
}

export interface DotsSlotProps {
  puzzles: PuzzleConfig[];
  activeIndex: number;
  solved: Record<string, boolean>;
  lockedIds?: Set<string>;
  onSelect?: (index: number) => void;
}

export interface BlockSlotProps {
  letter: string;
  car: Car;
  size: number;
  cellSize: number;
  skillName: string;
  revealed: boolean;
  selected: boolean;
  dragging: boolean;
  disabled: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}

export interface LockSlotProps {
  id: string;
}

export interface Slots {
  header?: ComponentType<HeaderSlotProps>;
  footer?: ComponentType<Record<string, unknown>>;
  status?: ComponentType<StatusSlotProps>;
  reset?: ComponentType<ResetSlotProps>;
  caption?: ComponentType<CaptionSlotProps>;
  dots?: ComponentType<DotsSlotProps>;
  block?: (props: BlockSlotProps) => ReactNode;
  lock?: ComponentType<LockSlotProps>;
  loader?: ComponentType<Record<string, never>>;
  empty?: ComponentType<Record<string, never>>;
}

/* ============================================================
 * 8. IMPERATIVE HANDLE
 * ============================================================ */

export interface StackLayoutHandle {
  goNext(): void;
  goPrev(): void;
  goTo(id: string): void;
  goToIndex(index: number): void;
  reset(): void;
  getBoard(id: string): Board | undefined;
  getActiveBoard(): Board | null;
  getState(): StackState;
  setSolved(id: string, value: boolean): void;
  revealCar(id: string, letter: string): void;
}

/* ============================================================
 * 9. MAIN PROPS
 * ============================================================ */

export interface StackLayoutProps extends Callbacks {
  puzzles?: PuzzleConfig[];
  header?: HeaderConfig;
  theme?: ThemeOption;
  tokens?: Partial<Tokens>;
  layout?: LayoutConfig;
  behavior?: BehaviorConfig;
  animation?: AnimationConfig;
  rules?: RulesConfig;
  slots?: Slots;

  className?: string;
  style?: CSSProperties;
  unstyled?: boolean;

  engine?: typeof Board;
  parser?: ParserFn;
  validator?: ValidatorFn;
}

/* ============================================================
 * 10. COMPONENT EXPORTS
 * ============================================================ */

export const StackLayout: ForwardRefExoticComponent<
  StackLayoutProps & RefAttributes<StackLayoutHandle>
>;

export const PUZZLES: PuzzleConfig[];

export const Board: typeof Board;

/* sub-components (advanced usage) */
export const Stack: ComponentType<Record<string, unknown>>;
export const MiniBoard: ComponentType<Record<string, unknown>>;
export const Block: ComponentType<Record<string, unknown>>;
export const BoardPreview: ComponentType<Record<string, unknown>>;
export const Header: ComponentType<HeaderSlotProps>;
export const StatusPill: ComponentType<StatusSlotProps>;
export const ResetButton: ComponentType<ResetSlotProps>;
export const Caption: ComponentType<CaptionSlotProps>;
export const Dots: ComponentType<DotsSlotProps>;
export const Lock: ComponentType<LockSlotProps>;

/* ============================================================
 * 11. CONTEXT HOOKS
 * ============================================================ */

export interface RushHourContextValue {
  activeIndex: number;
  activeId: string | undefined;
  activeConfig: PuzzleConfig | null;
  puzzles: PuzzleConfig[];
  solved: Record<string, boolean>;
  revealed: Set<string> | null;
  status: Status;
  goNext: () => void;
  goPrev: () => void;
  goTo: (id: string) => void;
  goToIndex: (index: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  getBoard: (id: string) => Board | undefined;
  getActiveBoard: () => Board | null;
  reset: () => void;
  setSolved: (id: string, value: boolean) => void;
  revealCar: (id: string, letter: string) => void;
  config: unknown;
}

export function useRushHour(): RushHourContextValue;
export function useRushHourOptional(): RushHourContextValue | null;
export function useBoard(id: string): Board | undefined;
export function useActiveBoard(): Board | null;
export function useStatus(): Status;
export function useSolved(): Record<string, boolean>;
export function useIsSolved(id: string): boolean;
export function useConfig(): unknown;

/* ============================================================
 * 12. CONFIG UTILITIES (advanced)
 * ============================================================ */

export function toCssVars(
  tokens: Record<string, string | number>,
): Record<string, string>;

export function mergeTokens(
  ...sources: Array<Record<string, string | number> | undefined>
): Record<string, string | number>;

export const DEFAULT_TOKENS: Required<Tokens>;
export const LIGHT_TOKENS: Partial<Tokens>;
export const DEFAULT_HEADER: Required<HeaderConfig>;
export const DEFAULT_LAYOUT: Required<LayoutConfig>;
export const DEFAULT_BEHAVIOR: Required<BehaviorConfig>;
export const DEFAULT_ANIMATION: Required<AnimationConfig>;
export const DEFAULT_RULES: RulesConfig;

export function normalizeConfig(props: StackLayoutProps): unknown;