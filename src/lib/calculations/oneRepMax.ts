/** Epley formula estimated 1-rep max. Returns the raw weight for single-rep sets. */
export function estimateOneRepMax(weight: number, reps: number): number {
  if (reps <= 1) return weight;
  return weight * (1 + reps / 30);
}

export function totalVolume(sets: { weight: number; reps: number }[]): number {
  return sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
}

export function bestSet<T extends { weight: number; reps: number }>(
  sets: T[]
): T | undefined {
  return sets.reduce<T | undefined>((best, set) => {
    if (!best) return set;
    return estimateOneRepMax(set.weight, set.reps) > estimateOneRepMax(best.weight, best.reps)
      ? set
      : best;
  }, undefined);
}
