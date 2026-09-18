"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white text-center font-sans text-black">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Something went wrong
          </p>
          <h1 className="mt-3 text-2xl font-semibold">The site failed to load</h1>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
