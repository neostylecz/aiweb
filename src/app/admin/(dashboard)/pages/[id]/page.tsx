import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPageById, getSectionsForPage } from "@/lib/queries/pages";
import { PageForm } from "../page-form";
import { SectionsManager } from "@/components/admin/sections/sections-manager";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const page = await getPageById(supabase, id);

  if (!page) notFound();

  const sections = await getSectionsForPage(supabase, id);

  return (
    <div>
      <h1 className="heading-2 text-foreground">Edit page</h1>

      <div className="mt-8">
        <PageForm page={page} />
      </div>

      <div className="mt-12 max-w-2xl">
        <h2 className="text-sm font-semibold text-foreground">Sections</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Build the page from reusable content sections. Only published sections appear on the
          live site.
        </p>
        <div className="mt-5">
          <SectionsManager pageId={id} sections={sections} />
        </div>
      </div>
    </div>
  );
}
