import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getServiceById } from "@/lib/queries/services";
import { ServiceForm } from "../service-form";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const service = await getServiceById(supabase, id);

  if (!service) notFound();

  return (
    <div>
      <h1 className="heading-2 text-foreground">Edit service</h1>
      <div className="mt-8">
        <ServiceForm service={service} />
      </div>
    </div>
  );
}
