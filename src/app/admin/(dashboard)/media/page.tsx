import { createClient } from "@/lib/supabase/server";
import { listMedia } from "@/lib/queries/media";
import { MediaLibrary } from "@/components/admin/media-library";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const media = await listMedia(supabase);

  return (
    <div>
      <h1 className="heading-2 text-foreground">Media</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Upload and manage images used across your site.
      </p>

      <div className="mt-8">
        <MediaLibrary initialMedia={media} />
      </div>
    </div>
  );
}
