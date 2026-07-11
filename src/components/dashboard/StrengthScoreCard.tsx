import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeltaBadge } from "@/components/dashboard/DeltaBadge";

export function StrengthScoreCard({ score, deltaThisMonth }: { score: number; deltaThisMonth: number }) {
  const direction = deltaThisMonth > 0 ? "up" : deltaThisMonth < 0 ? "down" : "flat";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm font-medium">Strength score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {score > 0 ? (
          <>
            <p className="text-3xl font-semibold">{score}</p>
            <DeltaBadge
              direction={direction}
              better="up"
              label={`${deltaThisMonth > 0 ? "+" : ""}${deltaThisMonth} this month`}
            />
          </>
        ) : (
          <p className="text-muted-foreground text-sm">
            Log a squat, bench, deadlift, or overhead press to unlock this.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
