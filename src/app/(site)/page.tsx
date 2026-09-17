import type { Metadata } from "next";
import { CmsPage, getCmsPageMetadata } from "@/components/sections/cms-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata("home", "/");
}

export default function HomePage() {
  return <CmsPage slug="home" />;
}
