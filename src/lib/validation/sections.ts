import { z } from "zod";

const ctaLinkSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "Link is required"),
});

const optionalCtaLinkSchema = ctaLinkSchema.nullable().optional();

export const heroSchema = z.object({
  eyebrow: z.string().nullable().optional(),
  heading: z.string().min(1, "Heading is required"),
  subheading: z.string().nullable().optional(),
  primaryCta: optionalCtaLinkSchema,
  secondaryCta: optionalCtaLinkSchema,
  imageId: z.string().uuid().nullable().optional(),
});

export const textSchema = z.object({
  heading: z.string().nullable().optional(),
  body: z.string().min(1, "Body is required"),
  align: z.enum(["left", "center"]).optional(),
});

export const imageTextSchema = z.object({
  heading: z.string().nullable().optional(),
  body: z.string().min(1, "Body is required"),
  imageId: z.string().uuid().nullable().optional(),
  imagePosition: z.enum(["left", "right"]).optional(),
  cta: optionalCtaLinkSchema,
});

export const servicesSectionSchema = z.object({
  heading: z.string().nullable().optional(),
  subheading: z.string().nullable().optional(),
  limit: z.number().int().positive().nullable().optional(),
  ctaLabel: z.string().nullable().optional(),
  ctaHref: z.string().nullable().optional(),
  variant: z.enum(["grid", "detailed"]).optional(),
});

export const portfolioSectionSchema = z.object({
  heading: z.string().nullable().optional(),
  subheading: z.string().nullable().optional(),
  limit: z.number().int().positive().nullable().optional(),
  ctaLabel: z.string().nullable().optional(),
  ctaHref: z.string().nullable().optional(),
});

export const benefitsSchema = z.object({
  heading: z.string().nullable().optional(),
  subheading: z.string().nullable().optional(),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        icon: z.string().nullable().optional(),
      }),
    )
    .default([]),
});

export const statsSchema = z.object({
  heading: z.string().nullable().optional(),
  items: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
        suffix: z.string().nullable().optional(),
      }),
    )
    .default([]),
});

export const ctaSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  subheading: z.string().nullable().optional(),
  primaryCta: ctaLinkSchema,
  secondaryCta: optionalCtaLinkSchema,
});

export const faqSchema = z.object({
  heading: z.string().nullable().optional(),
  items: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .default([]),
});

export const contactSectionSchema = z.object({
  heading: z.string().nullable().optional(),
  subheading: z.string().nullable().optional(),
  showForm: z.boolean().optional(),
});

export const sectionSchemaByType = {
  hero: heroSchema,
  text: textSchema,
  image_text: imageTextSchema,
  services: servicesSectionSchema,
  portfolio: portfolioSectionSchema,
  benefits: benefitsSchema,
  stats: statsSchema,
  cta: ctaSchema,
  faq: faqSchema,
  contact: contactSectionSchema,
} as const;

export type SectionSchemaType = keyof typeof sectionSchemaByType;

export function parseSectionContent(type: SectionSchemaType, content: unknown) {
  return sectionSchemaByType[type].parse(content);
}
