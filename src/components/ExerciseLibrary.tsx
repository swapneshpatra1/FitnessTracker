"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddExerciseForm } from "@/components/forms/AddExerciseForm";
import { MUSCLE_GROUP_LABELS } from "@/lib/constants/muscleGroups";
import type { MuscleGroup } from "@/generated/prisma/client";

export type ExerciseListItem = {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  equipment: string | null;
  isCustom: boolean;
};

export function ExerciseLibrary({ exercises }: { exercises: ExerciseListItem[] }) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return exercises;
    return exercises.filter(
      (exercise) =>
        exercise.name.toLowerCase().includes(query) ||
        MUSCLE_GROUP_LABELS[exercise.primaryMuscle].toLowerCase().includes(query)
    );
  }, [exercises, search]);

  const grouped = useMemo(() => {
    const groups = new Map<MuscleGroup, ExerciseListItem[]>();
    for (const exercise of filtered) {
      const list = groups.get(exercise.primaryMuscle) ?? [];
      list.push(exercise);
      groups.set(exercise.primaryMuscle, list);
    }
    return [...groups.entries()].sort((a, b) =>
      MUSCLE_GROUP_LABELS[a[0]].localeCompare(MUSCLE_GROUP_LABELS[b[0]])
    );
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search exercises or muscle groups..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger render={<Button className="shrink-0" />}>
            Add custom exercise
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a custom exercise</DialogTitle>
            </DialogHeader>
            <AddExerciseForm onCreated={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {grouped.length === 0 && (
        <p className="text-muted-foreground text-sm">No exercises match your search.</p>
      )}

      {grouped.map(([muscle, items]) => (
        <div key={muscle} className="space-y-2">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {MUSCLE_GROUP_LABELS[muscle]}
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((exercise) => (
              <Link
                key={exercise.id}
                href={`/exercises/${exercise.id}`}
                className="hover:bg-accent flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors"
              >
                <span>{exercise.name}</span>
                <div className="flex items-center gap-1">
                  {exercise.isCustom && (
                    <Badge variant="secondary" className="text-xs">
                      Custom
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
