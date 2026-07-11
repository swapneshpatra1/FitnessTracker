import { MUSCLE_GROUP_LABELS } from "@/lib/constants/muscleGroups";
import { HARD_SET_TARGET_FLOOR, type MuscleSetCount } from "@/lib/calculations/hardSets";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  good: { bar: "bg-status-good", text: "text-status-good" },
  warning: { bar: "bg-status-warning", text: "text-status-warning" },
  critical: { bar: "bg-status-critical", text: "text-status-critical" },
} as const;

const STATUS_LABEL = {
  good: "On target",
  warning: "Slightly under",
  critical: "Neglected",
} as const;

export function HardSetsGrid({ data }: { data: MuscleSetCount[] }) {
  return (
    <div className="space-y-3">
      {data.map((item) => {
        const style = STATUS_STYLES[item.status];
        const widthPercent = Math.min(100, (item.sets / HARD_SET_TARGET_FLOOR) * 100);

        return (
          <div key={item.muscle} className="space-y-1">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">{MUSCLE_GROUP_LABELS[item.muscle]}</span>
              <span className={cn("text-xs", style.text)}>
                {item.sets} {item.sets === 1 ? "set" : "sets"} · {STATUS_LABEL[item.status]}
              </span>
            </div>
            <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
              <div className={cn("h-full rounded-full transition-all", style.bar)} style={{ width: `${widthPercent}%` }} />
            </div>
          </div>
        );
      })}
      <p className="text-muted-foreground pt-1 text-xs">Target: {HARD_SET_TARGET_FLOOR}+ hard sets/week per muscle.</p>
    </div>
  );
}
