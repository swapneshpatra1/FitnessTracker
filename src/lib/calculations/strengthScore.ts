import { estimateOneRepMax } from "@/lib/calculations/oneRepMax";

/** The lifts a composite "Strength Score" is built from — the big compounds that
 * best represent overall strength. Only lifts the user has actually logged count. */
export const STRENGTH_SCORE_LIFTS = [
  "Barbell Back Squat",
  "Barbell Bench Press",
  "Deadlift",
  "Barbell Overhead Press",
];

export type StrengthScoreEntry = { exerciseName: string; date: Date; weight: number; reps: number };

/**
 * Sums the best estimated 1RM (as of `asOf`) across whichever of the main lifts
 * the user has logged at least once by that date. Comparing this at two points in
 * time gives a simple, explainable "is my overall strength trending up" signal.
 */
export function computeStrengthScore(entries: StrengthScoreEntry[], asOf: Date): number {
  let total = 0;
  for (const liftName of STRENGTH_SCORE_LIFTS) {
    let best = 0;
    for (const entry of entries) {
      if (entry.exerciseName !== liftName || entry.date > asOf) continue;
      best = Math.max(best, estimateOneRepMax(entry.weight, entry.reps));
    }
    total += best;
  }
  return Math.round(total);
}
