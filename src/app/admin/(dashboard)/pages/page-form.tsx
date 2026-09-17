"use client";

import { useActionState, useState } from "react";
import { createPage, updatePage } from "@/app/actions/pages";
import { idleState } from "@/lib/actions/types";
import { Label, Input, Select, FieldError, FieldHint, FormRow } from "@/components/admin/form-field";
import { SaveButton } from "@/components/admin/save-button";
import { FormStatusBanner } from "@/components/admin/form-status-banner";
import { MediaPicker } from "@/components/admin/media-picker";
import type { PageRow } from "@/lib/queries/pages";

export function PageForm({ page }: { page?: PageRow }) {
  const action = page ? updatePage.bind(null, page.id) : createPage;
  const [state, formAction] = useActionState(action, idleState);
  const [ogImageId, setOgImageId] = useState<string | null>(page?.seo_og_image_id ?? null);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <FormStatusBanner status={state.status} message={state.message} />

      <input type="hidden" name="seo_og_image_id" value={ogImageId ?? ""} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={page?.title} required />
          <FieldError>{state.fieldErrors?.title}</FieldError>
        </FormRow>
        <FormRow>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={page?.slug} required />
          <FieldHint>Use &quot;home&quot; for the homepage.</FieldHint>
          <FieldError>{state.fieldErrors?.slug}</FieldError>
        </FormRow>
      </div>

      <FormRow>
        <Label htmlFor="status">Status</Label>
        <Select id="status" name="status" defaultValue={page?.status ?? "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
      </FormRow>

      <div className="border-t border-border pt-6">
        <h2 className="text-sm font-semibold text-foreground">SEO</h2>

        <div className="mt-4 space-y-5">
          <FormRow>
            <Label htmlFor="seo_title">SEO title</Label>
            <Input id="seo_title" name="seo_title" defaultValue={page?.seo_title ?? ""} />
          </FormRow>
          <FormRow>
            <Label htmlFor="seo_description">SEO description</Label>
            <Input
              id="seo_description"
              name="seo_description"
              defaultValue={page?.seo_description ?? ""}
            />
          </FormRow>
          <FormRow>
            <Label htmlFor="seo_canonical_url">Canonical URL</Label>
            <Input
              id="seo_canonical_url"
              name="seo_canonical_url"
              defaultValue={page?.seo_canonical_url ?? ""}
              placeholder="https://neoaiweby.com/..."
            />
          </FormRow>

          <MediaPicker value={ogImageId} onChange={setOgImageId} label="Open Graph image" />

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="seo_no_index"
              defaultChecked={page?.seo_no_index ?? false}
              className="size-4 rounded border-border text-accent focus:ring-ring/30"
            />
            Hide this page from search engines (noindex)
          </label>
        </div>
      </div>

      <SaveButton>{page ? "Save changes" : "Create page"}</SaveButton>
    </form>
  );
}
