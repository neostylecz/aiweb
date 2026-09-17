import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env";

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely.
 *
 * Server-only, and only for the small number of operations that genuinely
 * need to run outside RLS (e.g. checking recent contact-form submission
 * counts for rate limiting, where the submitter has no read access). Never
 * import this from a Client Component, and never use it as a shortcut
 * around writing a proper RLS policy.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
