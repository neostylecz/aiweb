// Content shapes for each page-section type. These are the shape of the
// `content` jsonb column on `page_sections`, keyed by `type`. Keeping this
// centralized lets the public renderer and the admin editor share one
// source of truth (see lib/validation/sections.ts for the matching zod
// schemas used to validate admin input).

export interface CtaLink {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow?: string | null;
  heading: string;
  subheading?: string | null;
  primaryCta?: CtaLink | null;
  secondaryCta?: CtaLink | null;
  imageId?: string | null;
}

export interface TextContent {
  heading?: string | null;
  body: string;
  align?: "left" | "center";
}

export interface ImageTextContent {
  heading?: string | null;
  body: string;
  imageId?: string | null;
  imagePosition?: "left" | "right";
  cta?: CtaLink | null;
}

export interface ServicesContent {
  heading?: string | null;
  subheading?: string | null;
  limit?: number | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  variant?: "grid" | "detailed";
}

export interface PortfolioContent {
  heading?: string | null;
  subheading?: string | null;
  limit?: number | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon?: string | null;
}

export interface BenefitsContent {
  heading?: string | null;
  subheading?: string | null;
  items: BenefitItem[];
}

export interface StatItem {
  value: string;
  label: string;
  suffix?: string | null;
}

export interface StatsContent {
  heading?: string | null;
  items: StatItem[];
}

export interface CtaContent {
  heading: string;
  subheading?: string | null;
  primaryCta: CtaLink;
  secondaryCta?: CtaLink | null;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading?: string | null;
  items: FaqItem[];
}

export interface ContactSectionContent {
  heading?: string | null;
  subheading?: string | null;
  showForm?: boolean;
}

export type SectionContentMap = {
  hero: HeroContent;
  text: TextContent;
  image_text: ImageTextContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  benefits: BenefitsContent;
  stats: StatsContent;
  cta: CtaContent;
  faq: FaqContent;
  contact: ContactSectionContent;
};

export type SectionType = keyof SectionContentMap;

export const SECTION_TYPES: SectionType[] = [
  "hero",
  "text",
  "image_text",
  "services",
  "portfolio",
  "benefits",
  "stats",
  "cta",
  "faq",
  "contact",
];

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  text: "Text",
  image_text: "Image + Text",
  services: "Services",
  portfolio: "Portfolio",
  benefits: "Benefits",
  stats: "Stats",
  cta: "Call to action",
  faq: "FAQ",
  contact: "Contact",
};
