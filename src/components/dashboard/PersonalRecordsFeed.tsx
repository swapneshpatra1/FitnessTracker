import { TrophyIcon } from "lucide-react";
import type { PersonalRecord } from "@/lib/calculations/personalRecords";

function describeRecord(record: PersonalRecord, unitLabel: string): string {
  if (record.type === "maxWeight") {
    const isRoundMilestone = record.weight % 25 === 0 || record.weight % 20 === 0;
    if (isRoundMilestone) {
      return `${record.exerciseName} — first ${record.weight}${unitLabel} lift (${record.weight}${unitLabel} × ${record.reps})`;
    }
    return `${record.exerciseName} — new heaviest weight: ${record.weight}${unitLabel} × ${record.reps}`;
  }
  return `${record.exerciseName} — new estimated 1RM: ${record.value}${unitLabel} (${record.weight}${unitLabel} × ${record.reps})`;
}

export function PersonalRecordsFeed({ records, unitLabel }: { records: PersonalRecord[]; unitLabel: string }) {
  if (records.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No new records yet — keep logging and they&apos;ll show up here.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {records.map((record, index) => (
        <li key={`${record.exerciseId}-${record.type}-${index}`} className="flex items-start gap-2.5 text-sm">
          <TrophyIcon className="text-status-warning mt-0.5 size-4 shrink-0" />
          <div>
            <p>{describeRecord(record, unitLabel)}</p>
            <p className="text-muted-foreground text-xs">
              {record.date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
