import { FlameIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StreakCard({ current, longest }: { current: number; longest: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm font-medium">Workout streak</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-xs">Current</p>
            <p className="flex items-center gap-1.5 text-3xl font-semibold">
              {current > 0 && <FlameIcon className="text-status-warning size-6" />}
              {current}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Best</p>
            <p className="text-muted-foreground text-xl font-medium">{longest}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
