"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WeeklyBodyweightPoint } from "@/lib/calculations/bodyweight";

const AXIS_LEFT_WIDTH = 28;
const CHART_RIGHT_MARGIN = 16;

export function BodyweightTrendChart({ data, unitLabel }: { data: WeeklyBodyweightPoint[]; unitLabel: string }) {
  const hasWeightData = data.some((d) => d.averageWeight !== null);

  const monthGroups = useMemo(() => {
    const groups: { monthLabel: string; count: number }[] = [];
    for (const point of data) {
      const last = groups[groups.length - 1];
      if (last && last.monthLabel === point.monthLabel) {
        last.count += 1;
      } else {
        groups.push({ monthLabel: point.monthLabel, count: 1 });
      }
    }
    return groups;
  }, [data]);

  return (
    <div className="space-y-4">
      <div>
        {hasWeightData ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 8, right: CHART_RIGHT_MARGIN, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis dataKey="weekLabel" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                width={44}
                domain={["dataMin - 1", "dataMax + 1"]}
                unit={unitLabel}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="averageWeight"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
                name={`Avg weight (${unitLabel})`}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Log your weight a few times to see a trend here.
          </p>
        )}
      </div>
      <div>
        <p className="text-muted-foreground mb-1 text-xs">Workouts per week</p>
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 8, right: CHART_RIGHT_MARGIN, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis
                dataKey="weekLabel"
                tickFormatter={(_, index) => data[index]?.weekOfMonthLabel ?? ""}
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <YAxis
                width={AXIS_LEFT_WIDTH}
                tick={{ fontSize: 12 }}
                allowDecimals={false}
                domain={[0, "dataMax + 1"]}
              />
              <Tooltip
                labelFormatter={(_, payload) => payload?.[0]?.payload?.weekLabel ?? ""}
                formatter={(value) => [value, "Workouts"]}
              />
              <Bar dataKey="workoutCount" fill="var(--chart-2)" radius={[3, 3, 0, 0]} name="Workouts" />
            </BarChart>
          </ResponsiveContainer>
          {/* Month-boundary separators, overlaid to align with the bars above -- Recharts
              has no clean way to draw a reference line *between* two category bands. */}
          <div
            className="pointer-events-none absolute inset-0 flex"
            style={{ paddingLeft: AXIS_LEFT_WIDTH, paddingRight: CHART_RIGHT_MARGIN, paddingTop: 8, paddingBottom: 28 }}
          >
            {data.map((point, index) => (
              <div
                key={index}
                className={index > 0 && point.weekOfMonthLabel === "W1" ? "border-muted-foreground/40 border-l border-dotted" : ""}
                style={{ flex: "1 1 0%" }}
              />
            ))}
          </div>
        </div>
        <div
          className="text-muted-foreground flex text-xs"
          style={{ paddingLeft: AXIS_LEFT_WIDTH, paddingRight: CHART_RIGHT_MARGIN }}
        >
          {monthGroups.map((group, index) => (
            <span
              key={`${group.monthLabel}-${index}`}
              className="border-border truncate border-t pt-1 text-center"
              style={{ flex: `${group.count} 1 0%` }}
            >
              {group.monthLabel}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
