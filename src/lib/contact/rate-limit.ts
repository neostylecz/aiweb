import "server-only";

import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const WINDOW_MINUTES = 15;
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const MIN_SECONDS_BETWEEN_SUBMISSIONS = 20;

export function hashIp(ip: string): string {
  const pepper = process.env.CONTACT_FORM_IP_PEPPER ?? "";
  return createHash("sha256").update(`${pepper}:${ip}`).digest("hex");
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}

/**
 * Server-only rate-limit check backed by the contact_submissions table
 * itself (via the service-role client, which can read it despite RLS
 * blocking anon/select). Returns null when the submission is allowed, or a
 * user-facing error message when it should be rejected.
 */
export async function checkContactRateLimit(
  adminClient: SupabaseClient<Database>,
  ipHash: string,
): Promise<string | null> {
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

  const { data, error } = await adminClient
    .from("contact_submissions")
    .select("created_at")
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart)
    .order("created_at", { ascending: false });

  if (error) {
    // Fail open on infra errors rather than blocking legitimate visitors,
    // but log for visibility.
    console.error("contact rate limit check failed", error);
    return null;
  }

  if (!data || data.length === 0) return null;

  if (data.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    return "Too many messages sent recently. Please try again later.";
  }

  const mostRecent = new Date(data[0]!.created_at).getTime();
  if (Date.now() - mostRecent < MIN_SECONDS_BETWEEN_SUBMISSIONS * 1000) {
    return "Please wait a moment before sending another message.";
  }

  return null;
}
