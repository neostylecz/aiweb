import type { Metadata } from "next";
import type { PageWithSections } from "@/lib/queries/pages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

interface SeoFields {
  seo_title?: string | null;
  seo_description?: string | null;
  seo_canonical_url?: string | null;
  seo_no_index?: boolean | null;
  title: string;
}

export function buildPageMetadata(entity: SeoFields | null, path: string): Metadata {
  if (!entity) return {};

  const title = entity.seo_title || entity.title;
  const description = entity.seo_description || undefined;
  const canonical = entity.seo_canonical_url || `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: entity.seo_no_index
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export type { PageWithSections };
