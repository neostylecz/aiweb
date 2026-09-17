import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Logo } from "@/components/layout/logo";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background p-5 lg:flex">
          <Logo />
          <div className="mt-8 flex-1">
            <AdminSidebar />
          </div>
          <div className="space-y-1 border-t border-border pt-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ExternalLink className="size-4" />
              View site
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
