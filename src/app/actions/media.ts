"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { mediaAltTextSchema } from "@/lib/validation/content";
import { fieldErrorsFromZod, type ActionState } from "@/lib/actions/types";

export async function updateMediaAltText(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = mediaAltTextSchema.safeParse({
    alt_text: formData.get("alt_text")?.toString() ?? "",
  });

  if (!parsed.success) {
    return { status: "error", message: "Invalid alt text.", fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("media")
    .update({ alt_text: parsed.data.alt_text })
    .eq("id", id);

  if (error) {
    return { status: "error", message: "Failed to save alt text." };
  }

  revalidatePath("/admin/media");
  return { status: "success", message: "Saved." };
}

export async function deleteMedia(id: string): Promise<void> {
  const supabase = await createClient();

  const { data: media } = await supabase
    .from("media")
    .select("bucket, storage_path")
    .eq("id", id)
    .maybeSingle();

  if (media) {
    await supabase.storage.from(media.bucket).remove([media.storage_path]);
  }

  await supabase.from("media").delete().eq("id", id);
  revalidatePath("/admin/media");
}
