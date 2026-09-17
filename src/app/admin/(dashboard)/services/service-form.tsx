"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createService, updateService } from "@/app/actions/services";
import { idleState } from "@/lib/actions/types";
import { Label, Input, Textarea, Select, FieldError, FormRow } from "@/components/admin/form-field";
import { SaveButton } from "@/components/admin/save-button";
import { FormStatusBanner } from "@/components/admin/form-status-banner";
import { MediaPicker } from "@/components/admin/media-picker";
import type { ServiceRow } from "@/lib/queries/services";

export function ServiceForm({ service }: { service?: ServiceRow }) {
  const action = service ? updateService.bind(null, service.id) : createService;
  const [state, formAction] = useActionState(action, idleState);
  const [imageId, setImageId] = useState<string | null>(service?.image_id ?? null);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to services
      </Link>

      <FormStatusBanner status={state.status} message={state.message} />

      <input type="hidden" name="image_id" value={imageId ?? ""} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={service?.title} required />
          <FieldError>{state.fieldErrors?.title}</FieldError>
        </FormRow>

        <FormRow>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={service?.slug} required />
          <FieldError>{state.fieldErrors?.slug}</FieldError>
        </FormRow>
      </div>

      <FormRow>
        <Label htmlFor="short_description">Short description</Label>
        <Textarea
          id="short_description"
          name="short_description"
          rows={2}
          defaultValue={service?.short_description ?? ""}
        />
        <FieldError>{state.fieldErrors?.short_description}</FieldError>
      </FormRow>

      <FormRow>
        <Label htmlFor="full_description">Full description</Label>
        <Textarea
          id="full_description"
          name="full_description"
          rows={6}
          defaultValue={service?.full_description ?? ""}
        />
        <FieldError>{state.fieldErrors?.full_description}</FieldError>
      </FormRow>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="icon">Icon</Label>
          <Input
            id="icon"
            name="icon"
            defaultValue={service?.icon ?? ""}
            placeholder="e.g. code, sparkles, palette"
          />
          <FieldError>{state.fieldErrors?.icon}</FieldError>
        </FormRow>

        <FormRow>
          <Label htmlFor="display_order">Display order</Label>
          <Input
            id="display_order"
            name="display_order"
            type="number"
            min={0}
            defaultValue={service?.display_order ?? 0}
          />
          <FieldError>{state.fieldErrors?.display_order}</FieldError>
        </FormRow>
      </div>

      <MediaPicker value={imageId} onChange={setImageId} label="Image" />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="seo_title">SEO title</Label>
          <Input id="seo_title" name="seo_title" defaultValue={service?.seo_title ?? ""} />
        </FormRow>
        <FormRow>
          <Label htmlFor="seo_description">SEO description</Label>
          <Input
            id="seo_description"
            name="seo_description"
            defaultValue={service?.seo_description ?? ""}
          />
        </FormRow>
      </div>

      <FormRow>
        <Label htmlFor="status">Status</Label>
        <Select id="status" name="status" defaultValue={service?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </FormRow>

      <SaveButton>{service ? "Save changes" : "Create service"}</SaveButton>
    </form>
  );
}
