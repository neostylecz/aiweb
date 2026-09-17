import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { PageSectionRow } from "@/lib/queries/pages";
import { getPublishedServices } from "@/lib/queries/services";
import { getPublishedPortfolioItems } from "@/lib/queries/portfolio";
import { getMediaById, getPublicMediaUrl } from "@/lib/queries/media";
import { getContactInfo } from "@/lib/queries/site";
import { getSupabaseUrl } from "@/lib/supabase/env";
import type {
  BenefitsContent,
  CtaContent,
  FaqContent,
  HeroContent,
  ImageTextContent,
  PortfolioContent,
  ServicesContent,
  ContactSectionContent,
  StatsContent,
  TextContent,
} from "@/lib/sections/types";

import { Hero } from "./hero";
import { TextSection } from "./text-section";
import { ImageText } from "./image-text";
import { ServicesGrid } from "./services-grid";
import { ServicesDetailedList } from "./services-detailed-list";
import { PortfolioGrid } from "./portfolio-grid";
import { Benefits } from "./benefits";
import { Stats } from "./stats";
import { Cta } from "./cta";
import { Faq } from "./faq";
import { ContactSection } from "./contact-section";

export async function SectionRenderer({
  section,
  supabase,
}: {
  section: PageSectionRow;
  supabase: SupabaseClient<Database>;
}) {
  switch (section.type) {
    case "hero":
      return <Hero content={section.content as unknown as HeroContent} />;

    case "text":
      return <TextSection content={section.content as unknown as TextContent} />;

    case "image_text": {
      const content = section.content as unknown as ImageTextContent;
      const media = await getMediaById(supabase, content.imageId);
      const imageUrl = getPublicMediaUrl(getSupabaseUrl(), media);
      return <ImageText content={content} imageUrl={imageUrl} imageAlt={media?.alt_text} />;
    }

    case "services": {
      const content = section.content as unknown as ServicesContent;
      const services = await getPublishedServices(supabase, content.limit ?? null);
      return content.variant === "detailed" ? (
        <ServicesDetailedList content={content} services={services} />
      ) : (
        <ServicesGrid content={content} services={services} />
      );
    }

    case "portfolio": {
      const content = section.content as unknown as PortfolioContent;
      const items = await getPublishedPortfolioItems(supabase, content.limit ?? null);
      const supabaseUrl = getSupabaseUrl();
      const imageIds = items.map((item) => item.featured_image_id).filter(Boolean) as string[];
      const imageUrls: Record<string, string | null> = {};
      if (imageIds.length > 0) {
        const { data: mediaRows } = await supabase.from("media").select("*").in("id", imageIds);
        for (const item of items) {
          const media = mediaRows?.find((m) => m.id === item.featured_image_id);
          imageUrls[item.id] = getPublicMediaUrl(supabaseUrl, media);
        }
      }
      return <PortfolioGrid content={content} items={items} imageUrls={imageUrls} />;
    }

    case "benefits":
      return <Benefits content={section.content as unknown as BenefitsContent} />;

    case "stats":
      return <Stats content={section.content as unknown as StatsContent} />;

    case "cta":
      return <Cta content={section.content as unknown as CtaContent} />;

    case "faq":
      return <Faq content={section.content as unknown as FaqContent} />;

    case "contact": {
      const contactInfo = await getContactInfo(supabase);
      return (
        <ContactSection
          content={section.content as unknown as ContactSectionContent}
          contactInfo={contactInfo}
        />
      );
    }

    default:
      return null;
  }
}
