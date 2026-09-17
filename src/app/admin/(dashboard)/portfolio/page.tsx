import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listAllPortfolioItems } from "@/lib/queries/portfolio";
import { deletePortfolioItem, movePortfolioOrder } from "@/app/actions/portfolio";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/admin/status-pill";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReorderButtons } from "@/components/admin/reorder-buttons";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const supabase = await createClient();
  const items = await listAllPortfolioItems(supabase);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2 text-foreground">Portfolio</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage projects and case studies.
          </p>
        </div>
        <Button href="/admin/portfolio/new" className="gap-2">
          <Plus className="size-4" /> New project
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="w-12 px-4 py-3" />
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <ReorderButtons
                    disableUp={index === 0}
                    disableDown={index === items.length - 1}
                    onMoveUp={movePortfolioOrder.bind(null, item.id, "up")}
                    onMoveDown={movePortfolioOrder.bind(null, item.id, "down")}
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/portfolio/${item.id}`}
                    className="font-medium text-foreground hover:text-accent"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">/{item.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.client_name}</td>
                <td className="px-4 py-3">
                  <StatusPill status={item.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton action={deletePortfolioItem.bind(null, item.id)} />
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No portfolio items yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
