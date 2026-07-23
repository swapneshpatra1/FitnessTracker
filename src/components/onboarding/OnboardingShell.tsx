"use client";

export function OnboardingShell({
  onBack,
  progressLabel,
  progressStep,
  children,
}: {
  onBack?: () => void;
  progressLabel?: string;
  progressStep?: number; // 1-3, omit for no progress bar
  children: React.ReactNode;
}) {
  const showTopBar = Boolean(onBack) || progressStep !== undefined;

  return (
    <div className="flex min-h-svh justify-center bg-[#161826] text-[#e9e9ed]">
      <div className="flex w-full max-w-md flex-col">
        {showTopBar && (
          <div className="flex flex-none flex-col gap-3 px-5 pt-5 pb-2">
            <div className="flex items-center justify-between">
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="Back"
                  className="flex size-9 items-center justify-center rounded-lg border border-[#e9e9ed]/16 transition-colors hover:bg-[#e9e9ed]/6"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M11 3.5L5.5 9L11 14.5"
                      stroke="#e9e9ed"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : (
                <div className="size-9" />
              )}
              {progressLabel && <div className="text-xs tracking-wide text-[#e9e9ed]/55">{progressLabel}</div>}
              <div className="size-9" />
            </div>
            {progressStep !== undefined && (
              <div className="flex gap-1.5">
                {[1, 2, 3].map((segment) => (
                  <div key={segment} className="h-[3px] flex-1 overflow-hidden rounded-full bg-[#e9e9ed]/14">
                    <div
                      className="h-full rounded-full bg-[#9184d9] transition-all duration-300"
                      style={{ width: progressStep >= segment ? "100%" : "0%" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
