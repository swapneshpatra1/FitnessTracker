import { estimateOneRepMax } from "@/lib/calculations/oneRepMax";

export type ExerciseProgressInput = {
  exerciseId: string;
  exerciseName: string;
  date: Date;
  weight: number;
  reps: number;
};

export type BestSet = { weight: number; reps: number; oneRepMax: number };

export type ExerciseProgressSummary = {
  exerciseId: string;
  exerciseName: string;
  bestSetRecent: BestSet; // best set from the most recent session
  currentOneRepMax: number;
  thirtyDayDeltaPercent: number;
  lifetimePR: BestSet; // the set with the highest estimated 1RM ever
  lastTrainedAt: Date;
  sessionCount: number;
};

function bestSetOf(sets: { weight: number; reps: number }[]): BestSet {
  return sets.reduce<BestSet>(
    (best, set) => {
      const oneRepMax = estimateOneRepMax(set.weight, set.reps);
      return oneRepMax > best.oneRepMax ? { weight: set.weight, reps: set.reps, oneRepMax } : best;
    },
    { weight: 0, reps: 0, oneRepMax: 0 }
  );
}

/**
 * For each exercise: the best set from the most recent session, the all-time best
 * set (lifetime PR), and the % change in estimated 1RM over the last ~30 days.
 * Exercises trained in only one session are excluded — there's no trend yet.
 */
export function summarizeExerciseProgress(
  entries: ExerciseProgressInput[],
  today: Date = new Date()
): ExerciseProgressSummary[] {
  const byExercise = new Map<string, { name: string; bySession: Map<number, { weight: number; reps: number }[]> }>();

  for (const entry of entries) {
    if (!byExercise.has(entry.exerciseId)) {
      byExercise.set(entry.exerciseId, { name: entry.exerciseName, bySession: new Map() });
    }
    const group = byExercise.get(entry.exerciseId)!;
    const sessionKey = entry.date.getTime();
    const sets = group.bySession.get(sessionKey) ?? [];
    sets.push({ weight: entry.weight, reps: entry.reps });
    group.bySession.set(sessionKey, sets);
  }

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

  const summaries: ExerciseProgressSummary[] = [];

  for (const [exerciseId, { name, bySession }] of byExercise) {
    const sessions = [...bySession.entries()]
      .map(([time, sets]) => ({ date: new Date(time), best: bestSetOf(sets) }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (sessions.length < 2) continue;

    const latest = sessions[sessions.length - 1];
    // Prefer the most recent session on/before the 30-day cutoff; if the whole
    // history is shorter than 30 days, fall back to the earliest session so we
    // still show "change since you started."
    const reference =
      [...sessions].reverse().find((s) => s.date <= thirtyDaysAgo) ?? sessions[0];

    const deltaPercent =
      reference.best.oneRepMax > 0
        ? ((latest.best.oneRepMax - reference.best.oneRepMax) / reference.best.oneRepMax) * 100
        : 0;

    const lifetimePR = sessions.reduce((best, s) => (s.best.oneRepMax > best.oneRepMax ? s.best : best), sessions[0].best);

    summaries.push({
      exerciseId,
      exerciseName: name,
      bestSetRecent: latest.best,
      currentOneRepMax: Math.round(latest.best.oneRepMax * 10) / 10,
      thirtyDayDeltaPercent: Math.round(deltaPercent * 10) / 10,
      lifetimePR,
      lastTrainedAt: latest.date,
      sessionCount: sessions.length,
    });
  }

  return summaries.sort((a, b) => b.lastTrainedAt.getTime() - a.lastTrainedAt.getTime());
}
