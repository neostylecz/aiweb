import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import type { CtaContent } from "@/lib/sections/types";

export function Cta({ content }: { content: CtaContent }) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="bg-gradient-accent relative overflow-hidden rounded-2xl px-8 py-14 text-center sm:px-16">
          <h2 className="heading-2 mx-auto max-w-xl text-white">{content.heading}</h2>
          {content.subheading ? (
            <p className="body-lg mx-auto mt-4 max-w-xl text-white/85">{content.subheading}</p>
          ) : null}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={content.primaryCta.href} variant="secondary" size="lg">
              {content.primaryCta.label}
            </Button>
            {content.secondaryCta ? (
              <Button
                href={content.secondaryCta.href}
                size="lg"
                variant="ghost"
                className="border border-white/40 text-white hover:bg-white/10"
              >
                {content.secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
