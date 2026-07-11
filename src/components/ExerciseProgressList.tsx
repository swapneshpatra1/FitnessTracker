import Link from "next/link";
import type { ExerciseProgressSummary } from "@/lib/calculations/exerciseProgress";
import { DeltaBadge } from "@/components/dashboard/DeltaBadge";

export function ExerciseProgressList({
  items,
  unitLabel,
}: {
  items: ExerciseProgressSummary[];
  unitLabel: string;
}) {
  if (items.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Log the same exercise across two or more sessions to see improvement trends here.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="text-muted-foreground border-b text-left text-xs">
            <th className="py-2 pr-4 font-medium">Exercise</th>
            <th className="py-2 pr-4 font-medium">Best set</th>
            <th className="py-2 pr-4 font-medium">Est. 1RM</th>
            <th className="py-2 pr-4 font-medium">30-day</th>
            <th className="py-2 pr-4 font-medium">Lifetime PR</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const direction = item.thirtyDayDeltaPercent > 0 ? "up" : item.thirtyDayDeltaPercent < 0 ? "down" : "flat";
            return (
              <tr key={item.exerciseId} className="hover:bg-accent border-b last:border-0">
                <td className="py-2.5 pr-4">
                  <Link href={`/exercises/${item.exerciseId}`} className="font-medium hover:underline">
                    {item.exerciseName}
                  </Link>
                </td>
                <td className="text-muted-foreground py-2.5 pr-4 whitespace-nowrap">
                  {item.bestSetRecent.weight}
                  {unitLabel} × {item.bestSetRecent.reps}
                </td>
                <td className="py-2.5 pr-4 font-medium whitespace-nowrap">
                  {item.currentOneRepMax}
                  {unitLabel}
                </td>
                <td className="py-2.5 pr-4">
                  <DeltaBadge
                    direction={direction}
                    better="up"
                    label={`${item.thirtyDayDeltaPercent > 0 ? "+" : ""}${item.thirtyDayDeltaPercent}%`}
                  />
                </td>
                <td className="text-muted-foreground py-2.5 pr-4 whitespace-nowrap">
                  {item.lifetimePR.weight}
                  {unitLabel} × {item.lifetimePR.reps}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
