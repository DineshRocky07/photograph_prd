import { z } from "zod";

// ── Inquiry / Contact form ───────────────────────────────────

export const inquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .max(30, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  subject: z.string().max(200, "Subject is too long").optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

// ── Gallery ──────────────────────────────────────────────────

export const galleryItemSchema = z.object({
  category_id: z.string().uuid().nullable().optional(),
  title: z.string().max(200).optional().or(z.literal("")),
  alt_text: z.string().max(300).default(""),
  caption: z.string().max(500).optional().or(z.literal("")),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
});

export type GalleryItemFormData = z.infer<typeof galleryItemSchema>;

// ── Category ─────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and hyphens"),
  description: z.string().max(500).optional().or(z.literal("")),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// ── Service ──────────────────────────────────────────────────

export const serviceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  description: z.string().max(2000).optional().or(z.literal("")),
  price_hint: z.string().max(100).optional().or(z.literal("")),
  category_id: z.string().uuid().nullable().optional(),
  cover_public_id: z.string().optional().or(z.literal("")),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

// ── Testimonial ──────────────────────────────────────────────

export const testimonialSchema = z.object({
  client_name: z
    .string()
    .min(1, "Client name is required")
    .max(100, "Name is too long"),
  client_title: z.string().max(100).optional().or(z.literal("")),
  quote: z
    .string()
    .min(10, "Quote must be at least 10 characters")
    .max(1000, "Quote is too long"),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
  is_published: z.boolean().default(false),
  sort_order: z.number().int().min(0).default(0),
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;

// ── Site Settings ────────────────────────────────────────────

export const siteSettingsSchema = z.object({
  business_name: z.string().min(1, "Business name is required").max(200),
  tagline: z.string().max(300).default(""),
  logo_public_id: z.string().optional().or(z.literal("")),
  contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
  contact_phone: z.string().max(50).optional().or(z.literal("")),
  contact_address: z.string().max(500).optional().or(z.literal("")),
  social_instagram: z.string().url().optional().or(z.literal("")),
  social_facebook: z.string().url().optional().or(z.literal("")),
  social_twitter: z.string().url().optional().or(z.literal("")),
  social_youtube: z.string().url().optional().or(z.literal("")),
  social_linkedin: z.string().url().optional().or(z.literal("")),
  social_pinterest: z.string().url().optional().or(z.literal("")),
  hero_heading: z.string().min(1, "Hero heading is required").max(200),
  hero_subheading: z.string().max(500).optional().or(z.literal("")),
  hero_image_public_id: z.string().optional().or(z.literal("")),
  about_heading: z.string().min(1, "About heading is required").max(200),
  about_body: z.string().max(5000).optional().or(z.literal("")),
  about_image_public_id: z.string().optional().or(z.literal("")),
  meta_description: z.string().max(300).optional().or(z.literal("")),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

// ── Inquiry status update ─────────────────────────────────────

export const inquiryStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "in_progress", "completed", "cancelled"]),
});
