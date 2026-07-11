import type { TrainingBalance } from "@/lib/calculations/trainingBalance";

const SEGMENTS: { key: keyof Pick<TrainingBalance, "pushPercent" | "pullPercent" | "legsPercent">; label: string; color: string }[] = [
  { key: "pushPercent", label: "Push", color: "bg-[var(--chart-1)]" },
  { key: "pullPercent", label: "Pull", color: "bg-[var(--chart-2)]" },
  { key: "legsPercent", label: "Legs", color: "bg-[var(--chart-4)]" },
];

export function TrainingBalanceBar({ balance }: { balance: TrainingBalance }) {
  const total = balance.pushSets + balance.pullSets + balance.legsSets;

  if (total === 0) {
    return <p className="text-muted-foreground text-sm">Log some push, pull, or leg exercises to see your split.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="bg-muted flex h-3 w-full overflow-hidden rounded-full">
        {SEGMENTS.map((segment) => (
          <div
            key={segment.key}
            className={segment.color}
            style={{ width: `${balance[segment.key]}%` }}
            title={`${segment.label}: ${balance[segment.key]}%`}
          />
        ))}
      </div>
      <div className="flex justify-between text-sm">
        {SEGMENTS.map((segment) => (
          <div key={segment.key} className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${segment.color}`} />
            <span className="text-muted-foreground">{segment.label}</span>
            <span className="font-medium">{balance[segment.key]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
