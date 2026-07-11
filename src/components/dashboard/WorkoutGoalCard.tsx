import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function WorkoutGoalCard({ completed, goal }: { completed: number; goal: number }) {
  const percent = goal > 0 ? Math.min(100, Math.round((completed / goal) * 100)) : 0;
  const metGoal = completed >= goal;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm font-medium">This week&apos;s goal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-3xl font-semibold">
          {completed} <span className="text-muted-foreground text-lg font-normal">/ {goal} workouts</span>
        </p>
        <Progress value={percent} className={metGoal ? "[&_[data-slot=progress-indicator]]:bg-status-good" : undefined} />
      </CardContent>
    </Card>
  );
}
