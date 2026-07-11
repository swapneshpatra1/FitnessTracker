import { z } from "zod";
import { MUSCLE_GROUPS } from "@/lib/constants/muscleGroups";

const muscleGroupEnum = z.enum(MUSCLE_GROUPS as [string, ...string[]]);

export const exerciseSchema = z.object({
  name: z.string().trim().min(2).max(80),
  primaryMuscle: muscleGroupEnum,
  secondaryMuscles: z.array(muscleGroupEnum).default([]),
  equipment: z.string().trim().max(60).optional(),
});

export type ExerciseInput = z.input<typeof exerciseSchema>;
export type ExerciseOutput = z.output<typeof exerciseSchema>;
