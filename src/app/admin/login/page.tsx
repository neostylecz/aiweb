import type { Metadata } from "next";
import { Logo } from "@/components/layout/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-sm">
        <Logo className="mx-auto block w-fit" />
        <h1 className="heading-3 mt-6 text-center text-foreground">Admin sign in</h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          Sign in to manage NEOAIWEBY&apos;s content.
        </p>

        <div className="mt-8">
          <LoginForm next={next} />
        </div>
      </div>
    </div>
  );
}
