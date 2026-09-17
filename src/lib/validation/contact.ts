import { z } from "zod";

// Shared client + server validation for the public contact form.
export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(200),
  email: z.string().trim().min(3).max(320).email("Please enter a valid email address"),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please enter a message (at least 10 characters)").max(5000),
  consent: z.boolean().refine((value) => value === true, {
    message: "Please accept the privacy policy to continue",
  }),
  // Honeypot field: real visitors never see or fill this in.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
  // Epoch ms when the form was rendered; used to reject too-fast submissions.
  renderedAt: z.number().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
