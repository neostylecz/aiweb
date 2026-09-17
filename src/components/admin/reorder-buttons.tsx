"use client";

import { useTransition } from "react";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";

export function ReorderButtons({
  onMoveUp,
  onMoveDown,
  disableUp,
  disableDown,
}: {
  onMoveUp: () => Promise<void>;
  onMoveDown: () => Promise<void>;
  disableUp?: boolean;
  disableDown?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col">
      <button
        type="button"
        disabled={disableUp || isPending}
        onClick={() => startTransition(onMoveUp)}
        aria-label="Move up"
        className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronUp className="size-3.5" />
      </button>
      <button
        type="button"
        disabled={disableDown || isPending}
        onClick={() => startTransition(onMoveDown)}
        aria-label="Move down"
        className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
      >
        {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <ChevronDown className="size-3.5" />}
      </button>
    </div>
  );
}
