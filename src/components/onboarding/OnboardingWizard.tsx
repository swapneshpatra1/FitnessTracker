"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OnboardingButton, OnboardingInput, OnboardingLabel } from "@/components/onboarding/OnboardingPrimitives";
import type { ProfileOutput } from "@/lib/validations/profile";

type Step = "profile1" | "profile2" | "profile3" | "done";
type Unit = "metric" | "imperial";
type Gender = "MALE" | "FEMALE" | "OTHER";
type GoalKey = "LOSE_WEIGHT" | "BUILD_MUSCLE" | "IMPROVE_ENDURANCE" | "GENERAL_FITNESS" | "ATHLETIC_PERFORMANCE" | "OTHER";

const GENDER_OPTIONS: { key: Gender; label: string }[] = [
  { key: "MALE", label: "Male" },
  { key: "FEMALE", label: "Female" },
  { key: "OTHER", label: "Other" },
];

const GOAL_OPTIONS: { key: GoalKey; label: string; desc: string }[] = [
  { key: "LOSE_WEIGHT", label: "Lose weight", desc: "Trim fat, get leaner" },
  { key: "BUILD_MUSCLE", label: "Build muscle", desc: "Add strength and size" },
  { key: "IMPROVE_ENDURANCE", label: "Improve endurance", desc: "Go longer, recover faster" },
  { key: "GENERAL_FITNESS", label: "General fitness", desc: "Stay active and healthy" },
  { key: "ATHLETIC_PERFORMANCE", label: "Athletic performance", desc: "Train for a sport or event" },
  { key: "OTHER", label: "Other", desc: "Something else entirely" },
];

const DAYS = [1, 2, 3, 4, 5, 6, 7];

const CM_PER_INCH = 2.54;
const KG_PER_LB = 0.45359237;

function pillClass(selected: boolean) {
  return cn(
    "flex-1 rounded-lg border px-2 py-2.5 text-center text-[13.5px] font-medium transition-colors",
    selected ? "border-[#9184d9] bg-[#9184d9]/12 text-[#9184d9]" : "border-[#e9e9ed]/16 text-[#e9e9ed]"
  );
}

function cardClass(selected: boolean) {
  return cn(
    "flex flex-col gap-0.5 rounded-[10px] border px-3.5 py-3 text-left transition-colors",
    selected ? "border-[#9184d9] bg-[#9184d9]/10" : "border-[#e9e9ed]/16 bg-[#232532]"
  );
}

