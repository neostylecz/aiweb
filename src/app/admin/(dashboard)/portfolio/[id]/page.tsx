import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPortfolioItemAdminById } from "@/lib/queries/portfolio";
import { listAllServices } from "@/lib/queries/services";
import { PortfolioForm } from "../portfolio-form";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditPortfolioItemPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const [item, allServices] = await Promise.all([
    getPortfolioItemAdminById(supabase, id),
    listAllServices(supabase),
  ]);

  if (!item) notFound();

  return (
    <div>
      <h1 className="heading-2 text-foreground">Edit portfolio item</h1>
      <div className="mt-8">
        <PortfolioForm
          item={item}
          allServices={allServices}
          initialServiceIds={item.serviceIds}
          initialGallery={item.gallery.map((g) => g.media).filter(Boolean)}
        />
      </div>
    </div>
  );
}
