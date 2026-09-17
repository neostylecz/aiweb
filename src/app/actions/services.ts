"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { serviceSchema } from "@/lib/validation/content";
import { fieldErrorsFromZod, type ActionState } from "@/lib/actions/types";

function readServiceForm(formData: FormData) {
  return {
    title: formData.get("title")?.toString() ?? "",
    slug: formData.get("slug")?.toString() ?? "",
    short_description: formData.get("short_description")?.toString() ?? "",
    full_description: formData.get("full_description")?.toString() ?? "",
    icon: formData.get("icon")?.toString() ?? "",
    image_id: formData.get("image_id")?.toString() || null,
    seo_title: formData.get("seo_title")?.toString() ?? "",
    seo_description: formData.get("seo_description")?.toString() ?? "",
    status: (formData.get("status")?.toString() ?? "draft") as "draft" | "published",
    display_order: formData.get("display_order")?.toString() ?? "0",
  };
}

export async function createService(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = serviceSchema.safeParse(readServiceForm(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .insert({
      ...parsed.data,
      image_id: parsed.data.image_id || null,
    })
    .select("id")
    .single();

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "That slug is already in use." : "Failed to create service.",
    };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect(`/admin/services/${data.id}`);
}

export async function updateService(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = serviceSchema.safeParse(readServiceForm(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please fix the errors below.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update({ ...parsed.data, image_id: parsed.data.image_id || null })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "That slug is already in use." : "Failed to save service.",
    };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { status: "success", message: "Service saved." };
}

export async function deleteService(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}

export async function moveServiceOrder(id: string, direction: "up" | "down"): Promise<void> {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, display_order")
    .order("display_order", { ascending: true });

  if (!services) return;

  const index = services.findIndex((s) => s.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= services.length) return;

  const current = services[index]!;
  const swap = services[swapIndex]!;

  await Promise.all([
    supabase.from("services").update({ display_order: swap.display_order }).eq("id", current.id),
    supabase.from("services").update({ display_order: current.display_order }).eq("id", swap.id),
  ]);

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}
