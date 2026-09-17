"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { MediaRow } from "@/lib/queries/media";

function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

/** Uploads a file to the "media" storage bucket and inserts its metadata
 * row. Used by both the media library page and the inline media picker. */
export async function uploadMediaFile(
  supabase: SupabaseClient<Database>,
  file: File,
): Promise<{ media: MediaRow | null; error: string | null }> {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
  const { error: uploadError } = await supabase.storage.from("media").upload(path, file);

  if (uploadError) {
    return { media: null, error: uploadError.message };
  }

  const dimensions = await getImageDimensions(file);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("media")
    .insert({
      bucket: "media",
      storage_path: path,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
      uploaded_by: user?.id ?? null,
    })
    .select("*")
    .single();

  if (error) {
    return { media: null, error: error.message };
  }

  return { media: data, error: null };
}
