"use client";

import { useState } from "react";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OnboardingButton } from "@/components/onboarding/OnboardingPrimitives";
import { signInWithGoogleAction } from "@/lib/actions";

export function WelcomeFlow() {
  const [step, setStep] = useState<"welcome" | "signup">("welcome");

  if (step === "signup") {
    return (
      <OnboardingShell onBack={() => setStep("welcome")}>
        <div className="flex flex-col gap-6 px-7 pt-4 pb-8 [animation:onboarding-fade-in_0.4s_ease]">
          <div>
            <h2 className="mb-1.5 text-2xl font-medium tracking-tight">Create your account</h2>
            <p className="text-sm text-[#e9e9ed]/60">Let&apos;s get you set up in under a minute.</p>
          </div>
          <OnboardingButton variant="ghost" onClick={() => signInWithGoogleAction()}>
            <span className="flex size-5 items-center justify-center rounded-full border-[1.4px] border-[#e9e9ed] text-[11px] font-semibold">
              G
            </span>
            Continue with Google
          </OnboardingButton>
          <p className="text-center text-[11.5px] leading-relaxed text-[#e9e9ed]/40">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </OnboardingShell>
    );
  }

  return (
    <OnboardingShell>
      <div className="flex h-full min-h-[600px] flex-col px-7 pb-8 [animation:onboarding-fade-in_0.4s_ease]">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="relative flex size-16 items-center justify-center rounded-2xl border-[1.5px] border-[#9184d9]">
            <div className="size-[22px] rotate-45 rounded-[4px] bg-[#9184d9]" />
          </div>
          <div>
            <h1 className="mb-2.5 text-[30px] leading-[1.15] font-medium tracking-tight">Fitness Tracker</h1>
            <p className="mx-auto max-w-[280px] text-[15px] leading-relaxed text-[#e9e9ed]/65">
              Track workouts, build strength, and see progress that actually sticks.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3.5">
          <OnboardingButton onClick={() => setStep("signup")}>Get started</OnboardingButton>
          <div className="text-center text-[13px] text-[#e9e9ed]/55">
            Already have an account?{" "}
            <button type="button" onClick={() => setStep("signup")} className="text-[#9184d9]">
              Log in
            </button>
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}
