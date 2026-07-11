import { requireProfile } from "@/lib/dal";
import { ProfileForm } from "@/components/forms/ProfileForm";

export default async function ProfilePage() {
  const { profile } = await requireProfile();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground text-sm">Update your details anytime.</p>
      </div>
      <ProfileForm
        mode="edit"
        defaultValues={{
          age: profile.age ?? undefined,
          gender: profile.gender ?? undefined,
          heightCm: profile.heightCm ?? undefined,
          weightKg: profile.weightKg ?? undefined,
          goal: profile.goal ?? undefined,
          preferredUnit: profile.preferredUnit,
          weeklyWorkoutGoal: profile.weeklyWorkoutGoal,
          targetWeightKg: profile.targetWeightKg ?? undefined,
        }}
      />
    </div>
  );
}
