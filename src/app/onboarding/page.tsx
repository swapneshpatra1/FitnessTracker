import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default async function OnboardingPage() {
  const userId = await requireUserId();

  const existingProfile = await prisma.profile.findUnique({ where: { userId } });
  if (existingProfile) {
    redirect("/dashboard");
  }

  return <OnboardingWizard />;
}
