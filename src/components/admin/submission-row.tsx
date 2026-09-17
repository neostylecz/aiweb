"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { updateSubmissionStatus, deleteSubmission } from "@/app/actions/submissions";
import { DeleteButton } from "@/components/admin/delete-button";
import { Select } from "@/components/admin/form-field";
import { cn, formatDate } from "@/lib/utils";
import type { Database } from "@/lib/supabase/types";

type Submission = Database["public"]["Tables"]["contact_submissions"]["Row"];

export function SubmissionRow({ submission }: { submission: Submission }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className={cn("border-b border-border last:border-0", submission.status === "new" && "bg-accent/5")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-4 py-4 text-left"
      >
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {submission.name} <span className="font-normal text-muted-foreground">— {submission.email}</span>
          </p>
          <p className="truncate text-xs text-muted-foreground">{submission.message}</p>
        </div>
        <p className="shrink-0 text-xs text-muted-foreground">
          {formatDate(submission.created_at)}
        </p>
      </button>

      {open ? (
        <div className="space-y-3 px-4 pb-4 pl-11 text-sm">
          <p className="whitespace-pre-wrap text-foreground">{submission.message}</p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground sm:grid-cols-4">
            {submission.phone ? (
              <div>
                <dt className="font-medium text-foreground">Phone</dt>
                <dd>{submission.phone}</dd>
              </div>
            ) : null}
            {submission.company ? (
              <div>
                <dt className="font-medium text-foreground">Company</dt>
                <dd>{submission.company}</dd>
              </div>
            ) : null}
            <div>
              <dt className="font-medium text-foreground">Consent</dt>
              <dd>{submission.consent ? "Yes" : "No"}</dd>
            </div>
          </dl>

          <div className="flex items-center justify-between pt-2">
            <div className="w-40">
              <Select
                defaultValue={submission.status}
                disabled={isPending}
                onChange={(e) =>
                  startTransition(() =>
                    updateSubmissionStatus(submission.id, e.target.value as Submission["status"]),
                  )
                }
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
            <DeleteButton action={deleteSubmission.bind(null, submission.id)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
