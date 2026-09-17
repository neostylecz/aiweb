"use client";

import { Plus, Trash2 } from "lucide-react";

export function ArrayField<T>({
  items,
  onChange,
  newItem,
  renderItem,
  addLabel = "Add item",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: T;
  renderItem: (item: T, update: (item: T) => void, index: number) => React.ReactNode;
  addLabel?: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3 rounded-md border border-border p-3">
          <div className="flex-1 space-y-2">
            {renderItem(item, (updated) => {
              const next = [...items];
              next[index] = updated;
              onChange(next);
            }, index)}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="rounded p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
            aria-label="Remove"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, newItem])}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-accent hover:text-accent"
      >
        <Plus className="size-3.5" /> {addLabel}
      </button>
    </div>
  );
}
