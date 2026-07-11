/** Dates should be normalized to UTC midnight (no time component). */
export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toUtcMidnight(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Counts consecutive *workouts* (not consecutive calendar days) as a streak — a
 * gap of up to `maxGapDays` between sessions doesn't break it, since most routines
 * train 3-4x/week with rest days by design. A longer gap resets the streak.
 * Mirrors how Hevy/Strong define "workout streak."
 */
export function workoutStreaks(
  workoutDates: Date[],
  maxGapDays: number = 2,
  today: Date = new Date()
): { current: number; longest: number } {
  const uniqueDays = [...new Set(workoutDates.map(toDateKey))]
    .map((key) => new Date(`${key}T00:00:00.000Z`))
    .sort((a, b) => a.getTime() - b.getTime());

  if (uniqueDays.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let runLength = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const gapDays = Math.round((uniqueDays[i].getTime() - uniqueDays[i - 1].getTime()) / MS_PER_DAY);
    runLength = gapDays <= maxGapDays + 1 ? runLength + 1 : 1;
    longest = Math.max(longest, runLength);
  }

  let current = 1;
  for (let i = uniqueDays.length - 1; i > 0; i--) {
    const gapDays = Math.round((uniqueDays[i].getTime() - uniqueDays[i - 1].getTime()) / MS_PER_DAY);
    if (gapDays <= maxGapDays + 1) {
      current += 1;
    } else {
      break;
    }
  }

  const lastWorkout = uniqueDays[uniqueDays.length - 1];
  const daysSinceLast = Math.round((toUtcMidnight(today).getTime() - lastWorkout.getTime()) / MS_PER_DAY);
  if (daysSinceLast > maxGapDays + 1) current = 0;

  return { current, longest };
}

export function workoutCountInLastNDays(workoutDates: Date[], days: number, today: Date = new Date()): number {
  const cutoff = new Date(today);
  cutoff.setUTCDate(cutoff.getUTCDate() - days);
  return workoutDates.filter((date) => date >= cutoff && date <= today).length;
}
