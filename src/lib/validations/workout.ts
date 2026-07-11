import { z } from "zod";

function optionalNumber(min: number, max: number) {
  return z.preprocess(
    (val) => (val === "" || val === undefined || val === null || Number.isNaN(val) ? undefined : Number(val)),
    z.number().min(min).max(max).optional()
  );
}

export const setEntrySchema = z.object({
  setNumber: z.number().int().min(1),
  reps: z.number().int().min(0).max(200),
  weight: z.number().min(0).max(1000),
  unit: z.enum(["KG", "LB"]).default("KG"),
  rpe: optionalNumber(1, 10),
  isWarmup: z.boolean().default(false),
  notes: z.string().trim().max(200).optional(),
});

export const workoutExerciseSchema = z.object({
  exerciseId: z.string().min(1),
  order: z.number().int().min(0).default(0),
  notes: z.string().trim().max(200).optional(),
  sets: z.array(setEntrySchema).min(1),
});

export const workoutSessionSchema = z.object({
  date: z.coerce.date(),
  name: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(500).optional(),
  exercises: z.array(workoutExerciseSchema).min(1),
});

export type WorkoutSessionInput = z.input<typeof workoutSessionSchema>;
export type WorkoutSessionOutput = z.output<typeof workoutSessionSchema>;
export type WorkoutExerciseInput = z.input<typeof workoutExerciseSchema>;
export type SetEntryInput = z.input<typeof setEntrySchema>;
