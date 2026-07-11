"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsistencyCalendar } from "@/components/charts/ConsistencyCalendar";

const RANGES = {
  "13w": { label: "13 weeks", weeks: 13 },
  "6m": { label: "6 months", weeks: 26 },
  "1y": { label: "1 year", weeks: 52 },
} as const;

type RangeKey = keyof typeof RANGES;

export function ConsistencyCalendarCard({ workoutDates }: { workoutDates: Date[] }) {
  const [range, setRange] = useState<RangeKey>("13w");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-sm font-medium">Consistency</CardTitle>
        <Tabs value={range} onValueChange={(value) => setRange(value as RangeKey)}>
          <TabsList>
            {Object.entries(RANGES).map(([key, { label }]) => (
              <TabsTrigger key={key} value={key}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {workoutDates.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No workouts logged yet. <Link href="/log" className="underline">Get started</Link>.
          </p>
        ) : (
          <ConsistencyCalendar workoutDates={workoutDates} weeksToShow={RANGES[range].weeks} />
        )}
      </CardContent>
    </Card>
  );
}
