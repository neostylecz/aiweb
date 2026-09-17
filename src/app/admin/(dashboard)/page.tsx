import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: pagesCount }, { count: servicesCount }, { count: portfolioCount }, { count: newSubmissionsCount }] =
    await Promise.all([
      supabase.from("pages").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
      supabase
        .from("contact_submissions")
        .select("*", { count: "exact", head: true })
        .eq("status", "new"),
    ]);

  const stats = [
    { label: "Pages", value: pagesCount ?? 0, href: "/admin/pages" },
    { label: "Services", value: servicesCount ?? 0, href: "/admin/services" },
    { label: "Portfolio items", value: portfolioCount ?? 0, href: "/admin/portfolio" },
    { label: "New submissions", value: newSubmissionsCount ?? 0, href: "/admin/submissions" },
  ];

  return (
    <div>
      <h1 className="heading-2 text-foreground">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A quick overview of your site content.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:border-accent">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="font-display mt-2 text-3xl font-semibold text-foreground">
                {stat.value}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
