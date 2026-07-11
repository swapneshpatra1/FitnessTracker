"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LogWeightForm } from "@/components/forms/LogWeightForm";
import { DeltaBadge } from "@/components/dashboard/DeltaBadge";
import type { BodyweightSummary } from "@/lib/calculations/bodyweight";

export function BodyweightCard({
  summary,
  unit,
}: {
  summary: BodyweightSummary;
  unit: "KG" | "LB";
}) {
  const [open, setOpen] = useState(false);
  const unitLabel = unit.toLowerCase();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-muted-foreground text-sm font-medium">Bodyweight</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button type="button" variant="link" size="sm" className="h-auto p-0" />}>
            + Log weight
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log today&apos;s weight</DialogTitle>
            </DialogHeader>
            <LogWeightForm defaultWeight={summary.current ?? undefined} unit={unit} onLogged={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-1">
        {summary.current !== null ? (
          <>
            <p className="text-3xl font-semibold">
              {summary.current} <span className="text-muted-foreground text-lg font-normal">{unitLabel}</span>
            </p>
            <p className="text-muted-foreground text-xs">
              7-day avg: {summary.sevenDayAverage ?? "—"} {unitLabel}
            </p>
            {summary.thirtyDayChange !== null && summary.trend && (
              <DeltaBadge
                direction={summary.trend}
                better="down"
                label={`${summary.thirtyDayChange > 0 ? "+" : ""}${summary.thirtyDayChange}${unitLabel} (30d)`}
              />
            )}
          </>
        ) : (
          <p className="text-muted-foreground text-sm">No weight logged yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
