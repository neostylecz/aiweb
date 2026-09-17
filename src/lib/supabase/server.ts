import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./types";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/**
 * Server-side Supabase client (anon key, respects RLS + the current user's
 * session cookies). Use this in Server Components, Route Handlers, and
 * Server Actions. Safe for both public reads and authenticated admin reads,
 * since RLS decides what each caller can see.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component without a mutable cookie jar
          // (e.g. during rendering). Safe to ignore: middleware refreshes
          // the session on every request.
        }
      },
    },
  });
}
