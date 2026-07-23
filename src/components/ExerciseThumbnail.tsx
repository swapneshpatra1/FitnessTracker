import Image from "next/image";
import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExerciseThumbnail({
  imageUrl,
  name,
  size = 40,
  className,
}: {
  imageUrl: string | null | undefined;
  name: string;
  size?: number;
  className?: string;
}) {
  if (!imageUrl) {
    return (
      <div
        className={cn("bg-muted text-muted-foreground flex shrink-0 items-center justify-center rounded-md", className)}
        style={{ width: size, height: size }}
      >
        <Dumbbell className="size-1/2" />
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={name}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-md object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}
