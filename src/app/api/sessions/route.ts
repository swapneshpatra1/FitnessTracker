import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { workoutSessionSchema } from "@/lib/validations/workout";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await prisma.workoutSession.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    include: {
      exercises: {
        include: { exercise: true, sets: true },
      },
    },
  });

  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = workoutSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { date, name, notes, exercises } = parsed.data;

  const created = await prisma.workoutSession.create({
    data: {
      userId: session.user.id,
      date,
      name,
      notes,
      exercises: {
        create: exercises.map((exercise, index) => ({
          exerciseId: exercise.exerciseId,
          order: exercise.order ?? index,
          notes: exercise.notes,
          sets: {
            create: exercise.sets.map((set, setIndex) => ({
              setNumber: set.setNumber ?? setIndex + 1,
              reps: set.reps,
              weight: set.weight,
              unit: set.unit,
              rpe: set.rpe,
              isWarmup: set.isWarmup,
              notes: set.notes,
            })),
          },
        })),
      },
    },
    include: { exercises: { include: { sets: true } } },
  });

  return NextResponse.json(created, { status: 201 });
}
