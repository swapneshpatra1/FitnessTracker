import Link from "next/link";
import { requireUserId } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { workoutStreaks, workoutCountThisWeek } from "@/lib/calculations/streak";
import { computeStrengthScore } from "@/lib/calculations/strengthScore";
import { hardSetsByMuscle } from "@/lib/calculations/hardSets";
import { computeTrainingBalance } from "@/lib/calculations/trainingBalance";
import { detectPersonalRecords } from "@/lib/calculations/personalRecords";
import { summarizeBodyweight, weeklyBodyweightSeries } from "@/lib/calculations/bodyweight";
import { summarizeExerciseProgress } from "@/lib/calculations/exerciseProgress";
import { ConsistencyCalendarCard } from "@/components/ConsistencyCalendarCard";
import { BodyweightTrendChart } from "@/components/charts/BodyweightTrendChart";
import { WorkoutGoalCard } from "@/components/dashboard/WorkoutGoalCard";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { StrengthScoreCard } from "@/components/dashboard/StrengthScoreCard";
import { BodyweightCard } from "@/components/dashboard/BodyweightCard";
import { HardSetsGrid } from "@/components/dashboard/HardSetsGrid";
import { PersonalRecordsFeed } from "@/components/dashboard/PersonalRecordsFeed";
import { TrainingBalanceBar } from "@/components/dashboard/TrainingBalanceBar";
import { ExerciseProgressList } from "@/components/ExerciseProgressList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const userId = await requireUserId();

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setUTCDate(ninetyDaysAgo.getUTCDate() - 90);

  const [sessions, profile, workingSets, bodyweightEntries] = await Promise.all([
    prisma.workoutSession.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: "desc" },
    }),
    prisma.profile.findUnique({
      where: { userId },
      select: { preferredUnit: true, weeklyWorkoutGoal: true, targetWeightKg: true },
    }),
    prisma.setEntry.findMany({
      where: { isWarmup: false, workoutExercise: { session: { userId } } },
      select: {
        weight: true,
        reps: true,
        workoutExercise: {
          select: {
            exercise: { select: { id: true, name: true, primaryMuscle: true } },
            session: { select: { date: true } },
          },
        },
      },
    }),
    prisma.bodyweightEntry.findMany({
      where: { userId, date: { gte: ninetyDaysAgo } },
      orderBy: { date: "asc" },
      select: { date: true, weight: true },
    }),
  ]);

  const dates = sessions.map((s) => s.date);
  const { current: currentStreak, longest: longestStreak } = workoutStreaks(dates);
  const workoutsThisWeek = workoutCountThisWeek(dates);
  const weeklyGoal = profile?.weeklyWorkoutGoal ?? 4;
  const unit = profile?.preferredUnit ?? "KG";
  const unitLabel = unit.toLowerCase();

  const muscleEntries = workingSets.map((s) => ({ muscle: s.workoutExercise.exercise.primaryMuscle }));
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
  const last7DaySets = workingSets.filter((s) => s.workoutExercise.session.date >= sevenDaysAgo);
  const hardSets = hardSetsByMuscle(last7DaySets.map((s) => ({ muscle: s.workoutExercise.exercise.primaryMuscle })));

  const twentyEightDaysAgo = new Date();
  twentyEightDaysAgo.setUTCDate(twentyEightDaysAgo.getUTCDate() - 28);
  const last28DaySets = workingSets.filter((s) => s.workoutExercise.session.date >= twentyEightDaysAgo);
  const trainingBalance = computeTrainingBalance(
    last28DaySets.map((s) => ({ muscle: s.workoutExercise.exercise.primaryMuscle }))
  );

  const strengthScoreEntries = workingSets.map((s) => ({
    exerciseName: s.workoutExercise.exercise.name,
    date: s.workoutExercise.session.date,
    weight: s.weight,
    reps: s.reps,
  }));
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
  const strengthScore = computeStrengthScore(strengthScoreEntries, today);
  const strengthScoreLastMonth = computeStrengthScore(strengthScoreEntries, thirtyDaysAgo);

  const exerciseProgress = summarizeExerciseProgress(
    workingSets.map((s) => ({
      exerciseId: s.workoutExercise.exercise.id,
      exerciseName: s.workoutExercise.exercise.name,
      date: s.workoutExercise.session.date,
      weight: s.weight,
      reps: s.reps,
    }))
  ).slice(0, 8);

  const allPersonalRecords = detectPersonalRecords(
    workingSets.map((s) => ({
      exerciseId: s.workoutExercise.exercise.id,
      exerciseName: s.workoutExercise.exercise.name,
      date: s.workoutExercise.session.date,
      weight: s.weight,
      reps: s.reps,
    }))
  ).filter((r) => r.previousValue !== null);

  // A single set can trigger both an e1RM PR and a max-weight PR at once — collapse
  // those into one feed entry (preferring the e1RM description, which already
  // includes the weight x reps) so the feed doesn't show the same set twice.
  const seenExerciseDate = new Set<string>();
  const personalRecords = allPersonalRecords
    .filter((r) => {
      const key = `${r.exerciseId}-${r.date.getTime()}`;
      if (seenExerciseDate.has(key)) return false;
      seenExerciseDate.add(key);
      return true;
    })
    .slice(0, 6);

  const bodyweightSummary = summarizeBodyweight(bodyweightEntries);
  const bodyweightSeries = weeklyBodyweightSeries(bodyweightEntries, dates, 12);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button nativeButton={false} render={<Link href="/log" />}>
          Log workout
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <WorkoutGoalCard completed={workoutsThisWeek} goal={weeklyGoal} />
        <StreakCard current={currentStreak} longest={longestStreak} />
        <BodyweightCard summary={bodyweightSummary} unit={unit} />
        <StrengthScoreCard score={strengthScore} deltaThisMonth={strengthScore - strengthScoreLastMonth} />
      </div>

      <ConsistencyCalendarCard workoutDates={dates} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Bodyweight trend (last 12 weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <BodyweightTrendChart data={bodyweightSeries} unitLabel={unitLabel} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Weekly hard sets per muscle</CardTitle>
          </CardHeader>
          <CardContent>
            {muscleEntries.length > 0 ? (
              <HardSetsGrid data={hardSets} />
            ) : (
              <p className="text-muted-foreground text-sm">Log a workout to see your hard sets per muscle.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Training balance (last 4 weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrainingBalanceBar balance={trainingBalance} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Recent personal records</CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalRecordsFeed records={personalRecords} unitLabel={unitLabel} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Exercise progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ExerciseProgressList items={exerciseProgress} unitLabel={unitLabel} />
        </CardContent>
      </Card>
    </div>
  );
}
