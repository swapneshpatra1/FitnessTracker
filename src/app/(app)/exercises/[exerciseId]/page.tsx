import { notFound } from "next/navigation";
import { requireUserId } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { estimateOneRepMax, totalVolume } from "@/lib/calculations/oneRepMax";
import { MUSCLE_GROUP_LABELS } from "@/lib/constants/muscleGroups";
import { ExerciseProgressChart, type ProgressPoint } from "@/components/charts/ExerciseProgressChart";

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ exerciseId: string }>;
}) {
  const { exerciseId } = await params;
  const userId = await requireUserId();

  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) {
    notFound();
  }

  const workoutExercises = await prisma.workoutExercise.findMany({
    where: { exerciseId, session: { userId } },
    include: { session: { select: { date: true } }, sets: true },
    orderBy: { session: { date: "asc" } },
  });

  const data: ProgressPoint[] = workoutExercises
    .filter((we) => we.sets.length > 0)
    .map((we) => {
      const workingSets = we.sets.filter((set) => !set.isWarmup);
      const sets = workingSets.length > 0 ? workingSets : we.sets;
      const best = sets.reduce((max, set) => Math.max(max, estimateOneRepMax(set.weight, set.reps)), 0);
      return {
        date: we.session.date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
        estOneRepMax: Math.round(best * 10) / 10,
        volume: Math.round(totalVolume(sets)),
      };
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{exercise.name}</h1>
        <p className="text-muted-foreground text-sm">
          {MUSCLE_GROUP_LABELS[exercise.primaryMuscle]}
          {exercise.equipment ? ` · ${exercise.equipment}` : ""}
        </p>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No sets logged for this exercise yet. Log a workout with this exercise to see progress.
        </p>
      ) : (
        <ExerciseProgressChart data={data} />
      )}
    </div>
  );
}
