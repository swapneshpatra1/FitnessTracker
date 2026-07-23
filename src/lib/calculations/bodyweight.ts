export type BodyweightEntry = { date: Date; weight: number };

export type BodyweightSummary = {
  current: number | null;
  sevenDayAverage: number | null;
  thirtyDayChange: number | null; // absolute change, current - value ~30 days ago
  trend: "up" | "down" | "flat" | null;
};

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Finds the entry closest to (today - days), preferring the most recent one on
 * or before that date so a "30-day change" reflects sustained trend, not noise. */
function closestOnOrBefore(entries: BodyweightEntry[], cutoff: Date): BodyweightEntry | null {
  const eligible = entries.filter((e) => e.date <= cutoff);
  if (eligible.length === 0) return null;
  return eligible.reduce((latest, e) => (e.date > latest.date ? e : latest));
}

export function summarizeBodyweight(entries: BodyweightEntry[], today: Date = new Date()): BodyweightSummary {
  const sorted = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
  if (sorted.length === 0) {
    return { current: null, sevenDayAverage: null, thirtyDayChange: null, trend: null };
  }

  const current = sorted[sorted.length - 1].weight;

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
  const sevenDayAverage = average(sorted.filter((e) => e.date >= sevenDaysAgo).map((e) => e.weight));

  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
  const reference = closestOnOrBefore(sorted, thirtyDaysAgo) ?? sorted[0];
  const thirtyDayChange = reference ? Math.round((current - reference.weight) * 10) / 10 : null;

  let trend: BodyweightSummary["trend"] = "flat";
  if (thirtyDayChange !== null) {
    if (thirtyDayChange > 0.2) trend = "up";
    else if (thirtyDayChange < -0.2) trend = "down";
  }

  return {
    current,
    sevenDayAverage: sevenDayAverage !== null ? Math.round(sevenDayAverage * 10) / 10 : null,
    thirtyDayChange,
    trend,
  };
}

export type WeeklyBodyweightPoint = {
  weekLabel: string;
  weekOfMonthLabel: string; // "W1", "W2"... sequential within each visible month group
  monthLabel: string; // e.g. "June"
  averageWeight: number | null;
  workoutCount: number;
};

function weekStart(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diffToMonday);
  return d;
}

/** Weekly-average bodyweight series alongside workout counts per week — the two
 * are rendered as separate stacked charts sharing a timeline (never one dual-axis
 * chart) so both are readable at their own scale. */
export function weeklyBodyweightSeries(
  bodyweightEntries: BodyweightEntry[],
  workoutDates: Date[],
  weekCount: number,
  today: Date = new Date()
): WeeklyBodyweightPoint[] {
  const currentWeekStart = weekStart(today);
  const buckets: { start: Date; weights: number[]; workouts: number }[] = [];
  for (let i = weekCount - 1; i >= 0; i--) {
    const start = new Date(currentWeekStart);
    start.setUTCDate(start.getUTCDate() - i * 7);
    buckets.push({ start, weights: [], workouts: 0 });
  }

  for (const entry of bodyweightEntries) {
    const start = weekStart(entry.date).getTime();
    const bucket = buckets.find((b) => b.start.getTime() === start);
    if (bucket) bucket.weights.push(entry.weight);
  }
  for (const date of workoutDates) {
    const start = weekStart(date).getTime();
    const bucket = buckets.find((b) => b.start.getTime() === start);
    if (bucket) bucket.workouts += 1;
  }

  // Number weeks sequentially within each visible month group (W1, W2, ...) rather
  // than by calendar week-of-month, so a rolling window that starts mid-month still
  // reads cleanly instead of opening on e.g. "W3".
  let weekOfMonth = 0;
  let lastMonthKey = "";
  return buckets.map((b) => {
    const monthKey = `${b.start.getUTCFullYear()}-${b.start.getUTCMonth()}`;
    weekOfMonth = monthKey === lastMonthKey ? weekOfMonth + 1 : 1;
    lastMonthKey = monthKey;

    return {
      weekLabel: b.start.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
      weekOfMonthLabel: `W${weekOfMonth}`,
      monthLabel: b.start.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" }),
      averageWeight: b.weights.length > 0 ? Math.round(average(b.weights)! * 10) / 10 : null,
      workoutCount: b.workouts,
    };
  });
}
