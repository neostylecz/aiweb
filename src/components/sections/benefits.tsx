import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "./section-heading";
import type { BenefitsContent } from "@/lib/sections/types";

export function Benefits({ content }: { content: BenefitsContent }) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          heading={content.heading}
          subheading={content.subheading}
          align="center"
          className="mx-auto"
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, i) => (
            <div key={i}>
              <div className="bg-gradient-accent inline-flex size-11 items-center justify-center rounded-lg text-white">
                <Icon name={item.icon} className="size-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
