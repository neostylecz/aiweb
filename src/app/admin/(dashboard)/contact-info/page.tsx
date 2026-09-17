import { createClient } from "@/lib/supabase/server";
import { getContactInfo } from "@/lib/queries/site";
import { ContactInfoForm } from "./contact-info-form";

export const dynamic = "force-dynamic";

export default async function AdminContactInfoPage() {
  const supabase = await createClient();
  const contactInfo = await getContactInfo(supabase);

  return (
    <div>
      <h1 className="heading-2 text-foreground">Contact information</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Shown in the footer, contact page, and structured data across the site.
      </p>

      <div className="mt-8">
        <ContactInfoForm contactInfo={contactInfo} />
      </div>
    </div>
  );
}
