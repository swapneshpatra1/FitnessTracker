/** Dates should be normalized to UTC midnight (no time component). */
export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toUtcMidnight(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** Monday of the calendar week containing `date` (UTC). */
function weekStart(date: Date): Date {
  const d = toUtcMidnight(date);
  const day = d.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diffToMonday);
  return d;
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

/**
 * Counts workouts within the current calendar week (Monday through today) --
 * a fixed boundary that resets each Monday, not a rolling N-day window. A
 * weekly *goal* needs this: "did I hit my target this week" only makes sense
 * against a week that actually ends and restarts.
 */
export function workoutCountThisWeek(workoutDates: Date[], today: Date = new Date()): number {
  const start = weekStart(today);
  const end = toUtcMidnight(today);
  return workoutDates.filter((date) => {
    const day = toUtcMidnight(date);
    return day >= start && day <= end;
  }).length;
}
