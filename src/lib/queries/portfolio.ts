import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type PortfolioItemRow = Database["public"]["Tables"]["portfolio_items"]["Row"];

export async function getPublishedPortfolioItems(
  supabase: SupabaseClient<Database>,
  limit?: number | null,
) {
  let query = supabase
    .from("portfolio_items")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPortfolioItemBySlug(supabase: SupabaseClient<Database>, slug: string) {
  const { data: item, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  if (!item) return null;

  const [{ data: serviceLinks }, { data: gallery }] = await Promise.all([
    supabase
      .from("portfolio_item_services")
      .select("service_id, services(*)")
      .eq("portfolio_item_id", item.id),
    supabase
      .from("portfolio_gallery")
      .select("*, media(*)")
      .eq("portfolio_item_id", item.id)
      .order("display_order", { ascending: true }),
  ]);

  return {
    ...item,
    services: (serviceLinks ?? []).map((link) => link.services).filter(Boolean),
    gallery: gallery ?? [],
  };
}

export async function listAllPortfolioItems(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getPortfolioItemById(supabase: SupabaseClient<Database>, id: string) {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getPortfolioItemAdminById(supabase: SupabaseClient<Database>, id: string) {
  const item = await getPortfolioItemById(supabase, id);
  if (!item) return null;

  const [{ data: serviceLinks }, { data: gallery }] = await Promise.all([
    supabase.from("portfolio_item_services").select("service_id").eq("portfolio_item_id", id),
    supabase
      .from("portfolio_gallery")
      .select("*, media(*)")
      .eq("portfolio_item_id", id)
      .order("display_order", { ascending: true }),
  ]);

  return {
    ...item,
    serviceIds: (serviceLinks ?? []).map((link) => link.service_id),
    gallery: gallery ?? [],
  };
}
