import { prisma } from "@/lib/prisma";
import { WorkoutLogForm } from "@/components/forms/WorkoutLogForm";

export default async function LogWorkoutPage() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Log a workout</h1>
        <p className="text-muted-foreground text-sm">Add the exercises and sets from today&apos;s session.</p>
      </div>
      <WorkoutLogForm exerciseOptions={exercises} />
    </div>
  );
}
