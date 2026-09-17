"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { contactInfoSchema, siteSettingsSchema } from "@/lib/validation/content";
import { fieldErrorsFromZod, type ActionState } from "@/lib/actions/types";

export async function updateContactInfo(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let socialLinks: { platform: string; url: string }[] = [];
  try {
    socialLinks = JSON.parse(formData.get("social_links")?.toString() ?? "[]");
  } catch {
    socialLinks = [];
  }

  const parsed = contactInfoSchema.safeParse({
    company_name: formData.get("company_name")?.toString() ?? "",
    address: formData.get("address")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    company_id: formData.get("company_id")?.toString() ?? "",
    vat_id: formData.get("vat_id")?.toString() ?? "",
    social_links: socialLinks,
  });

  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_info").update(parsed.data).eq("id", 1);

  if (error) {
    return { status: "error", message: "Failed to save contact information." };
  }

  revalidatePath("/admin/contact-info");
  revalidatePath("/", "layout");
  return { status: "success", message: "Contact information saved." };
}

export async function updateSiteSettings(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = siteSettingsSchema.safeParse({
    site_name: formData.get("site_name")?.toString() ?? "",
    default_seo_title: formData.get("default_seo_title")?.toString() ?? "",
    default_seo_description: formData.get("default_seo_description")?.toString() ?? "",
    default_og_image_id: formData.get("default_og_image_id")?.toString() || null,
    robots_index: formData.get("robots_index") === "on",
    google_site_verification: formData.get("google_site_verification")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ ...parsed.data, default_og_image_id: parsed.data.default_og_image_id || null })
    .eq("id", 1);

  if (error) {
    return { status: "error", message: "Failed to save settings." };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { status: "success", message: "Settings saved." };
}
