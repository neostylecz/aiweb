import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only");

export const statusSchema = z.enum(["draft", "published"]);

export const serviceSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: slugSchema,
  short_description: z.string().trim().max(500).optional().or(z.literal("")),
  full_description: z.string().trim().max(10000).optional().or(z.literal("")),
  icon: z.string().trim().max(100).optional().or(z.literal("")),
  image_id: z.string().uuid().nullable().optional(),
  seo_title: z.string().trim().max(200).optional().or(z.literal("")),
  seo_description: z.string().trim().max(500).optional().or(z.literal("")),
  status: statusSchema,
  display_order: z.coerce.number().int().min(0).default(0),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const portfolioItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: slugSchema,
  client_name: z.string().trim().max(200).optional().or(z.literal("")),
  short_description: z.string().trim().max(500).optional().or(z.literal("")),
  full_description: z.string().trim().max(10000).optional().or(z.literal("")),
  featured_image_id: z.string().uuid().nullable().optional(),
  project_url: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^https?:\/\//.test(val), {
      message: "URL must start with http:// or https://",
    }),
  published_date: z.string().trim().optional().or(z.literal("")),
  seo_title: z.string().trim().max(200).optional().or(z.literal("")),
  seo_description: z.string().trim().max(500).optional().or(z.literal("")),
  status: statusSchema,
  display_order: z.coerce.number().int().min(0).default(0),
  service_ids: z.array(z.string().uuid()).default([]),
  gallery_media_ids: z.array(z.string().uuid()).default([]),
});

export type PortfolioItemFormValues = z.infer<typeof portfolioItemSchema>;

export const pageSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: slugSchema,
  status: statusSchema,
  seo_title: z.string().trim().max(200).optional().or(z.literal("")),
  seo_description: z.string().trim().max(500).optional().or(z.literal("")),
  seo_canonical_url: z.string().trim().max(500).optional().or(z.literal("")),
  seo_og_image_id: z.string().uuid().nullable().optional(),
  seo_no_index: z.boolean().default(false),
});

export type PageFormValues = z.infer<typeof pageSchema>;

export const contactInfoSchema = z.object({
  company_name: z.string().trim().max(200).optional().or(z.literal("")),
  address: z.string().trim().max(1000).optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  email: z.string().trim().max(320).optional().or(z.literal("")),
  company_id: z.string().trim().max(50).optional().or(z.literal("")),
  vat_id: z.string().trim().max(50).optional().or(z.literal("")),
  social_links: z
    .array(
      z.object({
        platform: z.string().trim().min(1),
        url: z.string().trim().min(1),
      }),
    )
    .default([]),
});

export type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

export const siteSettingsSchema = z.object({
  site_name: z.string().trim().min(1).max(200),
  default_seo_title: z.string().trim().max(200).optional().or(z.literal("")),
  default_seo_description: z.string().trim().max(500).optional().or(z.literal("")),
  default_og_image_id: z.string().uuid().nullable().optional(),
  robots_index: z.boolean().default(true),
  google_site_verification: z.string().trim().max(200).optional().or(z.literal("")),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;

export const mediaAltTextSchema = z.object({
  alt_text: z.string().trim().max(300),
});
