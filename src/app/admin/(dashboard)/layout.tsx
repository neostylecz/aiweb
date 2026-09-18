import Link from "next/link";
import { LogOut, ExternalLink, Menu } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Logo } from "@/components/layout/logo";

function SidebarFooterLinks() {
  return (
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
  );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      {/* Admin is optimized for desktop; this collapsible bar keeps it at least
          usable on smaller screens instead of hiding navigation entirely. */}
      <details className="sticky top-0 z-40 border-b border-border bg-background lg:hidden">
        <summary className="flex list-none items-center justify-between px-4 py-3 [&::-webkit-details-marker]:hidden">
          <Logo />
          <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <Menu className="size-4" /> Menu
          </span>
        </summary>
        <div className="border-t border-border p-4">
          <AdminSidebar />
          <div className="mt-4">
            <SidebarFooterLinks />
          </div>
        </div>
      </details>

      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background p-5 lg:flex">
          <Logo />
          <div className="mt-8 flex-1">
            <AdminSidebar />
          </div>
          <SidebarFooterLinks />
        </aside>

        <main className="min-w-0 flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
