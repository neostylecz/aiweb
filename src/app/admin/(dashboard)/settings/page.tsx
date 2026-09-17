import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/queries/site";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const settings = await getSiteSettings(supabase);

  return (
    <div>
      <h1 className="heading-2 text-foreground">SEO &amp; site settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Global defaults used across the site.
      </p>

      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
