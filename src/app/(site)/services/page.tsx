import type { Metadata } from "next";
import { CmsPage, getCmsPageMetadata } from "@/components/sections/cms-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata("services", "/services");
}

export default function ServicesPage() {
  return <CmsPage slug="services" />;
}
