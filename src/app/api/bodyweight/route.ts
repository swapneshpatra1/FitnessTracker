import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bodyweightEntrySchema } from "@/lib/validations/bodyweight";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days") ?? "90");
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);

  const entries = await prisma.bodyweightEntry.findMany({
    where: { userId: session.user.id, date: { gte: since } },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(entries);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = bodyweightEntrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const entry = await prisma.bodyweightEntry.upsert({
    where: { userId_date: { userId: session.user.id, date: parsed.data.date } },
    update: { weight: parsed.data.weight, unit: parsed.data.unit },
    create: { userId: session.user.id, date: parsed.data.date, weight: parsed.data.weight, unit: parsed.data.unit },
  });

  return NextResponse.json(entry, { status: 201 });
}
