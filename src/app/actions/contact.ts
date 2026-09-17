"use server";

import { headers } from "next/headers";
import { contactFormSchema } from "@/lib/validation/contact";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkContactRateLimit, getClientIp, hashIp } from "@/lib/contact/rate-limit";
import { notifyNewContactSubmission } from "@/lib/notifications/contact";
import { fieldErrorsFromZod, type ActionState } from "@/lib/actions/types";

export type ContactFormState = ActionState;

const MIN_FILL_TIME_MS = 1500;

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    company: formData.get("company")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
    website: formData.get("website")?.toString() ?? "",
    renderedAt: Number(formData.get("renderedAt") ?? 0),
  };

  const parsed = contactFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFromZod(parsed.error),
    };
  }

  const values = parsed.data;

  // Honeypot: bots fill hidden fields. Pretend success without writing anything.
  if (values.website) {
    return { status: "success" };
  }

  // Bots typically submit near-instantly; humans take at least a second or two.
  if (values.renderedAt && Date.now() - values.renderedAt < MIN_FILL_TIME_MS) {
    return { status: "success" };
  }

  const headerList = await headers();
  const ip = getClientIp(headerList);
  const ipHash = hashIp(ip);
  const userAgent = headerList.get("user-agent") ?? null;

  const admin = createAdminClient();

  const rateLimitError = await checkContactRateLimit(admin, ipHash);
  if (rateLimitError) {
    return { status: "error", message: rateLimitError };
  }

  const { error } = await admin.from("contact_submissions").insert({
    name: values.name,
    email: values.email,
    phone: values.phone || null,
    company: values.company || null,
    message: values.message,
    consent: values.consent,
    ip_hash: ipHash,
    user_agent: userAgent,
  });

  if (error) {
    console.error("Failed to store contact submission", error);
    return {
      status: "error",
      message: "Something went wrong on our end. Please try again in a moment.",
    };
  }

  await notifyNewContactSubmission(values);

  return { status: "success", message: "Thanks — your message has been sent." };
}
