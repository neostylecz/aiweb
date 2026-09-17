import type { SectionContentMap, SectionType } from "./types";

export const SECTION_DEFAULTS: { [K in SectionType]: SectionContentMap[K] } = {
  hero: {
    eyebrow: "",
    heading: "New heading",
    subheading: "",
    primaryCta: null,
    secondaryCta: null,
    imageId: null,
  },
  text: {
    heading: "",
    body: "",
    align: "left",
  },
  image_text: {
    heading: "",
    body: "",
    imageId: null,
    imagePosition: "right",
    cta: null,
  },
  services: {
    heading: "Our services",
    subheading: "",
    limit: null,
    ctaLabel: null,
    ctaHref: null,
    variant: "grid",
  },
  portfolio: {
    heading: "Our work",
    subheading: "",
    limit: null,
    ctaLabel: null,
    ctaHref: null,
  },
  benefits: {
    heading: "Why choose us",
    subheading: "",
    items: [],
  },
  stats: {
    heading: "",
    items: [],
  },
  cta: {
    heading: "Ready to get started?",
    subheading: "",
    primaryCta: { label: "Get in touch", href: "/contact" },
    secondaryCta: null,
  },
  faq: {
    heading: "Frequently asked questions",
    items: [],
  },
  contact: {
    heading: "Get in touch",
    subheading: "",
    showForm: true,
  },
};
