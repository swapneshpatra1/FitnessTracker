import { TrendingDownIcon, TrendingUpIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "flat";

/** better="up" means an increase is good (e.g. strength); better="down" means a
 * decrease is good (e.g. weight loss toward a lower target). Color always ships
 * with an icon + text, never alone. */
export function DeltaBadge({
  direction,
  label,
  better = "up",
  className,
}: {
  direction: Direction;
  label: string;
  better?: "up" | "down";
  className?: string;
}) {
  const isGood = direction === "flat" ? true : better === direction;
  const Icon = direction === "up" ? TrendingUpIcon : direction === "down" ? TrendingDownIcon : MinusIcon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium",
        direction === "flat"
          ? "text-muted-foreground"
          : isGood
            ? "text-status-good"
            : "text-status-critical",
        className
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
