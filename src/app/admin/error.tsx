"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
      <p className="eyebrow mb-4">Something went wrong</p>
      <h1 className="heading-3 text-foreground">The admin area hit an error</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Check your Supabase connection and environment variables, then try again.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/admin" variant="outline">
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
