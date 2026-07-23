import { z } from "zod";

function optionalNumber(min: number, max: number) {
  return z.preprocess(
    (val) => (val === "" || val === undefined || val === null || Number.isNaN(val) ? undefined : Number(val)),
    z.number().min(min).max(max).optional()
  );
}

export const profileSchema = z.object({
  age: optionalNumber(10, 100),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  heightCm: optionalNumber(50, 272),
  weightKg: optionalNumber(20, 400),
  goal: z
    .enum(["LOSE_WEIGHT", "BUILD_MUSCLE", "IMPROVE_ENDURANCE", "GENERAL_FITNESS", "ATHLETIC_PERFORMANCE", "OTHER"])
    .optional(),
  preferredUnit: z.enum(["KG", "LB"]).default("KG"),
  weeklyWorkoutGoal: z.number().int().min(1).max(14).default(4),
  targetWeightKg: optionalNumber(20, 400),
});

export type ProfileInput = z.input<typeof profileSchema>;
export type ProfileOutput = z.output<typeof profileSchema>;
