import { requireUserId } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { HistoryList } from "@/components/HistoryList";

export default async function HistoryPage() {
  const userId = await requireUserId();

  const sessions = await prisma.workoutSession.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: {
      exercises: {
        orderBy: { order: "asc" },
        include: { exercise: { select: { name: true } }, sets: { orderBy: { setNumber: "asc" } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">History</h1>
        <p className="text-muted-foreground text-sm">Your past workout sessions.</p>
      </div>
      <HistoryList sessions={JSON.parse(JSON.stringify(sessions))} />
    </div>
  );
}
