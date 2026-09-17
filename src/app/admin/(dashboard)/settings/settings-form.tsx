"use client";

import { useActionState, useState } from "react";
import { updateSiteSettings } from "@/app/actions/site";
import { idleState } from "@/lib/actions/types";
import { Label, Input, FieldError, FieldHint, FormRow } from "@/components/admin/form-field";
import { SaveButton } from "@/components/admin/save-button";
import { FormStatusBanner } from "@/components/admin/form-status-banner";
import { MediaPicker } from "@/components/admin/media-picker";
import type { Database } from "@/lib/supabase/types";

type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];

export function SettingsForm({ settings }: { settings: SiteSettingsRow | null }) {
  const [state, formAction] = useActionState(updateSiteSettings, idleState);
  const [ogImageId, setOgImageId] = useState<string | null>(settings?.default_og_image_id ?? null);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <FormStatusBanner status={state.status} message={state.message} />
      <input type="hidden" name="default_og_image_id" value={ogImageId ?? ""} />

      <FormRow>
        <Label htmlFor="site_name">Site name</Label>
        <Input id="site_name" name="site_name" defaultValue={settings?.site_name ?? "NEOAIWEBY"} required />
        <FieldError>{state.fieldErrors?.site_name}</FieldError>
      </FormRow>

      <FormRow>
        <Label htmlFor="default_seo_title">Default SEO title</Label>
        <Input
          id="default_seo_title"
          name="default_seo_title"
          defaultValue={settings?.default_seo_title ?? ""}
        />
        <FieldHint>Used for pages that don&apos;t set their own SEO title.</FieldHint>
      </FormRow>

      <FormRow>
        <Label htmlFor="default_seo_description">Default SEO description</Label>
        <Input
          id="default_seo_description"
          name="default_seo_description"
          defaultValue={settings?.default_seo_description ?? ""}
        />
      </FormRow>

      <MediaPicker value={ogImageId} onChange={setOgImageId} label="Default Open Graph image" />

      <FormRow>
        <Label htmlFor="google_site_verification">Google site verification code</Label>
        <Input
          id="google_site_verification"
          name="google_site_verification"
          defaultValue={settings?.google_site_verification ?? ""}
        />
      </FormRow>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="robots_index"
          defaultChecked={settings?.robots_index ?? true}
          className="size-4 rounded border-border text-accent focus:ring-ring/30"
        />
        Allow search engines to index this site
      </label>

      <SaveButton>Save settings</SaveButton>
    </form>
  );
}
