import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPortfolioItemBySlug } from "@/lib/queries/portfolio";
import { getMediaById, getPublicMediaUrl } from "@/lib/queries/media";
import { getSupabaseUrl } from "@/lib/supabase/env";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { paragraphs, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const item = await getPortfolioItemBySlug(supabase, slug);
  if (!item) return {};
  return buildPageMetadata({ ...item, title: item.title }, `/portfolio/${slug}`);
}

export default async function PortfolioItemPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const item = await getPortfolioItemBySlug(supabase, slug);

  if (!item) notFound();

  const supabaseUrl = getSupabaseUrl();
  const featuredImage = await getMediaById(supabase, item.featured_image_id);
  const featuredImageUrl = getPublicMediaUrl(supabaseUrl, featuredImage);

  const publishedDate = formatDate(item.published_date);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.short_description ?? undefined,
    url: `${siteUrl}/portfolio/${item.slug}`,
    ...(featuredImageUrl ? { image: featuredImageUrl } : {}),
    ...(item.published_date ? { datePublished: item.published_date } : {}),
    ...(item.client_name ? { creator: { "@type": "Organization", name: item.client_name } } : {}),
  };

  return (
    <article className="py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="max-w-3xl">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to portfolio
        </Link>

        {item.client_name ? <p className="eyebrow mt-8 mb-3">{item.client_name}</p> : null}
        <h1 className="heading-1 text-foreground">{item.title}</h1>
        {item.short_description ? (
          <p className="body-lg mt-5 text-muted-foreground">{item.short_description}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {publishedDate ? <span>{publishedDate}</span> : null}
          {item.project_url ? (
            <a
              href={item.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-foreground"
            >
              Visit project <ArrowUpRight className="size-3.5" />
            </a>
          ) : null}
        </div>

        {item.services.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {item.services.map((service) =>
              service ? (
                <span
                  key={service.id}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {service.title}
                </span>
              ) : null,
            )}
          </div>
        ) : null}
      </Container>

      {featuredImageUrl ? (
        <Container className="mt-12 max-w-5xl">
          <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={featuredImageUrl}
              alt={item.title}
              width={1600}
              height={900}
              className="size-full object-cover"
              priority
            />
          </div>
        </Container>
      ) : null}

      <Container className="mt-12 max-w-3xl">
        <div className="body-lg space-y-4 text-muted-foreground">
          {paragraphs(item.full_description ?? item.short_description).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {item.gallery.length > 0 ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {item.gallery.map((galleryItem) => {
              const url = getPublicMediaUrl(supabaseUrl, galleryItem.media);
              if (!url) return null;
              return (
                <div
                  key={galleryItem.id}
                  className="aspect-4/3 overflow-hidden rounded-xl border border-border bg-muted"
                >
                  <Image
                    src={url}
                    alt={galleryItem.media?.alt_text ?? item.title}
                    width={800}
                    height={600}
                    className="size-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="mt-16 border-t border-border pt-10">
          <Button href="/contact" size="lg">
            Start a similar project
          </Button>
        </div>
      </Container>
    </article>
  );
}
