import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";
import type { PortfolioContent } from "@/lib/sections/types";
import type { PortfolioItemRow } from "@/lib/queries/portfolio";

export function PortfolioGrid({
  content,
  items,
  imageUrls,
}: {
  content: PortfolioContent;
  items: PortfolioItemRow[];
  imageUrls: Record<string, string | null>;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading heading={content.heading} subheading={content.subheading} />
          {content.ctaLabel && content.ctaHref ? (
            <Button href={content.ctaHref} variant="outline" className="shrink-0">
              {content.ctaLabel}
            </Button>
          ) : null}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const imageUrl = imageUrls[item.id];
            return (
              <Link
                key={item.id}
                href={`/portfolio/${item.slug}`}
                className="group block overflow-hidden rounded-xl border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-4/3 overflow-hidden bg-muted">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.title}
                      width={800}
                      height={600}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="bg-gradient-accent size-full opacity-30" />
                  )}
                </div>
                <div className="p-6">
                  {item.client_name ? (
                    <p className="eyebrow mb-2">{item.client_name}</p>
                  ) : null}
                  <h3 className="heading-3 text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.short_description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                    View case study
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
