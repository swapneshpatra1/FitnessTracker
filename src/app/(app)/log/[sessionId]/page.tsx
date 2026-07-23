import { notFound } from "next/navigation";
import { requireUserId } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { WorkoutLogForm } from "@/components/forms/WorkoutLogForm";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const userId = await requireUserId();

  const [session, exercises] = await Promise.all([
    prisma.workoutSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        exercises: { orderBy: { order: "asc" }, include: { sets: { orderBy: { setNumber: "asc" } } } },
      },
    }),
    prisma.exercise.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, imageUrl: true, primaryMuscle: true, isCustom: true },
    }),
  ]);

  if (!session) {
    notFound();
  }

  const defaultValues = {
    date: session.date,
    name: session.name ?? undefined,
    notes: session.notes ?? undefined,
    exercises: session.exercises.map((we) => ({
      exerciseId: we.exerciseId,
      order: we.order,
      notes: we.notes ?? undefined,
      sets: we.sets.map((set) => ({
        setNumber: set.setNumber,
        reps: set.reps,
        weight: set.weight,
        unit: set.unit,
        rpe: set.rpe ?? undefined,
        isWarmup: set.isWarmup,
        notes: set.notes ?? undefined,
      })),
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit workout</h1>
      </div>
      <WorkoutLogForm exerciseOptions={exercises} defaultValues={defaultValues} sessionId={session.id} />
    </div>
  );
}
