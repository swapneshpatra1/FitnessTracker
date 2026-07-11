"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { bodyweightEntrySchema, type BodyweightEntryInput, type BodyweightEntryOutput } from "@/lib/validations/bodyweight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function todayDateInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function LogWeightForm({
  defaultWeight,
  unit,
  onLogged,
}: {
  defaultWeight?: number;
  unit: "KG" | "LB";
  onLogged?: () => void;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<BodyweightEntryInput, unknown, BodyweightEntryOutput>({
    resolver: zodResolver(bodyweightEntrySchema),
    defaultValues: { date: new Date(todayDateInputValue()), weight: defaultWeight, unit },
  });

  async function onSubmit(values: BodyweightEntryOutput) {
    const response = await fetch("/api/bodyweight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      toast.error("Could not save weight entry.");
      return;
    }

    toast.success("Weight logged");
    router.refresh();
    onLogged?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="weight-date">Date</Label>
          <Input
            id="weight-date"
            type="date"
            defaultValue={todayDateInputValue()}
            onChange={(event) => setValue("date", new Date(event.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weight-value">Weight ({unit.toLowerCase()})</Label>
          <Input
            id="weight-value"
            type="number"
            step="0.1"
            autoFocus
            onFocus={(event) => event.currentTarget.select()}
            {...register("weight", { valueAsNumber: true })}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Save weight
      </Button>
    </form>
  );
}
