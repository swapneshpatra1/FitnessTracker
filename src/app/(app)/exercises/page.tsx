import { prisma } from "@/lib/prisma";
import { ExerciseLibrary } from "@/components/ExerciseLibrary";

export default async function ExercisesPage() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, primaryMuscle: true, equipment: true, isCustom: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Exercise Library</h1>
        <p className="text-muted-foreground text-sm">
          Browse the exercise library or add your own.
        </p>
      </div>
      <ExerciseLibrary exercises={exercises} />
    </div>
  );
}
