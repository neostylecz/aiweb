"use client";

import { useActionState, useState } from "react";
import { updateContactInfo } from "@/app/actions/site";
import { idleState } from "@/lib/actions/types";
import { Label, Input, Textarea, FieldError, FormRow } from "@/components/admin/form-field";
import { SaveButton } from "@/components/admin/save-button";
import { FormStatusBanner } from "@/components/admin/form-status-banner";
import { ArrayField } from "@/components/admin/sections/array-field";
import type { Database } from "@/lib/supabase/types";

type ContactInfoRow = Database["public"]["Tables"]["contact_info"]["Row"];

export function ContactInfoForm({ contactInfo }: { contactInfo: ContactInfoRow | null }) {
  const [state, formAction] = useActionState(updateContactInfo, idleState);
  const [socialLinks, setSocialLinks] = useState(contactInfo?.social_links ?? []);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <FormStatusBanner status={state.status} message={state.message} />
      <input type="hidden" name="social_links" value={JSON.stringify(socialLinks)} />

      <FormRow>
        <Label htmlFor="company_name">Company name</Label>
        <Input id="company_name" name="company_name" defaultValue={contactInfo?.company_name ?? ""} />
      </FormRow>

      <FormRow>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" name="address" rows={2} defaultValue={contactInfo?.address ?? ""} />
      </FormRow>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={contactInfo?.phone ?? ""} />
        </FormRow>
        <FormRow>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={contactInfo?.email ?? ""} />
          <FieldError>{state.fieldErrors?.email}</FieldError>
        </FormRow>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormRow>
          <Label htmlFor="company_id">Company ID (IČO)</Label>
          <Input id="company_id" name="company_id" defaultValue={contactInfo?.company_id ?? ""} />
        </FormRow>
        <FormRow>
          <Label htmlFor="vat_id">VAT ID (DIČ)</Label>
          <Input id="vat_id" name="vat_id" defaultValue={contactInfo?.vat_id ?? ""} />
        </FormRow>
      </div>

      <FormRow>
        <Label>Social links</Label>
        <ArrayField
          items={socialLinks}
          onChange={setSocialLinks}
          newItem={{ platform: "linkedin", url: "" }}
          addLabel="Add social link"
          renderItem={(item, update) => (
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={item.platform}
                onChange={(e) => update({ ...item, platform: e.target.value })}
                placeholder="Platform (e.g. linkedin)"
              />
              <Input
                value={item.url}
                onChange={(e) => update({ ...item, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          )}
        />
      </FormRow>

      <SaveButton>Save contact information</SaveButton>
    </form>
  );
}
