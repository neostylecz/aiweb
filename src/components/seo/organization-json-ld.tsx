import { createClient } from "@/lib/supabase/server";
import { getContactInfo, getSiteSettings } from "@/lib/queries/site";
import { toJsonLd } from "@/lib/seo/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function OrganizationJsonLd() {
  const supabase = await createClient();
  const [contactInfo, settings] = await Promise.all([
    getContactInfo(supabase).catch(() => null),
    getSiteSettings(supabase).catch(() => null),
  ]);

  const sameAs = (contactInfo?.social_links ?? []).map((link) => link.url).filter(Boolean);

  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: contactInfo?.company_name ?? settings?.site_name ?? "NEOAIWEBY",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    ...(contactInfo?.email ? { email: contactInfo.email } : {}),
    ...(contactInfo?.phone ? { telephone: contactInfo.phone } : {}),
    ...(contactInfo?.address ? { address: contactInfo.address } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toJsonLd(json) }}
    />
  );
}
