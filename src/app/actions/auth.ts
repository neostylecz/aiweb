"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignInState = {
  status: "idle" | "error";
  message?: string;
};

export async function signIn(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const next = formData.get("next")?.toString() || "/admin";

  if (!email || !password) {
    return { status: "error", message: "Please enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: "Invalid email or password." };
  }

  const { data } = await supabase.rpc("is_admin");
  if (!data) {
    await supabase.auth.signOut();
    return {
      status: "error",
      message: "This account is not authorized to access the admin area.",
    };
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
