import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { paragraphs, cn } from "@/lib/utils";
import type { ImageTextContent } from "@/lib/sections/types";

export function ImageText({
  content,
  imageUrl,
  imageAlt,
}: {
  content: ImageTextContent;
  imageUrl?: string | null;
  imageAlt?: string | null;
}) {
  const imageOnRight = (content.imagePosition ?? "right") === "right";

  return (
    <section className="py-16 sm:py-20">
      <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className={cn(imageOnRight ? "md:order-1" : "md:order-2")}>
          {content.heading ? (
            <h2 className="heading-2 text-foreground">{content.heading}</h2>
          ) : null}
          <div className="body-lg mt-5 space-y-4 text-muted-foreground">
            {paragraphs(content.body).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {content.cta ? (
            <Button href={content.cta.href} className="mt-8">
              {content.cta.label}
            </Button>
          ) : null}
        </div>

        <div className={cn("relative", imageOnRight ? "md:order-2" : "md:order-1")}>
          <div className="aspect-4/3 overflow-hidden rounded-xl border border-border bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt ?? ""}
                width={800}
                height={600}
                className="size-full object-cover"
              />
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
