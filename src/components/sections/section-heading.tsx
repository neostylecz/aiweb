import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  heading,
  subheading,
  align = "left",
  className,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  subheading?: string | null;
  align?: "left" | "center";
  className?: string;
}) {
  if (!heading && !subheading && !eyebrow) return null;

  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      {heading ? <h2 className="heading-2 text-foreground">{heading}</h2> : null}
      {subheading ? <p className="body-lg mt-4 text-muted-foreground">{subheading}</p> : null}
    </div>
  );
}
