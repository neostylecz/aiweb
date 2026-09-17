"use client";

import { Label, Input, Textarea, Select } from "@/components/admin/form-field";
import { MediaPicker } from "@/components/admin/media-picker";
import { ArrayField } from "./array-field";
import type {
  BenefitsContent,
  CtaContent,
  CtaLink,
  ContactSectionContent,
  FaqContent,
  HeroContent,
  ImageTextContent,
  PortfolioContent,
  ServicesContent,
  StatsContent,
  TextContent,
} from "@/lib/sections/types";

function CtaLinkFields({
  title,
  value,
  onChange,
}: {
  title: string;
  value: CtaLink | null | undefined;
  onChange: (value: CtaLink) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <Label>{title} label</Label>
        <Input
          value={value?.label ?? ""}
          onChange={(e) => onChange({ label: e.target.value, href: value?.href ?? "" })}
          placeholder="e.g. Get in touch"
        />
      </div>
      <div>
        <Label>{title} link</Label>
        <Input
          value={value?.href ?? ""}
          onChange={(e) => onChange({ label: value?.label ?? "", href: e.target.value })}
          placeholder="/contact"
        />
      </div>
    </div>
  );
}

export function HeroEditor({
  content,
  onChange,
}: {
  content: HeroContent;
  onChange: (c: HeroContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Eyebrow</Label>
        <Input
          value={content.eyebrow ?? ""}
          onChange={(e) => onChange({ ...content, eyebrow: e.target.value })}
        />
      </div>
      <div>
        <Label>Heading</Label>
        <Input
          value={content.heading}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>
      <div>
        <Label>Subheading</Label>
        <Textarea
          rows={2}
          value={content.subheading ?? ""}
          onChange={(e) => onChange({ ...content, subheading: e.target.value })}
        />
      </div>
      <CtaLinkFields
        title="Primary CTA"
        value={content.primaryCta}
        onChange={(v) => onChange({ ...content, primaryCta: v })}
      />
      <CtaLinkFields
        title="Secondary CTA"
        value={content.secondaryCta}
        onChange={(v) => onChange({ ...content, secondaryCta: v })}
      />
    </div>
  );
}

export function TextEditor({
  content,
  onChange,
}: {
  content: TextContent;
  onChange: (c: TextContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Heading</Label>
        <Input
          value={content.heading ?? ""}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>
      <div>
        <Label>Body</Label>
        <Textarea
          rows={6}
          value={content.body}
          onChange={(e) => onChange({ ...content, body: e.target.value })}
        />
      </div>
      <div>
        <Label>Alignment</Label>
        <Select
          value={content.align ?? "left"}
          onChange={(e) => onChange({ ...content, align: e.target.value as "left" | "center" })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
        </Select>
      </div>
    </div>
  );
}

export function ImageTextEditor({
  content,
  onChange,
}: {
  content: ImageTextContent;
  onChange: (c: ImageTextContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Heading</Label>
        <Input
          value={content.heading ?? ""}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>
      <div>
        <Label>Body</Label>
        <Textarea
          rows={5}
          value={content.body}
          onChange={(e) => onChange({ ...content, body: e.target.value })}
        />
      </div>
      <MediaPicker
        value={content.imageId ?? null}
        onChange={(id) => onChange({ ...content, imageId: id })}
      />
      <div>
        <Label>Image position</Label>
        <Select
          value={content.imagePosition ?? "right"}
          onChange={(e) =>
            onChange({ ...content, imagePosition: e.target.value as "left" | "right" })
          }
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
        </Select>
      </div>
      <CtaLinkFields
        title="CTA"
        value={content.cta}
        onChange={(v) => onChange({ ...content, cta: v })}
      />
    </div>
  );
}

export function ServicesEditor({
  content,
  onChange,
}: {
  content: ServicesContent;
  onChange: (c: ServicesContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Heading</Label>
        <Input
          value={content.heading ?? ""}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>
      <div>
        <Label>Subheading</Label>
        <Input
          value={content.subheading ?? ""}
          onChange={(e) => onChange({ ...content, subheading: e.target.value })}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label>Limit (blank = all)</Label>
          <Input
            type="number"
            min={1}
            value={content.limit ?? ""}
            onChange={(e) =>
              onChange({ ...content, limit: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>
        <div>
          <Label>CTA label</Label>
          <Input
            value={content.ctaLabel ?? ""}
            onChange={(e) => onChange({ ...content, ctaLabel: e.target.value })}
          />
        </div>
        <div>
          <Label>CTA link</Label>
          <Input
            value={content.ctaHref ?? ""}
            onChange={(e) => onChange({ ...content, ctaHref: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label>Layout</Label>
        <Select
          value={content.variant ?? "grid"}
          onChange={(e) => onChange({ ...content, variant: e.target.value as "grid" | "detailed" })}
        >
          <option value="grid">Grid (short cards)</option>
          <option value="detailed">Detailed list (full descriptions)</option>
        </Select>
      </div>
    </div>
  );
}

export function PortfolioEditor({
  content,
  onChange,
}: {
  content: PortfolioContent;
  onChange: (c: PortfolioContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Heading</Label>
        <Input
          value={content.heading ?? ""}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>
      <div>
        <Label>Subheading</Label>
        <Input
          value={content.subheading ?? ""}
          onChange={(e) => onChange({ ...content, subheading: e.target.value })}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label>Limit (blank = all)</Label>
          <Input
            type="number"
            min={1}
            value={content.limit ?? ""}
            onChange={(e) =>
              onChange({ ...content, limit: e.target.value ? Number(e.target.value) : null })
            }
          />
        </div>
        <div>
          <Label>CTA label</Label>
          <Input
            value={content.ctaLabel ?? ""}
            onChange={(e) => onChange({ ...content, ctaLabel: e.target.value })}
          />
        </div>
        <div>
          <Label>CTA link</Label>
          <Input
            value={content.ctaHref ?? ""}
            onChange={(e) => onChange({ ...content, ctaHref: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

export function BenefitsEditor({
  content,
  onChange,
}: {
  content: BenefitsContent;
  onChange: (c: BenefitsContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Heading</Label>
        <Input
          value={content.heading ?? ""}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>
      <div>
        <Label>Subheading</Label>
        <Input
          value={content.subheading ?? ""}
          onChange={(e) => onChange({ ...content, subheading: e.target.value })}
        />
      </div>
      <Label>Items</Label>
      <ArrayField
        items={content.items}
        onChange={(items) => onChange({ ...content, items })}
        newItem={{ title: "", description: "", icon: "" }}
        addLabel="Add benefit"
        renderItem={(item, update) => (
          <>
            <Input
              value={item.title}
              onChange={(e) => update({ ...item, title: e.target.value })}
              placeholder="Title"
            />
            <Textarea
              rows={2}
              value={item.description}
              onChange={(e) => update({ ...item, description: e.target.value })}
              placeholder="Description"
            />
            <Input
              value={item.icon ?? ""}
              onChange={(e) => update({ ...item, icon: e.target.value })}
              placeholder="Icon (e.g. gem)"
            />
          </>
        )}
      />
    </div>
  );
}

export function StatsEditor({
  content,
  onChange,
}: {
  content: StatsContent;
  onChange: (c: StatsContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Heading</Label>
        <Input
          value={content.heading ?? ""}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>
      <Label>Stats</Label>
      <ArrayField
        items={content.items}
        onChange={(items) => onChange({ ...content, items })}
        newItem={{ value: "", label: "", suffix: "" }}
        addLabel="Add stat"
        renderItem={(item, update) => (
          <div className="grid grid-cols-3 gap-2">
            <Input
              value={item.value}
              onChange={(e) => update({ ...item, value: e.target.value })}
              placeholder="Value"
            />
            <Input
              value={item.label}
              onChange={(e) => update({ ...item, label: e.target.value })}
              placeholder="Label"
            />
            <Input
              value={item.suffix ?? ""}
              onChange={(e) => update({ ...item, suffix: e.target.value })}
              placeholder="Suffix"
            />
          </div>
        )}
      />
    </div>
  );
}

export function CtaEditor({
  content,
  onChange,
}: {
  content: CtaContent;
  onChange: (c: CtaContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Heading</Label>
        <Input
          value={content.heading}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>
      <div>
        <Label>Subheading</Label>
        <Textarea
          rows={2}
          value={content.subheading ?? ""}
          onChange={(e) => onChange({ ...content, subheading: e.target.value })}
        />
      </div>
      <CtaLinkFields
        title="Primary CTA"
        value={content.primaryCta}
        onChange={(v) => onChange({ ...content, primaryCta: v })}
      />
      <CtaLinkFields
        title="Secondary CTA"
        value={content.secondaryCta}
        onChange={(v) => onChange({ ...content, secondaryCta: v })}
      />
    </div>
  );
}

export function FaqEditor({
  content,
  onChange,
}: {
  content: FaqContent;
  onChange: (c: FaqContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Heading</Label>
        <Input
          value={content.heading ?? ""}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>
      <Label>Questions</Label>
      <ArrayField
        items={content.items}
        onChange={(items) => onChange({ ...content, items })}
        newItem={{ question: "", answer: "" }}
        addLabel="Add question"
        renderItem={(item, update) => (
          <>
            <Input
              value={item.question}
              onChange={(e) => update({ ...item, question: e.target.value })}
              placeholder="Question"
            />
            <Textarea
              rows={2}
              value={item.answer}
              onChange={(e) => update({ ...item, answer: e.target.value })}
              placeholder="Answer"
            />
          </>
        )}
      />
    </div>
  );
}

export function ContactEditor({
  content,
  onChange,
}: {
  content: ContactSectionContent;
  onChange: (c: ContactSectionContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Heading</Label>
        <Input
          value={content.heading ?? ""}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>
      <div>
        <Label>Subheading</Label>
        <Input
          value={content.subheading ?? ""}
          onChange={(e) => onChange({ ...content, subheading: e.target.value })}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={content.showForm !== false}
          onChange={(e) => onChange({ ...content, showForm: e.target.checked })}
          className="size-4 rounded border-border text-accent focus:ring-ring/30"
        />
        Show contact form
      </label>
    </div>
  );
}
