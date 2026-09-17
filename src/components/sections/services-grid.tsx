import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "./section-heading";
import type { ServicesContent } from "@/lib/sections/types";
import type { ServiceRow } from "@/lib/queries/services";

export function ServicesGrid({
  content,
  services,
}: {
  content: ServicesContent;
  services: ServiceRow[];
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

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className="group flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="bg-gradient-accent inline-flex size-11 items-center justify-center rounded-lg text-white">
                <Icon name={service.icon} className="size-5" />
              </div>
              <h3 className="heading-3 mt-5 text-foreground">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                {service.short_description}
              </p>
              <Link
                href={`/services#${service.slug}`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-foreground"
              >
                Learn more
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
