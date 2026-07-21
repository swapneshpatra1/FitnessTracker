"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { exerciseSchema, type ExerciseInput, type ExerciseOutput } from "@/lib/validations/exercise";
import { MUSCLE_GROUPS, MUSCLE_GROUP_LABELS } from "@/lib/constants/muscleGroups";
import type { MuscleGroup } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CreatedExercise = { id: string; name: string };

export function AddExerciseForm({ onCreated }: { onCreated?: (exercise: CreatedExercise) => void }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExerciseInput, unknown, ExerciseOutput>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: { secondaryMuscles: [] },
  });

  const primaryMuscle = watch("primaryMuscle");

  async function onSubmit(values: ExerciseOutput) {
    let response: Response;
    try {
      response = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } catch (error) {
      console.error("Network error while creating exercise", error);
      toast.error("Couldn't reach the server — check your connection and try again.");
      return;
    }

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      toast.error(body?.error ?? "Could not create exercise.");
      return;
    }

    const created = await response.json();
    toast.success("Exercise added");
    reset();
    router.refresh();
    onCreated?.({ id: created.id, name: created.name });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="e.g. Cable Fly" {...register("name")} />
        {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="primaryMuscle">Primary muscle</Label>
        <Select
          items={MUSCLE_GROUP_LABELS}
          value={primaryMuscle}
          onValueChange={(value) => setValue("primaryMuscle", value as MuscleGroup)}
        >
          <SelectTrigger id="primaryMuscle" className="w-full">
            <SelectValue placeholder="Select a muscle group" />
          </SelectTrigger>
          <SelectContent>
            {MUSCLE_GROUPS.map((group) => (
              <SelectItem key={group} value={group}>
                {MUSCLE_GROUP_LABELS[group]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.primaryMuscle && (
          <p className="text-destructive text-xs">{errors.primaryMuscle.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="equipment">Equipment (optional)</Label>
        <Input id="equipment" placeholder="e.g. Dumbbell" {...register("equipment")} />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Add exercise
      </Button>
    </form>
  );
}
