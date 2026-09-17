"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { portfolioItemSchema } from "@/lib/validation/content";
import { fieldErrorsFromZod, type ActionState } from "@/lib/actions/types";

function readPortfolioForm(formData: FormData) {
  return {
    title: formData.get("title")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    client_name: formData.get("client_name")?.toString() ?? "",
    short_description: formData.get("short_description")?.toString() ?? "",
    full_description: formData.get("full_description")?.toString() ?? "",
    featured_image_id: formData.get("featured_image_id")?.toString() || null,
    project_url: formData.get("project_url")?.toString() ?? "",
    published_date: formData.get("published_date")?.toString() ?? "",
    seo_title: formData.get("seo_title")?.toString() ?? "",
    seo_description: formData.get("seo_description")?.toString() ?? "",
    status: (formData.get("status")?.toString() ?? "draft") as "draft" | "published",
    display_order: formData.get("display_order")?.toString() ?? "0",
    service_ids: formData.getAll("service_ids").map(String),
    gallery_media_ids: formData
      .get("gallery_media_ids")
      ?.toString()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [],
  };
}

async function syncRelations(
  supabase: Awaited<ReturnType<typeof createClient>>,
  portfolioItemId: string,
  serviceIds: string[],
  galleryMediaIds: string[],
) {
  await supabase.from("portfolio_item_services").delete().eq("portfolio_item_id", portfolioItemId);
  if (serviceIds.length > 0) {
    await supabase
      .from("portfolio_item_services")
      .insert(serviceIds.map((service_id) => ({ portfolio_item_id: portfolioItemId, service_id })));
  }

  await supabase.from("portfolio_gallery").delete().eq("portfolio_item_id", portfolioItemId);
  if (galleryMediaIds.length > 0) {
    await supabase.from("portfolio_gallery").insert(
      galleryMediaIds.map((media_id, index) => ({
        portfolio_item_id: portfolioItemId,
        media_id,
        display_order: index,
      })),
    );
  }
}

export async function createPortfolioItem(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = portfolioItemSchema.safeParse(readPortfolioForm(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { service_ids, gallery_media_ids, ...values } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({
      ...values,
      featured_image_id: values.featured_image_id || null,
      published_date: values.published_date || null,
      project_url: values.project_url || null,
    })
    .select("id")
    .single();

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "That slug is already in use." : "Failed to create portfolio item.",
    };
  }

  await syncRelations(supabase, data.id, service_ids, gallery_media_ids);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  redirect(`/admin/portfolio/${data.id}`);
}

export async function updatePortfolioItem(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = portfolioItemSchema.safeParse(readPortfolioForm(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const { service_ids, gallery_media_ids, ...values } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("portfolio_items")
    .update({
      ...values,
      featured_image_id: values.featured_image_id || null,
      published_date: values.published_date || null,
      project_url: values.project_url || null,
    })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "That slug is already in use." : "Failed to save portfolio item.",
    };
  }

  await syncRelations(supabase, id, service_ids, gallery_media_ids);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return { status: "success", message: "Portfolio item saved." };
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("portfolio_items").delete().eq("id", id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function movePortfolioOrder(id: string, direction: "up" | "down"): Promise<void> {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("portfolio_items")
    .select("id, display_order")
    .order("display_order", { ascending: true });

  if (!items) return;

  const index = items.findIndex((item) => item.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index]!;
  const swap = items[swapIndex]!;

  await Promise.all([
    supabase.from("portfolio_items").update({ display_order: swap.display_order }).eq("id", current.id),
    supabase.from("portfolio_items").update({ display_order: current.display_order }).eq("id", swap.id),
  ]);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
}
