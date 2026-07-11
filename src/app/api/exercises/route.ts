import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { exerciseSchema } from "@/lib/validations/exercise";
import type { MuscleGroup } from "@/generated/prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(exercises);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = exerciseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.exercise.findUnique({ where: { name: parsed.data.name } });
  if (existing) {
    return NextResponse.json({ error: "An exercise with this name already exists." }, { status: 409 });
  }

  const exercise = await prisma.exercise.create({
    data: {
      ...parsed.data,
      primaryMuscle: parsed.data.primaryMuscle as MuscleGroup,
      secondaryMuscles: parsed.data.secondaryMuscles as MuscleGroup[],
      isCustom: true,
      createdById: session.user.id,
    },
  });

  return NextResponse.json(exercise, { status: 201 });
}
