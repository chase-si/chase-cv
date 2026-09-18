import type { FloorPlan } from "./types";

export const MIN_HISTORY_CAPACITY = 30;
export const DEFAULT_HISTORY_CAPACITY = 50;

export interface HistoryEntry<T = FloorPlan> {
  plan: T;
  description?: string;
  timestamp: number;
}

export interface PlanHistory<T = FloorPlan> {
  past: HistoryEntry<T>[];
  present: HistoryEntry<T>;
  future: HistoryEntry<T>[];
  capacity: number;
}

export interface CreateHistoryOptions {
  capacity?: number;
  description?: string;
}

/**
 * Creates an immutable history container initialized with a floor plan.
 * Guarantees minimum capacity >= 30 (AC-8).
 */
export function createPlanHistory<T = FloorPlan>(
  initialPlan: T,
  options?: CreateHistoryOptions,
): PlanHistory<T> {
  const capacity = Math.max(
    MIN_HISTORY_CAPACITY,
    options?.capacity ?? DEFAULT_HISTORY_CAPACITY,
  );

  return {
    past: [],
    present: {
      plan: initialPlan,
      description: options?.description,
      timestamp: Date.now(),
    },
    future: [],
    capacity,
  };
}

/**
 * Checks whether undo is possible (past stack is not empty).
 */
export function canUndo<T = FloorPlan>(history: PlanHistory<T>): boolean {
  return history.past.length > 0;
}

/**
 * Checks whether redo is possible (future stack is not empty).
 */
export function canRedo<T = FloorPlan>(history: PlanHistory<T>): boolean {
  return history.future.length > 0;
}

/**
 * Commits a newly updated plan into history.
 * - Previous present is pushed to past.
 * - Future is cleared (branching edit).
 * - Past is capped to history.capacity (>= 30).
 * - If nextPlan is referentially equal to present.plan, history is returned unchanged.
 */
export function commitPlanChange<T = FloorPlan>(
  history: PlanHistory<T>,
  nextPlan: T,
  description?: string,
): PlanHistory<T> {
  if (history.present.plan === nextPlan) {
    return history;
  }

  const newEntry: HistoryEntry<T> = {
    plan: nextPlan,
    description,
    timestamp: Date.now(),
  };

  const newPast = [...history.past, history.present];
  const cappedPast =
    newPast.length > history.capacity
      ? newPast.slice(newPast.length - history.capacity)
      : newPast;

  return {
    past: cappedPast,
    present: newEntry,
    future: [],
    capacity: history.capacity,
  };
}

/**
 * Undoes the last committed change.
 * - Moves present to future.
 * - Pops the most recent entry from past into present.
 * - Returns unchanged history if cannot undo.
 */
export function undo<T = FloorPlan>(history: PlanHistory<T>): PlanHistory<T> {
  if (!canUndo(history)) {
    return history;
  }

  const previousEntry = history.past[history.past.length - 1];
  const remainingPast = history.past.slice(0, -1);
  const nextFuture = [history.present, ...history.future];

  return {
    past: remainingPast,
    present: previousEntry,
    future: nextFuture,
    capacity: history.capacity,
  };
}

/**
 * Redoes the last undone change.
 * - Moves present to past.
 * - Pops the next entry from future into present.
 * - Returns unchanged history if cannot redo.
 */
export function redo<T = FloorPlan>(history: PlanHistory<T>): PlanHistory<T> {
  if (!canRedo(history)) {
    return history;
  }

  const nextEntry = history.future[0];
  const remainingFuture = history.future.slice(1);
  const nextPast = [...history.past, history.present];
  const cappedPast =
    nextPast.length > history.capacity
      ? nextPast.slice(nextPast.length - history.capacity)
      : nextPast;

  return {
    past: cappedPast,
    present: nextEntry,
    future: remainingFuture,
    capacity: history.capacity,
  };
}

/**
 * Returns current present plan from history.
 */
export function getCurrentPlan<T = FloorPlan>(history: PlanHistory<T>): T {
  return history.present.plan;
}
