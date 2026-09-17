import { CheckCircle2, AlertCircle } from "lucide-react";

export function FormStatusBanner({
  status,
  message,
}: {
  status?: "idle" | "success" | "error";
  message?: string;
}) {
  if (!status || status === "idle" || !message) return null;

  if (status === "success") {
    return (
      <p className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="size-4 shrink-0" />
        {message}
      </p>
    );
  }

  return (
    <p className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="size-4 shrink-0" />
      {message}
    </p>
  );
}
