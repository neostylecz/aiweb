import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export async function getContactInfo(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("contact_info").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getSiteSettings(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data;
}
