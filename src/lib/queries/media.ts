import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type MediaRow = Database["public"]["Tables"]["media"]["Row"];

export function getPublicMediaUrl(
  supabaseUrl: string,
  media: Pick<MediaRow, "bucket" | "storage_path"> | null | undefined,
): string | null {
  if (!media) return null;
  return `${supabaseUrl}/storage/v1/object/public/${media.bucket}/${media.storage_path}`;
}

export async function getMediaById(
  supabase: SupabaseClient<Database>,
  id: string | null | undefined,
): Promise<MediaRow | null> {
  if (!id) return null;
  const { data } = await supabase.from("media").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}

export async function listMedia(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
