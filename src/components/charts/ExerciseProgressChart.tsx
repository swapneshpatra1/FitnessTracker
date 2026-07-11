"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ProgressPoint = {
  date: string;
  estOneRepMax: number;
  volume: number;
};

export function ExerciseProgressChart({ data }: { data: ProgressPoint[] }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-sm font-medium">Estimated 1-rep max</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={40} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="estOneRepMax"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Est. 1RM"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Volume per session</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={40} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Volume"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
