"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";
import { contactFormSchema } from "@/lib/validation/contact";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: ContactFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {pending ? "Sending…" : "Send message"}
    </Button>
  );
}

const fieldClass =
  "w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/30";

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [renderedAt] = useState(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const values = {
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      company: formData.get("company")?.toString() ?? "",
      message: formData.get("message")?.toString() ?? "",
      consent: formData.get("consent") === "on",
      website: "",
      renderedAt,
    };

    const result = contactFormSchema.safeParse(values);

    if (!result.success) {
      event.preventDefault();
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (key && !errors[key]) errors[key] = issue.message;
      }
      setClientErrors(errors);
      return;
    }

    setClientErrors({});
  }

  if (state.status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-6">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
        <div>
          <p className="font-medium text-foreground">Message sent</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {state.message ?? "Thanks for reaching out — we'll get back to you shortly."}
          </p>
        </div>
      </div>
    );
  }

  const errors = { ...clientErrors, ...state.fieldErrors };

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot field - hidden from real visitors via CSS, not display:none
          (which some bots skip when filling forms). */}
      <div className="pointer-events-none absolute size-0 overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="renderedAt" value={renderedAt} />

      {state.status === "error" && state.message ? (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {state.message}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
            Name <span aria-hidden="true">*</span>
          </label>
          <input id="name" name="name" type="text" required className={fieldClass} />
          {errors.name ? <p className="mt-1.5 text-xs text-red-500">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
            Email <span aria-hidden="true">*</span>
          </label>
          <input id="email" name="email" type="email" required className={fieldClass} />
          {errors.email ? <p className="mt-1.5 text-xs text-red-500">{errors.email}</p> : null}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className={fieldClass} />
          {errors.phone ? <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p> : null}
        </div>

        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-foreground">
            Company
          </label>
          <input id="company" name="company" type="text" className={fieldClass} />
          {errors.company ? (
            <p className="mt-1.5 text-xs text-red-500">{errors.company}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={cn(fieldClass, "resize-none")}
        />
        {errors.message ? <p className="mt-1.5 text-xs text-red-500">{errors.message}</p> : null}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            name="consent"
            type="checkbox"
            required
            className="mt-0.5 size-4 rounded border-border text-accent focus:ring-ring/30"
          />
          <span>
            I agree that NEOAIWEBY may process my personal data to respond to my message, in line
            with the privacy policy.
          </span>
        </label>
        {errors.consent ? <p className="mt-1.5 text-xs text-red-500">{errors.consent}</p> : null}
      </div>

      <SubmitButton />
    </form>
  );
}
