"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";
import type { FaqContent } from "@/lib/sections/types";

export function Faq({ content }: { content: FaqContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <SectionHeading heading={content.heading} align="center" className="mx-auto" />

        <div className="mt-10 divide-y divide-border rounded-xl border border-border bg-surface">
          {content.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium text-foreground">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {isOpen ? (
                  <div className="px-6 pb-5 text-sm leading-6 text-muted-foreground">
                    {item.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
