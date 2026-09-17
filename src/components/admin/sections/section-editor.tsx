"use client";

import { useActionState, useEffect, useState } from "react";
import { ChevronDown, GripVertical } from "lucide-react";
import { createSection, updateSection, deleteSection } from "@/app/actions/sections";
import { idleState } from "@/lib/actions/types";
import { Select } from "@/components/admin/form-field";
import { SaveButton } from "@/components/admin/save-button";
import { FormStatusBanner } from "@/components/admin/form-status-banner";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";
import { SECTION_TYPE_LABELS } from "@/lib/sections/types";
import type { SectionType } from "@/lib/sections/types";
import { SECTION_DEFAULTS } from "@/lib/sections/defaults";
import { cn } from "@/lib/utils";
import {
  HeroEditor,
  TextEditor,
  ImageTextEditor,
  ServicesEditor,
  PortfolioEditor,
  BenefitsEditor,
  StatsEditor,
  CtaEditor,
  FaqEditor,
  ContactEditor,
} from "./editors";
import type { PageSectionRow } from "@/lib/queries/pages";

function cleanContent(type: SectionType, content: Record<string, unknown>) {
  const clean = { ...content };
  for (const key of ["primaryCta", "secondaryCta", "cta"]) {
    const value = clean[key] as { label?: string; href?: string } | null | undefined;
    if (value && !value.label && !value.href) clean[key] = null;
  }
  return clean;
}

function TypeEditor({
  type,
  content,
  onChange,
}: {
  type: SectionType;
  content: Record<string, unknown>;
  onChange: (c: Record<string, unknown>) => void;
}) {
  // Section content is stored generically as Record<string, unknown> at this
  // level (it round-trips through JSON), while each editor below expects its
  // specific shape - safe because `type` and `content` always come from the
  // same section and NewSectionForm resets `content` whenever `type` changes.
  function cast<T>(): T {
    return content as unknown as T;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeAs = onChange as unknown as (c: any) => void;

  switch (type) {
    case "hero":
      return <HeroEditor content={cast()} onChange={onChangeAs} />;
    case "text":
      return <TextEditor content={cast()} onChange={onChangeAs} />;
    case "image_text":
      return <ImageTextEditor content={cast()} onChange={onChangeAs} />;
    case "services":
      return <ServicesEditor content={cast()} onChange={onChangeAs} />;
    case "portfolio":
      return <PortfolioEditor content={cast()} onChange={onChangeAs} />;
    case "benefits":
      return <BenefitsEditor content={cast()} onChange={onChangeAs} />;
    case "stats":
      return <StatsEditor content={cast()} onChange={onChangeAs} />;
    case "cta":
      return <CtaEditor content={cast()} onChange={onChangeAs} />;
    case "faq":
      return <FaqEditor content={cast()} onChange={onChangeAs} />;
    case "contact":
      return <ContactEditor content={cast()} onChange={onChangeAs} />;
    default:
      return null;
  }
}

export function ExistingSectionEditor({
  section,
  pageId,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: {
  section: PageSectionRow;
  pageId: string;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => Promise<void>;
  onMoveDown: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(section.content as Record<string, unknown>);
  const action = updateSection.bind(null, section.id, pageId, section.type);
  const [state, formAction] = useActionState(action, idleState);

  return (
    <div className="rounded-xl border border-border bg-background">
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical className="size-4 shrink-0 text-muted-foreground" />
        <ReorderButtons disableUp={isFirst} disableDown={isLast} onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center justify-between gap-2 text-left"
        >
          <span className="text-sm font-medium text-foreground">
            {SECTION_TYPE_LABELS[section.type]}
            <span
              className={cn(
                "ml-2 inline-block size-1.5 rounded-full align-middle",
                section.status === "published" ? "bg-emerald-500" : "bg-amber-500",
              )}
            />
          </span>
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>
        <DeleteButton action={deleteSection.bind(null, section.id, pageId)} />
      </div>

      {open ? (
        <form action={formAction} className="space-y-4 border-t border-border p-4">
          <FormStatusBanner status={state.status} message={state.message} />
          <input type="hidden" name="content" value={JSON.stringify(cleanContent(section.type, content))} />

          <TypeEditor type={section.type} content={content} onChange={setContent} />

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="w-40">
              <Select name="status" defaultValue={section.status}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </div>
            <SaveButton>Save section</SaveButton>
          </div>
        </form>
      ) : null}
    </div>
  );
}

export function NewSectionForm({ pageId, onDone }: { pageId: string; onDone: () => void }) {
  const [type, setType] = useState<SectionType>("text");
  const [content, setContent] = useState<Record<string, unknown>>(
    SECTION_DEFAULTS.text as unknown as Record<string, unknown>,
  );
  const action = createSection.bind(null, pageId, type);
  const [state, formAction] = useActionState(action, idleState);

  function handleTypeChange(next: SectionType) {
    setType(next);
    setContent(SECTION_DEFAULTS[next] as unknown as Record<string, unknown>);
  }

  useEffect(() => {
    if (state.status === "success") onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-dashed border-border p-4">
      <FormStatusBanner status={state.status} message={state.message} />
      <input type="hidden" name="content" value={JSON.stringify(cleanContent(type, content))} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Section type</label>
        <Select value={type} onChange={(e) => handleTypeChange(e.target.value as SectionType)}>
          {Object.entries(SECTION_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <TypeEditor type={type} content={content} onChange={setContent} />

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="w-40">
          <Select name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </div>
        <SaveButton>Add section</SaveButton>
      </div>
    </form>
  );
}
