import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-display text-lg font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      NEO<span className="text-gradient">AIWEBY</span>
    </Link>
  );
}
