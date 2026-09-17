"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { moveSectionOrder } from "@/app/actions/sections";
import { ExistingSectionEditor, NewSectionForm } from "./section-editor";
import type { PageSectionRow } from "@/lib/queries/pages";

export function SectionsManager({
  pageId,
  sections,
}: {
  pageId: string;
  sections: PageSectionRow[];
}) {
  const [adding, setAdding] = useState(false);
  const sorted = [...sections].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-3">
      {sorted.map((section, index) => (
        <ExistingSectionEditor
          key={section.id}
          section={section}
          pageId={pageId}
          isFirst={index === 0}
          isLast={index === sorted.length - 1}
          onMoveUp={() => moveSectionOrder(pageId, section.id, "up")}
          onMoveDown={() => moveSectionOrder(pageId, section.id, "down")}
        />
      ))}

      {adding ? (
        <div>
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" /> Cancel
            </button>
          </div>
          <NewSectionForm pageId={pageId} onDone={() => setAdding(false)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:border-accent hover:text-accent"
        >
          <Plus className="size-4" /> Add section
        </button>
      )}
    </div>
  );
}
