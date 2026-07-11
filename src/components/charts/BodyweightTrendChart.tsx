"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { WeeklyBodyweightPoint } from "@/lib/calculations/bodyweight";

export function BodyweightTrendChart({ data, unitLabel }: { data: WeeklyBodyweightPoint[]; unitLabel: string }) {
  const hasWeightData = data.some((d) => d.averageWeight !== null);

  return (
    <div className="space-y-4">
      <div>
        {hasWeightData ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
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
        <ResponsiveContainer width="100%" height={60}>
          <BarChart data={data} margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
            <XAxis dataKey="weekLabel" hide />
            <YAxis hide domain={[0, "dataMax + 1"]} />
            <Tooltip />
            <Bar dataKey="workoutCount" fill="var(--chart-2)" radius={[2, 2, 0, 0]} name="Workouts" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
