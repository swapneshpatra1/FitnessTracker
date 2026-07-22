"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WorkoutSessionInput, WorkoutSessionOutput } from "@/lib/validations/workout";

export function ExerciseSetRow({ exerciseIndex }: { exerciseIndex: number }) {
  const { control, register } = useFormContext<WorkoutSessionInput, unknown, WorkoutSessionOutput>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });

  return (
    <div className="space-y-2">
      {fields.length > 0 && (
        <div className="text-muted-foreground grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 px-1 text-xs">
          <span>#</span>
          <span>Weight</span>
          <span>Reps</span>
          <span />
        </div>
      )}
      {fields.map((field, setIndex) => (
        <div key={field.id} className="grid grid-cols-[2rem_1fr_1fr_2rem] items-center gap-2">
          <span className="text-muted-foreground text-sm">{setIndex + 1}</span>
          <Input
            type="number"
            step="0.5"
            placeholder="kg"
            onFocus={(event) => event.currentTarget.select()}
            {...register(`exercises.${exerciseIndex}.sets.${setIndex}.weight`, { valueAsNumber: true })}
          />
          <Input
            type="number"
            placeholder="reps"
            onFocus={(event) => event.currentTarget.select()}
            {...register(`exercises.${exerciseIndex}.sets.${setIndex}.reps`, { valueAsNumber: true })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(setIndex)}
            aria-label="Remove set"
          >
            ×
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          append({
            setNumber: fields.length + 1,
            reps: 0,
            weight: 0,
            unit: "KG",
            isWarmup: false,
          })
        }
      >
        Add set
      </Button>
    </div>
  );
}
