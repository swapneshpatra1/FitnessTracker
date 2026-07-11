import { z } from "zod";

export const bodyweightEntrySchema = z.object({
  date: z.coerce.date(),
  weight: z.number().min(20).max(400),
  unit: z.enum(["KG", "LB"]).default("KG"),
});

export type BodyweightEntryInput = z.input<typeof bodyweightEntrySchema>;
export type BodyweightEntryOutput = z.output<typeof bodyweightEntrySchema>;