function chipClass(selected: boolean) {
  return cn(
    "flex size-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
    selected ? "border-[#9184d9] bg-[#9184d9] text-[#161826]" : "border-[#e9e9ed]/16 text-[#e9e9ed]"
  );
}

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("profile1");
  const [submitting, setSubmitting] = useState(false);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);

  const [unit, setUnit] = useState<Unit>("metric");
  const [heightCm, setHeightCm] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");

  const [goal, setGoal] = useState<GoalKey | null>(null);
  const [days, setDays] = useState<number | null>(null);
  const [targetWeight, setTargetWeight] = useState("");

  const weightUnitLabel = unit === "metric" ? "kg" : "lb";

  const profile1Valid = age.trim() !== "" && gender !== null;
  const profile2Valid =
    weight.trim() !== "" && (unit === "metric" ? heightCm.trim() !== "" : heightFt.trim() !== "" && heightIn.trim() !== "");
  const profile3Valid = goal !== null && days !== null;

  async function handleFinish() {
    const heightCmValue =
      unit === "metric" ? Number(heightCm) : (Number(heightFt) * 12 + Number(heightIn)) * CM_PER_INCH;
    const weightKgValue = unit === "metric" ? Number(weight) : Number(weight) * KG_PER_LB;
    const targetWeightKgValue =
      targetWeight.trim() === "" ? undefined : unit === "metric" ? Number(targetWeight) : Number(targetWeight) * KG_PER_LB;

    const payload: ProfileOutput = {
      age: Number(age),
      gender: gender ?? undefined,
      heightCm: Math.round(heightCmValue * 10) / 10,
      weightKg: Math.round(weightKgValue * 10) / 10,
      goal: goal ?? undefined,
      preferredUnit: unit === "metric" ? "KG" : "LB",
      weeklyWorkoutGoal: days ?? 4,
      targetWeightKg: targetWeightKgValue !== undefined ? Math.round(targetWeightKgValue * 10) / 10 : undefined,
    };

    setSubmitting(true);
    let response: Response;
    try {
      response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Network error while creating profile", error);
      toast.error("Couldn't reach the server — check your connection and try again.");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    if (!response.ok) {
      toast.error("Something went wrong saving your profile. Please try again.");
      return;
    }

    setStep("done");
  }

  const goalLabel = GOAL_OPTIONS.find((g) => g.key === goal)?.label.toLowerCase() ?? "your goal";
  const doneSummary = days ? `${goalLabel}, ${days} day${days > 1 ? "s" : ""} a week.` : `focused on ${goalLabel}.`;

  if (step === "done") {
    return (
      <OnboardingShell>
        <div className="flex h-full min-h-[600px] flex-col px-7 pb-10 [animation:onboarding-fade-in_0.4s_ease]">
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
            <div className="flex size-16 items-center justify-center rounded-full border-[1.5px] border-[#9184d9]">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M6 13.5L11 18.5L20 8" stroke="#9184d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-medium tracking-tight">You&apos;re all set</h2>
              <p className="mx-auto max-w-[260px] text-sm leading-relaxed text-[#e9e9ed]/60">
                Your plan is ready — {doneSummary}
              </p>
            </div>
          </div>
          <OnboardingButton onClick={() => router.push("/dashboard")}>Go to dashboard</OnboardingButton>
        </div>
      </OnboardingShell>
    );
  }

  if (step === "profile2") {
    return (
      <OnboardingShell onBack={() => setStep("profile1")} progressLabel="Step 2 of 3" progressStep={2}>
        <div className="flex flex-col gap-7 px-7 pt-2 pb-8 [animation:onboarding-fade-in_0.4s_ease]">
          <div>
            <h2 className="mb-1.5 text-[22px] font-medium tracking-tight">Your body</h2>
            <p className="text-sm text-[#e9e9ed]/60">Pick the units you&apos;re comfortable with.</p>
          </div>
          <div className="flex overflow-hidden rounded-lg border border-[#e9e9ed]/16">
            <button
              type="button"
              onClick={() => setUnit("metric")}
              className={cn(
                "flex-1 py-2.5 text-center text-[13.5px] font-medium transition-colors",
                unit === "metric" ? "bg-[#9184d9]/12 text-[#9184d9]" : "text-[#e9e9ed]"
              )}
            >
              Metric (cm / kg)
            </button>
            <button
              type="button"
              onClick={() => setUnit("imperial")}
              className={cn(
                "flex-1 border-l border-[#e9e9ed]/16 py-2.5 text-center text-[13.5px] font-medium transition-colors",
                unit === "imperial" ? "bg-[#9184d9]/12 text-[#9184d9]" : "text-[#e9e9ed]"
              )}
            >
              Imperial (ft / lb)
            </button>
          </div>

          {unit === "metric" ? (
            <div>
              <OnboardingLabel>Height (cm)</OnboardingLabel>
              <OnboardingInput
                type="number"
                placeholder="175"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <OnboardingLabel>Height</OnboardingLabel>
              <div className="flex gap-2">
                <OnboardingInput
                  type="number"
                  placeholder="5"
                  className="flex-1"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                />
                <div className="flex w-11 items-center justify-center text-[13px] text-[#e9e9ed]/55">ft</div>
                <OnboardingInput
                  type="number"
                  placeholder="9"
                  className="flex-1"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                />
                <div className="flex w-11 items-center justify-center text-[13px] text-[#e9e9ed]/55">in</div>
              </div>
            </div>
          )}

          <div>
            <OnboardingLabel>Weight ({weightUnitLabel})</OnboardingLabel>
            <OnboardingInput
              type="number"
              placeholder={unit === "metric" ? "70" : "154"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <OnboardingButton disabled={!profile2Valid} onClick={() => setStep("profile3")}>
            Continue
          </OnboardingButton>
        </div>
      </OnboardingShell>
    );
  }

  if (step === "profile3") {
    return (
      <OnboardingShell onBack={() => setStep("profile2")} progressLabel="Step 3 of 3" progressStep={3}>
        <div className="flex flex-col gap-7 px-7 pt-2 pb-10 [animation:onboarding-fade-in_0.4s_ease]">
          <div>
            <h2 className="mb-1.5 text-[22px] font-medium tracking-tight">Set your goals</h2>
            <p className="text-sm text-[#e9e9ed]/60">What are you training for?</p>
          </div>

          <div>
            <OnboardingLabel>Primary goal</OnboardingLabel>
            <div className="flex flex-col gap-2">
              {GOAL_OPTIONS.map((g) => (
                <button key={g.key} type="button" onClick={() => setGoal(g.key)} className={cardClass(goal === g.key)}>
                  <span className="text-sm font-medium">{g.label}</span>
                  <span className="text-xs text-[#e9e9ed]/55">{g.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <OnboardingLabel>Weekly workout goal — days per week</OnboardingLabel>
            <div className="flex justify-between gap-2">
              {DAYS.map((d) => (
                <button key={d} type="button" onClick={() => setDays(d)} className={chipClass(days === d)}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <OnboardingLabel>Target weight ({weightUnitLabel}, optional)</OnboardingLabel>
            <OnboardingInput
              type="number"
              placeholder={unit === "metric" ? "65" : "143"}
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
            />
          </div>

          <OnboardingButton disabled={!profile3Valid || submitting} onClick={handleFinish}>
            {submitting ? "Saving…" : "Finish"}
          </OnboardingButton>
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell progressLabel="Step 1 of 3" progressStep={1}>
      <div className="flex flex-col gap-7 px-7 pt-2 pb-8 [animation:onboarding-fade-in_0.4s_ease]">
        <div>
          <h2 className="mb-1.5 text-[22px] font-medium tracking-tight">A bit about you</h2>
          <p className="text-sm text-[#e9e9ed]/60">This helps us tailor your plan.</p>
        </div>
        <div>
          <OnboardingLabel>Age</OnboardingLabel>
          <OnboardingInput type="number" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div>
          <OnboardingLabel>Gender</OnboardingLabel>
          <div className="flex gap-2">
            {GENDER_OPTIONS.map((g) => (
              <button key={g.key} type="button" onClick={() => setGender(g.key)} className={pillClass(gender === g.key)}>
                {g.label}
              </button>
            ))}
          </div>
        </div>
        <OnboardingButton disabled={!profile1Valid} onClick={() => setStep("profile2")}>
          Continue
        </OnboardingButton>
      </div>
    </OnboardingShell>
  );
}
