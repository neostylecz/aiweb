import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { listPages } from "@/lib/queries/pages";
import { deletePage } from "@/app/actions/pages";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/admin/status-pill";
import { DeleteButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const supabase = await createClient();
  const pages = await listPages(supabase);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2 text-foreground">Pages</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage pages and their content sections.
          </p>
        </div>
        <Button href="/admin/pages/new" className="gap-2">
          <Plus className="size-4" /> New page
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pages.map((page) => (
              <tr key={page.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="font-medium text-foreground hover:text-accent"
                  >
                    {page.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">/{page.slug === "home" ? "" : page.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={page.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton action={deletePage.bind(null, page.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
