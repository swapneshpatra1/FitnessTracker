"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { profileSchema, type ProfileInput, type ProfileOutput } from "@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProfileFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<ProfileInput>;
};

const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  PREFER_NOT_TO_SAY: "Prefer not to say",
};

const GOAL_LABELS: Record<string, string> = {
  STRENGTH: "Strength",
  HYPERTROPHY: "Hypertrophy",
  ENDURANCE: "Endurance",
  WEIGHT_LOSS: "Weight loss",
  GENERAL_FITNESS: "General fitness",
  MAINTENANCE: "Maintenance",
};

const UNIT_LABELS: Record<string, string> = {
  KG: "Kilograms (kg)",
  LB: "Pounds (lb)",
};

export function ProfileForm({ mode, defaultValues }: ProfileFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput, unknown, ProfileOutput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { preferredUnit: "KG", weeklyWorkoutGoal: 4, ...defaultValues },
  });

  const gender = watch("gender");
  const goal = watch("goal");
  const preferredUnit = watch("preferredUnit");

  async function onSubmit(values: ProfileOutput) {
    const response = await fetch("/api/profile", {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    toast.success(mode === "create" ? "Profile created" : "Profile updated");
    router.push(mode === "create" ? "/dashboard" : "/profile");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" {...register("age", { valueAsNumber: true })} />
          {errors.age && <p className="text-destructive text-xs">{errors.age.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gender">Gender</Label>
          <Select
            items={GENDER_LABELS}
            value={gender}
            onValueChange={(value) => setValue("gender", value as ProfileInput["gender"])}
          >
            <SelectTrigger id="gender" className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
              <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="heightCm">Height (cm)</Label>
          <Input id="heightCm" type="number" step="0.1" {...register("heightCm", { valueAsNumber: true })} />
          {errors.heightCm && <p className="text-destructive text-xs">{errors.heightCm.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weightKg">Weight (kg)</Label>
          <Input id="weightKg" type="number" step="0.1" {...register("weightKg", { valueAsNumber: true })} />
          {errors.weightKg && <p className="text-destructive text-xs">{errors.weightKg.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="goal">Primary goal</Label>
          <Select
            items={GOAL_LABELS}
            value={goal}
            onValueChange={(value) => setValue("goal", value as ProfileInput["goal"])}
          >
            <SelectTrigger id="goal" className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STRENGTH">Strength</SelectItem>
              <SelectItem value="HYPERTROPHY">Hypertrophy</SelectItem>
              <SelectItem value="ENDURANCE">Endurance</SelectItem>
              <SelectItem value="WEIGHT_LOSS">Weight loss</SelectItem>
              <SelectItem value="GENERAL_FITNESS">General fitness</SelectItem>
              <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="preferredUnit">Preferred unit</Label>
          <Select
            items={UNIT_LABELS}
            value={preferredUnit}
            onValueChange={(value) => setValue("preferredUnit", value as ProfileInput["preferredUnit"])}
          >
            <SelectTrigger id="preferredUnit" className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KG">Kilograms (kg)</SelectItem>
              <SelectItem value="LB">Pounds (lb)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="weeklyWorkoutGoal">Weekly workout goal</Label>
          <Input
            id="weeklyWorkoutGoal"
            type="number"
            min={1}
            max={14}
            {...register("weeklyWorkoutGoal", { valueAsNumber: true })}
          />
          {errors.weeklyWorkoutGoal && (
            <p className="text-destructive text-xs">{errors.weeklyWorkoutGoal.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="targetWeightKg">Target weight (kg, optional)</Label>
          <Input
            id="targetWeightKg"
            type="number"
            step="0.1"
            {...register("targetWeightKg", { valueAsNumber: true })}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {mode === "create" ? "Save and continue" : "Save changes"}
      </Button>
    </form>
  );
}
