import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPageBySlug } from "@/lib/queries/pages";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SectionRenderer } from "./section-renderer";

export async function getCmsPageMetadata(slug: string, path: string): Promise<Metadata> {
  const supabase = await createClient();
  const page = await getPageBySlug(supabase, slug);
  return buildPageMetadata(page, path);
}

export async function CmsPage({ slug }: { slug: string }) {
  const supabase = await createClient();
  const page = await getPageBySlug(supabase, slug);

  if (!page || page.status !== "published") notFound();

  return (
    <>
      {page.sections
        .filter((section) => section.status === "published")
        .map((section) => (
          <SectionRenderer key={section.id} section={section} supabase={supabase} />
        ))}
    </>
  );
}
