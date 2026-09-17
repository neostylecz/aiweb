import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { HeroContent } from "@/lib/sections/types";

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[36rem] bg-gradient-accent opacity-20 blur-[120px]"
      />

      <Container className="text-center">
        {content.eyebrow ? <p className="eyebrow mb-5">{content.eyebrow}</p> : null}
        <h1 className="heading-1 mx-auto max-w-4xl text-foreground">{content.heading}</h1>
        {content.subheading ? (
          <p className="body-lg mx-auto mt-6 max-w-2xl text-muted-foreground">
            {content.subheading}
          </p>
        ) : null}

        {content.primaryCta || content.secondaryCta ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {content.primaryCta ? (
              <Button href={content.primaryCta.href} size="lg">
                {content.primaryCta.label}
              </Button>
            ) : null}
            {content.secondaryCta ? (
              <Button href={content.secondaryCta.href} size="lg" variant="outline">
                {content.secondaryCta.label}
              </Button>
            ) : null}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
