import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "./section-heading";
import type { ContactSectionContent } from "@/lib/sections/types";
import type { Database } from "@/lib/supabase/types";

type ContactInfoRow = Database["public"]["Tables"]["contact_info"]["Row"];

export function ContactSection({
  content,
  contactInfo,
}: {
  content: ContactSectionContent;
  contactInfo: ContactInfoRow | null;
}) {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <SectionHeading heading={content.heading} subheading={content.subheading} />

            <div className="mt-8 space-y-4 text-sm text-muted-foreground">
              {contactInfo?.address ? (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>{contactInfo.address}</span>
                </div>
              ) : null}
              {contactInfo?.phone ? (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-foreground">
                    {contactInfo.phone}
                  </a>
                </div>
              ) : null}
              {contactInfo?.email ? (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-foreground">
                    {contactInfo.email}
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          {content.showForm === false ? null : (
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <ContactForm />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
