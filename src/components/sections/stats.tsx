import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";
import type { StatsContent } from "@/lib/sections/types";

export function Stats({ content }: { content: StatsContent }) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading heading={content.heading} align="center" className="mx-auto" />

        <dl className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {content.items.map((item, i) => (
            <div key={i} className="text-center">
              <dt className="sr-only">{item.label}</dt>
              <dd className="text-gradient font-display text-4xl font-semibold sm:text-5xl">
                {item.value}
                {item.suffix ?? ""}
              </dd>
              <dd className="mt-2 text-sm text-muted-foreground">{item.label}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
