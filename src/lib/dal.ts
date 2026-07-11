import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

export async function requireProfile() {
  const userId = await requireUserId();
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    redirect("/onboarding");
  }
  return { userId, profile };
}
