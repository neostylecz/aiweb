import { Container } from "@/components/ui/container";
import { paragraphs } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TextContent } from "@/lib/sections/types";

export function TextSection({ content }: { content: TextContent }) {
  const align = content.align ?? "left";

  return (
    <section className="py-16 sm:py-20">
      <Container className={cn("max-w-3xl", align === "center" && "text-center")}>
        {content.heading ? (
          <h2 className="heading-2 text-foreground">{content.heading}</h2>
        ) : null}
        <div className="body-lg mt-5 space-y-4 text-muted-foreground">
          {paragraphs(content.body).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Container>
    </section>
  );
}
