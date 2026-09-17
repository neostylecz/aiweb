import "server-only";

/**
 * Sends a notification when a new contact form submission arrives.
 *
 * No email provider is wired up yet. To add one (e.g. Resend):
 *   1. `npm install resend`
 *   2. Set RESEND_API_KEY and CONTACT_NOTIFICATION_TO_EMAIL in your env.
 *   3. Replace the body of this function with a call to the Resend SDK.
 *
 * Never throw from here - a failed notification should not fail the
 * contact form submission itself, which is already safely stored in
 * Supabase by the time this runs.
 */
export async function notifyNewContactSubmission(submission: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFICATION_TO_EMAIL;

  if (!apiKey || !to) {
    // Notifications are optional and unconfigured - nothing to do.
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NEOAIWEBY <notifications@neoaiweby.com>",
        to,
        subject: `New contact form submission from ${submission.name}`,
        text: `${submission.name} (${submission.email}) wrote:\n\n${submission.message}`,
      }),
    });
  } catch (error) {
    console.error("Failed to send contact notification email", error);
  }
}
