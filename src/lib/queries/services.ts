import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];

export async function getPublishedServices(
  supabase: SupabaseClient<Database>,
  limit?: number | null,
) {
  let query = supabase
    .from("services")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getServiceBySlug(supabase: SupabaseClient<Database>, slug: string) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listAllServices(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getServiceById(supabase: SupabaseClient<Database>, id: string) {
  const { data, error } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}
