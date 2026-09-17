"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SubmissionStatus } from "@/lib/supabase/types";

export async function updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<void> {
  const supabase = await createClient();
  await supabase.from("contact_submissions").update({ status }).eq("id", id);
  revalidatePath("/admin/submissions");
}

export async function deleteSubmission(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("contact_submissions").delete().eq("id", id);
  revalidatePath("/admin/submissions");
}
