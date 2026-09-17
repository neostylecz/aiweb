import { cn } from "@/lib/utils";

export function StatusPill({ status }: { status: "draft" | "published" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        status === "published"
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "published" ? "bg-emerald-500" : "bg-amber-500",
        )}
      />
      {status === "published" ? "Published" : "Draft"}
    </span>
  );
}
