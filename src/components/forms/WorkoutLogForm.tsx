"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useFieldArray, useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  workoutSessionSchema,
  type WorkoutSessionInput,
  type WorkoutSessionOutput,
} from "@/lib/validations/workout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExerciseSetRow } from "@/components/forms/ExerciseSetRow";
import { AddExerciseForm } from "@/components/forms/AddExerciseForm";

type ExerciseOption = { id: string; name: string };
type ComboboxOption = { value: string; label: string };

function describeValidationError(errors: FieldErrors<WorkoutSessionInput>): string {
  const exerciseErrors = errors.exercises;
  if (Array.isArray(exerciseErrors)) {
    for (let i = 0; i < exerciseErrors.length; i++) {
      const exerciseError = exerciseErrors[i];
      if (!exerciseError) continue;
      if (exerciseError.exerciseId) {
        return `Exercise ${i + 1}: pick an exercise from the search box before saving.`;
      }
      if (exerciseError.sets) {
        return `Exercise ${i + 1}: check that every set has a weight and reps filled in.`;
      }
    }
  }
  if (errors.exercises) {
    return "Add at least one exercise with a selected name and at least one set.";
  }
  if (errors.date) {
    return "Pick a valid date.";
  }
  return "Some fields need attention before this can be saved.";
}

function todayDateInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function WorkoutLogForm({
  exerciseOptions,
  defaultValues,
  sessionId,
}: {
  exerciseOptions: ExerciseOption[];
  defaultValues?: Partial<WorkoutSessionInput>;
  sessionId?: string;
}) {
  const router = useRouter();
  const [exerciseList, setExerciseList] = useState(exerciseOptions);
  const [newExerciseRowIndex, setNewExerciseRowIndex] = useState<number | null>(null);
  const exerciseComboboxItems: ComboboxOption[] = useMemo(
    () => exerciseList.map((option) => ({ value: option.id, label: option.name })),
    [exerciseList]
  );
  const methods = useForm<WorkoutSessionInput, unknown, WorkoutSessionOutput>({
    resolver: zodResolver(workoutSessionSchema),
    defaultValues: {
      date: new Date(todayDateInputValue()),
      exercises: [],
      ...defaultValues,
    },
  });

  const { control, register, handleSubmit, watch, setValue, formState } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "exercises" });

  function handleExerciseCreated(exercise: { id: string; name: string }) {
    setExerciseList((prev) => [...prev, exercise].sort((a, b) => a.name.localeCompare(b.name)));
    if (newExerciseRowIndex !== null) {
      setValue(`exercises.${newExerciseRowIndex}.exerciseId`, exercise.id);
    }
    setNewExerciseRowIndex(null);
  }

  async function onSubmit(values: WorkoutSessionOutput) {
    const url = sessionId ? `/api/sessions/${sessionId}` : "/api/sessions";
    let response: Response;
    try {
      response = await fetch(url, {
        method: sessionId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch (error) {
      console.error("Network error while saving workout", error);
      toast.error("Couldn't reach the server — check your connection and try again. Your entries are still here.");
      return;
    }

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.error ? "Could not save workout: invalid data." : "Could not save workout. Please try again.");
      console.error("Failed to save workout", body?.error);
      return;
    }

    toast.success(sessionId ? "Workout updated" : "Workout logged");
    router.push("/history");
    router.refresh();
  }

  function onInvalid(errors: FieldErrors<WorkoutSessionInput>) {
    console.error("Workout form failed validation", errors);
    toast.error(describeValidationError(errors));
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        <Card>
          <CardContent className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                defaultValue={todayDateInputValue()}
                onChange={(event) => setValue("date", new Date(event.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="name">Session name (optional)</Label>
              <Input id="name" placeholder="e.g. Push Day" {...register("name")} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" {...register("notes")} />
            </div>
          </CardContent>
        </Card>

        {fields.map((field, index) => {
          const exerciseId = watch(`exercises.${index}.exerciseId`);
          return (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Exercise {index + 1}</CardTitle>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                  Remove
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label>Exercise</Label>
                    <Dialog
                      open={newExerciseRowIndex === index}
                      onOpenChange={(open) => setNewExerciseRowIndex(open ? index : null)}
                    >
                      <DialogTrigger render={<Button type="button" variant="link" size="sm" className="h-auto p-0" />}>
                        + New exercise
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add a custom exercise</DialogTitle>
                        </DialogHeader>
                        <AddExerciseForm onCreated={handleExerciseCreated} />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Combobox
                    items={exerciseComboboxItems}
                    value={exerciseComboboxItems.find((option) => option.value === exerciseId) ?? null}
                    onValueChange={(option) =>
                      setValue(`exercises.${index}.exerciseId`, (option as ComboboxOption | null)?.value ?? "")
                    }
                  >
                    <ComboboxInput placeholder="Search exercises..." className="w-full" />
                    <ComboboxContent>
                      <ComboboxEmpty>No exercises found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item: ComboboxOption) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
                <ExerciseSetRow exerciseIndex={index} />
              </CardContent>
            </Card>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              exerciseId: "",
              order: fields.length,
              sets: [{ setNumber: 1, reps: 0, weight: 0, unit: "KG", isWarmup: false }],
            })
          }
        >
          Add exercise
        </Button>

        <div className="flex justify-end">
          <Button type="submit" disabled={formState.isSubmitting || fields.length === 0}>
            {sessionId ? "Save changes" : "Log workout"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
