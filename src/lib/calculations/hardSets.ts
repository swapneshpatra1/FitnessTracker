import type { MuscleGroup } from "@/generated/prisma/client";

export type HardSetStatus = "good" | "warning" | "critical";

/** Muscle groups tracked on the dashboard's weekly hard-sets view. A muscle with
 * zero logged sets is the most "neglected" case, so it must still appear (as 0),
 * not be silently omitted. */
export const TRACKED_MUSCLE_GROUPS: MuscleGroup[] = [
  "CHEST",
  "BACK",
  "SHOULDERS",
  "BICEPS",
  "TRICEPS",
  "QUADS",
  "HAMSTRINGS",
  "CALVES",
  "CORE",
];

export type MuscleSetCount = { muscle: MuscleGroup; sets: number; status: HardSetStatus };

/** Below this many weekly hard sets, a muscle is "neglected." Below the target
 * floor but above this, it's "slightly under." At/above the floor, it's on target. */
const NEGLECTED_THRESHOLD = 5;
export const HARD_SET_TARGET_FLOOR = 10;
export const HARD_SET_TARGET_CEILING = 20;

function statusFor(sets: number): HardSetStatus {
  if (sets < NEGLECTED_THRESHOLD) return "critical";
  if (sets < HARD_SET_TARGET_FLOOR) return "warning";
  return "good";
}

/** Counts non-warmup sets per primary muscle group (a "hard set" = a working set).
 * Every tracked muscle group is included even at 0 sets, since that's the clearest
 * "neglected" signal. */
export function hardSetsByMuscle(entries: { muscle: MuscleGroup }[]): MuscleSetCount[] {
  const counts = new Map<MuscleGroup, number>(TRACKED_MUSCLE_GROUPS.map((muscle) => [muscle, 0]));
  for (const entry of entries) {
    if (!counts.has(entry.muscle)) continue;
    counts.set(entry.muscle, (counts.get(entry.muscle) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([muscle, sets]) => ({ muscle, sets, status: statusFor(sets) }))
    .sort((a, b) => b.sets - a.sets);
}
