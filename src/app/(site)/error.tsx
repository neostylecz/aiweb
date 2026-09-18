"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function SiteError({
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
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-4">Something went wrong</p>
      <h1 className="heading-2 text-foreground">This page couldn&apos;t load</h1>
      <p className="body-lg mt-4 max-w-md text-muted-foreground">
        Please try again in a moment. If the problem continues, contact us directly.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="outline">
          Go home
        </Button>
      </div>
    </Container>
  );
}
