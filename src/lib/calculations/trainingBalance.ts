import type { MuscleGroup } from "@/generated/prisma/client";

const PUSH_MUSCLES: MuscleGroup[] = ["CHEST", "SHOULDERS", "TRICEPS"];
const PULL_MUSCLES: MuscleGroup[] = ["BACK", "BICEPS", "TRAPS", "FOREARMS"];
const LEG_MUSCLES: MuscleGroup[] = ["QUADS", "HAMSTRINGS", "GLUTES", "CALVES"];
// CORE, FULL_BODY, CARDIO, OTHER don't fit the push/pull/legs split and are excluded.

export type TrainingBalance = {
  pushPercent: number;
  pullPercent: number;
  legsPercent: number;
  pushSets: number;
  pullSets: number;
  legsSets: number;
};

/** Splits hard-set counts into push/pull/legs percentages, the classic check for
 * programming imbalance (e.g. push-dominant programs that neglect the back). */
export function computeTrainingBalance(entries: { muscle: MuscleGroup }[]): TrainingBalance {
  let pushSets = 0;
  let pullSets = 0;
  let legsSets = 0;

  for (const entry of entries) {
    if (PUSH_MUSCLES.includes(entry.muscle)) pushSets += 1;
    else if (PULL_MUSCLES.includes(entry.muscle)) pullSets += 1;
    else if (LEG_MUSCLES.includes(entry.muscle)) legsSets += 1;
  }

  const total = pushSets + pullSets + legsSets;
  if (total === 0) {
    return { pushPercent: 0, pullPercent: 0, legsPercent: 0, pushSets, pullSets, legsSets };
  }

  return {
    pushPercent: Math.round((pushSets / total) * 100),
    pullPercent: Math.round((pullSets / total) * 100),
    legsPercent: Math.round((legsSets / total) * 100),
    pushSets,
    pullSets,
    legsSets,
  };
}
