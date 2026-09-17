"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sectionSchemaByType, type SectionSchemaType } from "@/lib/validation/sections";
import type { ActionState } from "@/lib/actions/types";

async function revalidateForPage(pageId: string) {
  const supabase = await createClient();
  const { data: page } = await supabase.from("pages").select("slug").eq("id", pageId).maybeSingle();
  revalidatePath(`/admin/pages/${pageId}`);
  if (page) {
    revalidatePath(page.slug === "home" ? "/" : `/${page.slug}`);
  }
}

function parseContent(type: SectionSchemaType, raw: string) {
  const json = JSON.parse(raw);
  return sectionSchemaByType[type].parse(json);
}

export async function createSection(
  pageId: string,
  type: SectionSchemaType,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = formData.get("content")?.toString() ?? "{}";

  let content;
  try {
    content = parseContent(type, raw);
  } catch {
    return { status: "error", message: "Invalid section content." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("page_sections")
    .select("display_order")
    .eq("page_id", pageId)
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.display_order ?? -1) + 1;

  const { error } = await supabase.from("page_sections").insert({
    page_id: pageId,
    type,
    status: (formData.get("status")?.toString() as "draft" | "published") ?? "draft",
    display_order: nextOrder,
    content,
  });

  if (error) {
    return { status: "error", message: "Failed to add section." };
  }

  await revalidateForPage(pageId);
  return { status: "success", message: "Section added." };
}

export async function updateSection(
  id: string,
  pageId: string,
  type: SectionSchemaType,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = formData.get("content")?.toString() ?? "{}";

  let content;
  try {
    content = parseContent(type, raw);
  } catch {
    return { status: "error", message: "Invalid section content." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("page_sections")
    .update({
      content,
      status: (formData.get("status")?.toString() as "draft" | "published") ?? "draft",
    })
    .eq("id", id);

  if (error) {
    return { status: "error", message: "Failed to save section." };
  }

  await revalidateForPage(pageId);
  return { status: "success", message: "Section saved." };
}

export async function deleteSection(id: string, pageId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("page_sections").delete().eq("id", id);
  await revalidateForPage(pageId);
}

export async function moveSectionOrder(
  pageId: string,
  id: string,
  direction: "up" | "down",
): Promise<void> {
  const supabase = await createClient();
  const { data: sections } = await supabase
    .from("page_sections")
    .select("id, display_order")
    .eq("page_id", pageId)
    .order("display_order", { ascending: true });

  if (!sections) return;

  const index = sections.findIndex((s) => s.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= sections.length) return;

  const current = sections[index]!;
  const swap = sections[swapIndex]!;

  await Promise.all([
    supabase.from("page_sections").update({ display_order: swap.display_order }).eq("id", current.id),
    supabase.from("page_sections").update({ display_order: current.display_order }).eq("id", swap.id),
  ]);

  await revalidateForPage(pageId);
}
