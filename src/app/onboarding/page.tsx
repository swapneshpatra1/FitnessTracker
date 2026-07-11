import { redirect } from "next/navigation";
import { requireUserId } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/forms/ProfileForm";

export default async function OnboardingPage() {
  const userId = await requireUserId();

  const existingProfile = await prisma.profile.findUnique({ where: { userId } });
  if (existingProfile) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold">Welcome! Let&apos;s set up your profile</h1>
          <p className="text-muted-foreground text-sm">
            This helps personalize your tracking. You can edit it anytime.
          </p>
        </div>
        <ProfileForm mode="create" />
      </div>
    </div>
  );
}
