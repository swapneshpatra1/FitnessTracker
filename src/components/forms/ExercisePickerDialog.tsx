"use client";

import { Fragment, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExerciseThumbnail } from "@/components/ExerciseThumbnail";
import { AddExerciseForm } from "@/components/forms/AddExerciseForm";
import { MUSCLE_GROUP_LABELS } from "@/lib/constants/muscleGroups";
import type { MuscleGroup } from "@/generated/prisma/client";

export type PickerExercise = {
  id: string;
  name: string;
  imageUrl?: string | null;
  primaryMuscle?: MuscleGroup | null;
  isCustom?: boolean;
};

function ExerciseRow({ exercise, onSelect }: { exercise: PickerExercise; onSelect: (exercise: PickerExercise) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(exercise)}
      className="hover:bg-accent flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors"
    >
      <ExerciseThumbnail imageUrl={exercise.imageUrl} name={exercise.name} size={40} />
      <span className="flex-1 truncate">{exercise.name}</span>
      {exercise.isCustom && (
        <Badge variant="secondary" className="shrink-0 text-xs">
          Custom
        </Badge>
      )}
    </button>
  );
}

export function ExercisePickerDialog({
  open,
  onOpenChange,
  exercises,
  onSelect,
  onExerciseCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercises: PickerExercise[];
  onSelect: (exercise: PickerExercise) => void;
  onExerciseCreated: (exercise: PickerExercise) => void;
}) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"all" | "muscle">("all");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return exercises;
    return exercises.filter((exercise) => exercise.name.toLowerCase().includes(query));
  }, [exercises, search]);

  const grouped = useMemo(() => {
    const groups = new Map<string, PickerExercise[]>();
    for (const exercise of filtered) {
      const key = exercise.primaryMuscle ?? "OTHER";
      const list = groups.get(key) ?? [];
      list.push(exercise);
      groups.set(key, list);
    }
    return [...groups.entries()].sort((a, b) => {
      const labelA = MUSCLE_GROUP_LABELS[a[0] as MuscleGroup] ?? a[0];
      const labelB = MUSCLE_GROUP_LABELS[b[0] as MuscleGroup] ?? b[0];
      return labelA.localeCompare(labelB);
    });
  }, [filtered]);

  function handleSelect(exercise: PickerExercise) {
    onSelect(exercise);
    setSearch("");
    onOpenChange(false);
  }

  function handleCreated(exercise: { id: string; name: string }) {
    setCreateOpen(false);
    onExerciseCreated({ id: exercise.id, name: exercise.name, isCustom: true });
    onOpenChange(false);
  }

  return (
    <Fragment>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          onOpenChange(next);
          if (!next) setSearch("");
        }}
      >
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 top-0 left-0 z-50 grid h-dvh w-screen max-w-none translate-x-0 translate-y-0 grid-rows-[auto_auto_1fr] gap-0 rounded-none p-0"
      >
        <div className="flex items-center justify-between border-b px-3 py-2.5">
          <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <DialogTitle>Add Exercise</DialogTitle>
          <Button type="button" variant="ghost" size="sm" onClick={() => setCreateOpen(true)}>
            Create
          </Button>
        </div>

        <div className="space-y-3 border-b p-3">
          <Input
            placeholder="Search exercise"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoFocus
          />
          <Tabs value={view} onValueChange={(value) => setView(value as "all" | "muscle")}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="muscle" className="flex-1">
                Muscle
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="overflow-y-auto p-3">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">No exercises match your search.</p>
          ) : view === "all" ? (
            <div className="space-y-2">
              {filtered.map((exercise) => (
                <ExerciseRow key={exercise.id} exercise={exercise} onSelect={handleSelect} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map(([muscle, items]) => (
                <div key={muscle} className="space-y-2">
                  <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                    {MUSCLE_GROUP_LABELS[muscle as MuscleGroup] ?? muscle}
                  </h3>
                  <div className="space-y-2">
                    {items.map((exercise) => (
                      <ExerciseRow key={exercise.id} exercise={exercise} onSelect={handleSelect} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a custom exercise</DialogTitle>
          </DialogHeader>
          <AddExerciseForm onCreated={handleCreated} />
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
