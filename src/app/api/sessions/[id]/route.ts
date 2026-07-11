import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { workoutSessionSchema } from "@/lib/validations/workout";

async function getOwnedSession(sessionId: string, userId: string) {
  return prisma.workoutSession.findFirst({ where: { id: sessionId, userId } });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const workoutSession = await prisma.workoutSession.findFirst({
    where: { id, userId: session.user.id },
    include: { exercises: { include: { exercise: true, sets: true }, orderBy: { order: "asc" } } },
  });

  if (!workoutSession) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(workoutSession);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const owned = await getOwnedSession(id, session.user.id);
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = workoutSessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { date, name, notes, exercises } = parsed.data;

  const updated = await prisma.$transaction(async (tx) => {
    await tx.workoutExercise.deleteMany({ where: { sessionId: id } });
    return tx.workoutSession.update({
      where: { id },
      data: {
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
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const owned = await getOwnedSession(id, session.user.id);
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.workoutSession.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
