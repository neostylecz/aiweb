import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "./section-heading";
import { paragraphs } from "@/lib/utils";
import type { ServicesContent } from "@/lib/sections/types";
import type { ServiceRow } from "@/lib/queries/services";

export function ServicesDetailedList({
  content,
  services,
}: {
  content: ServicesContent;
  services: ServiceRow[];
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading heading={content.heading} subheading={content.subheading} />

        <div className="mt-12 divide-y divide-border border-t border-border">
          {services.map((service) => (
            <div
              key={service.id}
              id={service.slug}
              className="grid gap-6 py-12 scroll-mt-24 sm:grid-cols-[auto_1fr] sm:gap-10"
            >
              <div className="bg-gradient-accent inline-flex size-12 items-center justify-center rounded-lg text-white">
                <Icon name={service.icon} className="size-6" />
              </div>
              <div>
                <h3 className="heading-3 text-foreground">{service.title}</h3>
                <div className="body-lg mt-3 space-y-4 text-muted-foreground">
                  {paragraphs(service.full_description ?? service.short_description).map(
                    (p, i) => (
                      <p key={i}>{p}</p>
                    ),
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
