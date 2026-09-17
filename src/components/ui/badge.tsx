import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5",
        className,
      )}
      {...props}
    />
  );
}
