"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createPortfolioItem, updatePortfolioItem } from "@/app/actions/portfolio";
import { idleState } from "@/lib/actions/types";
import { Label, Input, Textarea, Select, FieldError, FormRow } from "@/components/admin/form-field";
import { SaveButton } from "@/components/admin/save-button";
import { FormStatusBanner } from "@/components/admin/form-status-banner";
import { MediaPicker } from "@/components/admin/media-picker";
import { GalleryPicker } from "@/components/admin/gallery-picker";
import type { MediaRow } from "@/lib/queries/media";
import type { ServiceRow } from "@/lib/queries/services";
import type { PortfolioItemRow } from "@/lib/queries/portfolio";

export function PortfolioForm({
  item,
  allServices,
  initialServiceIds = [],
  initialGallery = [],
}: {
  item?: PortfolioItemRow;
  allServices: ServiceRow[];
  initialServiceIds?: string[];
  initialGallery?: MediaRow[];
}) {
  const action = item ? updatePortfolioItem.bind(null, item.id) : createPortfolioItem;
  const [state, formAction] = useActionState(action, idleState);
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(
    item?.featured_image_id ?? null,
  );
  const [serviceIds, setServiceIds] = useState<string[]>(initialServiceIds);
  const [gallery, setGallery] = useState<MediaRow[]>(initialGallery);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <Link
        href="/admin/portfolio"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to portfolio
      </Link>

      <FormStatusBanner status={state.status} message={state.message} />

      <input type="hidden" name="featured_image_id" value={featuredImageId ?? ""} />
      <input
        type="hidden"
        name="gallery_media_ids"
        value={gallery.map((g) => g.id).join(",")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={item?.title} required />
          <FieldError>{state.fieldErrors?.title}</FieldError>
        </FormRow>
        <FormRow>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={item?.slug} required />
          <FieldError>{state.fieldErrors?.slug}</FieldError>
        </FormRow>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="client_name">Client name</Label>
          <Input id="client_name" name="client_name" defaultValue={item?.client_name ?? ""} />
        </FormRow>
        <FormRow>
          <Label htmlFor="project_url">Project URL</Label>
          <Input
            id="project_url"
            name="project_url"
            defaultValue={item?.project_url ?? ""}
            placeholder="https://"
          />
          <FieldError>{state.fieldErrors?.project_url}</FieldError>
        </FormRow>
      </div>

      <FormRow>
        <Label htmlFor="short_description">Short description</Label>
        <Textarea
          id="short_description"
          name="short_description"
          rows={2}
          defaultValue={item?.short_description ?? ""}
        />
      </FormRow>

      <FormRow>
        <Label htmlFor="full_description">Full description</Label>
        <Textarea
          id="full_description"
          name="full_description"
          rows={6}
          defaultValue={item?.full_description ?? ""}
        />
      </FormRow>

      <MediaPicker value={featuredImageId} onChange={setFeaturedImageId} label="Featured image" />

      <GalleryPicker items={gallery} onChange={setGallery} />

      <FormRow>
        <Label>Services provided</Label>
        <div className="flex flex-wrap gap-3">
          {allServices.map((service) => (
            <label
              key={service.id}
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-foreground"
            >
              <input
                type="checkbox"
                name="service_ids"
                value={service.id}
                checked={serviceIds.includes(service.id)}
                onChange={(e) =>
                  setServiceIds((prev) =>
                    e.target.checked
                      ? [...prev, service.id]
                      : prev.filter((id) => id !== service.id),
                  )
                }
                className="size-4 rounded border-border text-accent focus:ring-ring/30"
              />
              {service.title}
            </label>
          ))}
        </div>
      </FormRow>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="published_date">Published date</Label>
          <Input
            id="published_date"
            name="published_date"
            type="date"
            defaultValue={item?.published_date ?? ""}
          />
        </FormRow>
        <FormRow>
          <Label htmlFor="display_order">Display order</Label>
          <Input
            id="display_order"
            name="display_order"
            type="number"
            min={0}
            defaultValue={item?.display_order ?? 0}
          />
        </FormRow>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="seo_title">SEO title</Label>
          <Input id="seo_title" name="seo_title" defaultValue={item?.seo_title ?? ""} />
        </FormRow>
        <FormRow>
          <Label htmlFor="seo_description">SEO description</Label>
          <Input
            id="seo_description"
            name="seo_description"
            defaultValue={item?.seo_description ?? ""}
          />
        </FormRow>
      </div>

      <FormRow>
        <Label htmlFor="status">Status</Label>
        <Select id="status" name="status" defaultValue={item?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </FormRow>

      <SaveButton>{item ? "Save changes" : "Create portfolio item"}</SaveButton>
    </form>
  );
}
