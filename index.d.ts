import type { ComponentType } from 'react';

export interface StackLayoutProps {
  puzzles?: unknown[];
  onSolvePuzzle?: (id: string) => void;
  theme?: 'auto' | 'light' | 'dark';
}

export const StackLayout: ComponentType<StackLayoutProps>;
export const PUZZLES: unknown[];