import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: pages }, { data: portfolioItems }] = await Promise.all([
    supabase.from("pages").select("slug, updated_at").eq("status", "published"),
    supabase
      .from("portfolio_items")
      .select("slug, updated_at")
      .eq("status", "published"),
  ]);

  const pageEntries: MetadataRoute.Sitemap = (pages ?? []).map((page) => ({
    url: page.slug === "home" ? SITE_URL : `${SITE_URL}/${page.slug}`,
    lastModified: page.updated_at,
  }));

  const portfolioEntries: MetadataRoute.Sitemap = (portfolioItems ?? []).map((item) => ({
    url: `${SITE_URL}/portfolio/${item.slug}`,
    lastModified: item.updated_at,
  }));

  return [...pageEntries, ...portfolioEntries];
}
