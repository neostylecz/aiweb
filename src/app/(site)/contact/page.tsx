import type { Metadata } from "next";
import { CmsPage, getCmsPageMetadata } from "@/components/sections/cms-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata("contact", "/contact");
}

export default function ContactPage() {
  return <CmsPage slug="contact" />;
}
