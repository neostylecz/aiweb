import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type PageRow = Database["public"]["Tables"]["pages"]["Row"];
export type PageSectionRow = Database["public"]["Tables"]["page_sections"]["Row"];

export interface PageWithSections extends PageRow {
  sections: PageSectionRow[];
}

export async function getPageBySlug(
  supabase: SupabaseClient<Database>,
  slug: string,
): Promise<PageWithSections | null> {
  const { data: page, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!page) return null;

  const { data: sections, error: sectionsError } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", page.id)
    .order("display_order", { ascending: true });

  if (sectionsError) throw sectionsError;

  return { ...page, sections: sections ?? [] };
}

export async function listPages(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("pages").select("*").order("title");
  if (error) throw error;
  return data;
}

export async function getPageById(supabase: SupabaseClient<Database>, id: string) {
  const { data, error } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getSectionsForPage(supabase: SupabaseClient<Database>, pageId: string) {
  const { data, error } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", pageId)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data;
}
