import Link from "next/link";
import { Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getContactInfo } from "@/lib/queries/site";
import { NAV_LINKS } from "./nav-links";
import { Logo } from "./logo";
import { Container } from "@/components/ui/container";

// lucide-react no longer ships brand/logo icons, so social links use a
// neutral globe icon with the platform name as the accessible label.

export async function Footer() {
  const supabase = await createClient();
  const contactInfo = await getContactInfo(supabase).catch(() => null);

  const year = new Date().getFullYear();
  const socialLinks = contactInfo?.social_links ?? [];

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {contactInfo?.company_name ?? "NEOAIWEBY"} designs and builds fast, modern websites
            and digital products powered by thoughtful design and applied AI.
          </p>
          {socialLinks.length > 0 ? (
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((link) => {
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Globe className="size-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>

        <div>
          <p className="eyebrow">Navigate</p>
          <ul className="mt-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {contactInfo?.address ? <li>{contactInfo.address}</li> : null}
            {contactInfo?.phone ? (
              <li>
                <a href={`tel:${contactInfo.phone}`} className="hover:text-foreground">
                  {contactInfo.phone}
                </a>
              </li>
            ) : null}
            {contactInfo?.email ? (
              <li>
                <a href={`mailto:${contactInfo.email}`} className="hover:text-foreground">
                  {contactInfo.email}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {contactInfo?.company_name ?? "NEOAIWEBY"}. All rights reserved.
          </p>
          <div className="flex gap-2">
            {contactInfo?.company_id ? <span>IČO {contactInfo.company_id}</span> : null}
            {contactInfo?.vat_id ? <span>· DIČ {contactInfo.vat_id}</span> : null}
          </div>
        </Container>
      </div>
    </footer>
  );
}
