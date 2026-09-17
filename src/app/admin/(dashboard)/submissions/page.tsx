import { createClient } from "@/lib/supabase/server";
import { SubmissionRow } from "@/components/admin/submission-row";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const supabase = await createClient();
  const { data: submissions } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="heading-2 text-foreground">Contact submissions</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Messages sent through the public contact form.
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-background">
        {submissions && submissions.length > 0 ? (
          submissions.map((submission) => (
            <SubmissionRow key={submission.id} submission={submission} />
          ))
        ) : (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            No submissions yet.
          </p>
        )}
      </div>
    </div>
  );
}
