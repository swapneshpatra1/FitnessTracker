"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type HistorySession = {
  id: string;
  date: string;
  name: string | null;
  notes: string | null;
  exercises: {
    id: string;
    exercise: { name: string };
    sets: { setNumber: number; reps: number; weight: number; unit: string; isWarmup: boolean }[];
  }[];
};

export function HistoryList({ sessions }: { sessions: HistorySession[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this workout session? This cannot be undone.")) return;

    let response: Response;
    try {
      response = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    } catch (error) {
      console.error("Network error while deleting session", error);
      toast.error("Couldn't reach the server — check your connection and try again.");
      return;
    }
    if (!response.ok) {
      toast.error("Could not delete session.");
      return;
    }
    toast.success("Session deleted");
    router.refresh();
  }

  if (sessions.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No workouts logged yet. <Link href="/log" className="underline">Log your first one</Link>.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const isExpanded = expandedId === session.id;
        const dateLabel = new Date(session.date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        });

        return (
          <Card key={session.id}>
            <CardHeader
              className="flex cursor-pointer flex-row items-center justify-between"
              onClick={() => setExpandedId(isExpanded ? null : session.id)}
            >
              <div>
                <CardTitle className="text-base">{session.name || dateLabel}</CardTitle>
                <p className="text-muted-foreground text-xs">{dateLabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{session.exercises.length} exercises</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  onClick={(event) => event.stopPropagation()}
                  render={<Link href={`/log/${session.id}`} />}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(session.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            {isExpanded && (
              <CardContent className="space-y-3">
                {session.exercises.map((we) => (
                  <div key={we.id} className="space-y-1">
                    <p className="text-sm font-medium">{we.exercise.name}</p>
                    <ul className="text-muted-foreground space-y-0.5 text-sm">
                      {we.sets.map((set) => (
                        <li key={set.setNumber}>
                          Set {set.setNumber}: {set.weight}
                          {set.unit.toLowerCase()} × {set.reps} reps
                          {set.isWarmup ? " (warmup)" : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {session.notes && <p className="text-sm italic">{session.notes}</p>}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
