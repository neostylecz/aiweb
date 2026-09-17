import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listAllServices } from "@/lib/queries/services";
import { deleteService, moveServiceOrder } from "@/app/actions/services";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/admin/status-pill";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const services = await listAllServices(supabase);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2 text-foreground">Services</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage the services shown on your site.
          </p>
        </div>
        <Button href="/admin/services/new" className="gap-2">
          <Plus className="size-4" /> New service
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="w-12 px-4 py-3" />
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((service, index) => (
              <tr key={service.id}>
                <td className="px-4 py-3">
                  <ReorderButtons
                    disableUp={index === 0}
                    disableDown={index === services.length - 1}
                    onMoveUp={moveServiceOrder.bind(null, service.id, "up")}
                    onMoveDown={moveServiceOrder.bind(null, service.id, "down")}
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/services/${service.id}`}
                    className="font-medium text-foreground hover:text-accent"
                  >
                    {service.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">/{service.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={service.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton action={deleteService.bind(null, service.id)} />
                </td>
              </tr>
            ))}
            {services.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  No services yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
