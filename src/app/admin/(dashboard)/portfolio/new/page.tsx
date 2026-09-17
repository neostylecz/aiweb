import { createClient } from "@/lib/supabase/server";
import { listAllServices } from "@/lib/queries/services";
import { PortfolioForm } from "../portfolio-form";

export const dynamic = "force-dynamic";

export default async function NewPortfolioItemPage() {
  const supabase = await createClient();
  const allServices = await listAllServices(supabase);

  return (
    <div>
      <h1 className="heading-2 text-foreground">New portfolio item</h1>
      <div className="mt-8">
        <PortfolioForm allServices={allServices} />
      </div>
    </div>
  );
}
