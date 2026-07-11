import { estimateOneRepMax } from "@/lib/calculations/oneRepMax";

export type PersonalRecordInput = {
  exerciseId: string;
  exerciseName: string;
  date: Date;
  weight: number;
  reps: number;
};

export type PersonalRecord = {
  exerciseId: string;
  exerciseName: string;
  date: Date;
  type: "oneRepMax" | "maxWeight";
  weight: number;
  reps: number;
  value: number; // the e1RM (for both types — for maxWeight it's still useful context)
  previousValue: number | null;
};

/**
 * Scans set history chronologically per exercise and flags every set that set a
 * new all-time best — either a new estimated-1RM, or a new heaviest weight
 * actually lifted (independent of reps, e.g. a first 100kg squat at any rep count).
 * A single set can trigger both.
 */
export function detectPersonalRecords(entries: PersonalRecordInput[]): PersonalRecord[] {
  const byExercise = new Map<string, PersonalRecordInput[]>();
  for (const entry of entries) {
    const list = byExercise.get(entry.exerciseId) ?? [];
    list.push(entry);
    byExercise.set(entry.exerciseId, list);
  }

  const records: PersonalRecord[] = [];

  for (const sets of byExercise.values()) {
    const sorted = [...sets].sort((a, b) => a.date.getTime() - b.date.getTime());
    let bestOneRepMax = 0;
    let bestWeight = 0;

    for (const set of sorted) {
      const oneRepMax = estimateOneRepMax(set.weight, set.reps);

      if (oneRepMax > bestOneRepMax) {
        records.push({
          exerciseId: set.exerciseId,
          exerciseName: set.exerciseName,
          date: set.date,
          type: "oneRepMax",
          weight: set.weight,
          reps: set.reps,
          value: Math.round(oneRepMax * 10) / 10,
          previousValue: bestOneRepMax > 0 ? Math.round(bestOneRepMax * 10) / 10 : null,
        });
        bestOneRepMax = oneRepMax;
      }

      if (set.weight > bestWeight) {
        records.push({
          exerciseId: set.exerciseId,
          exerciseName: set.exerciseName,
          date: set.date,
          type: "maxWeight",
          weight: set.weight,
          reps: set.reps,
          value: set.weight,
          previousValue: bestWeight > 0 ? bestWeight : null,
        });
        bestWeight = set.weight;
      }
    }
  }

  return records.sort((a, b) => b.date.getTime() - a.date.getTime());
}
