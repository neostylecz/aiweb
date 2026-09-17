"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { pageSchema } from "@/lib/validation/content";
import { fieldErrorsFromZod, type ActionState } from "@/lib/actions/types";

function readPageForm(formData: FormData) {
  return {
    title: formData.get("title")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    status: (formData.get("status")?.toString() ?? "draft") as "draft" | "published",
    seo_title: formData.get("seo_title")?.toString() ?? "",
    seo_description: formData.get("seo_description")?.toString() ?? "",
    seo_canonical_url: formData.get("seo_canonical_url")?.toString() ?? "",
    seo_og_image_id: formData.get("seo_og_image_id")?.toString() || null,
    seo_no_index: formData.get("seo_no_index") === "on",
  };
}

export async function createPage(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = pageSchema.safeParse(readPageForm(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .insert({ ...parsed.data, seo_og_image_id: parsed.data.seo_og_image_id || null })
    .select("id")
    .single();

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "That slug is already in use." : "Failed to create page.",
    };
  }

  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${data.id}`);
}

export async function updatePage(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = pageSchema.safeParse(readPageForm(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("pages").select("slug").eq("id", id).maybeSingle();

  const { error } = await supabase
    .from("pages")
    .update({ ...parsed.data, seo_og_image_id: parsed.data.seo_og_image_id || null })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "That slug is already in use." : "Failed to save page.",
    };
  }

  revalidatePath("/admin/pages");
  if (existing) revalidatePath(existing.slug === "home" ? "/" : `/${existing.slug}`);
  revalidatePath(parsed.data.slug === "home" ? "/" : `/${parsed.data.slug}`);

  return { status: "success", message: "Page saved." };
}

export async function deletePage(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("pages").delete().eq("id", id);
  revalidatePath("/admin/pages");
}
