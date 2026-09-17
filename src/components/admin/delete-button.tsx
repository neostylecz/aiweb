"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeleteButton({
  action,
  label = "Delete",
  confirmLabel = "Confirm delete",
  className,
}: {
  action: () => Promise<void>;
  label?: string;
  confirmLabel?: string;
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      timeoutRef.current = setTimeout(() => setConfirming(false), 4000);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    startTransition(async () => {
      await action();
      setConfirming(false);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
        confirming
          ? "bg-red-500 text-white hover:bg-red-600"
          : "text-red-500 hover:bg-red-500/10",
        className,
      )}
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
      {confirming ? confirmLabel : label}
    </button>
  );
}
