import { toDateKey } from "@/lib/calculations/streak";

export function ConsistencyCalendar({
  workoutDates,
  weeksToShow = 13,
  today = new Date(),
}: {
  workoutDates: Date[];
  weeksToShow?: number;
  today?: Date;
}) {
  const dateKeys = new Set(workoutDates.map(toDateKey));

  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const daysSinceSunday = end.getUTCDay();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - daysSinceSunday - (weeksToShow - 1) * 7);

  const days: Date[] = [];
  for (let i = 0; i < weeksToShow * 7; i++) {
    const day = new Date(start);
    day.setUTCDate(start.getUTCDate() + i);
    days.push(day);
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div
        className="grid grid-flow-col gap-1"
        style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
      >
        {days.map((day) => {
          const key = toDateKey(day);
          const isFuture = day > end;
          const hasWorkout = dateKeys.has(key);

          return (
            <div
              key={key}
              title={`${day.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}${
                hasWorkout ? " — workout logged" : ""
              }`}
              className={`h-3 w-3 shrink-0 rounded-sm ${
                isFuture
                  ? "bg-transparent"
                  : hasWorkout
                    ? "bg-primary"
                    : "bg-muted"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
