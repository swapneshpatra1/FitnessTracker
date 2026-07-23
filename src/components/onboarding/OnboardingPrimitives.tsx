"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function OnboardingButton({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-12 items-center justify-center gap-2.5 rounded-lg text-[15px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-40",
        variant === "primary" &&
          "border border-[#9184d9] text-[#9184d9] hover:bg-[#9184d9]/12 active:bg-[#9184d9]/22",
        variant === "ghost" &&
          "border border-[#e9e9ed]/16 text-[15px] font-medium text-[#e9e9ed] hover:bg-[#e9e9ed]/6",
        className
      )}
      {...props}
    />
  );
}

export function OnboardingLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-xs text-[#e9e9ed]/70">{children}</label>;
}

export function OnboardingInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "box-border h-11 w-full rounded-lg border border-[#e9e9ed]/16 bg-[#232532] px-3 text-sm text-[#e9e9ed] outline-none [font-family:inherit] placeholder:text-[#e9e9ed]/35 focus:border-[#9184d9]",
        className
      )}
      {...props}
    />
  );
}
