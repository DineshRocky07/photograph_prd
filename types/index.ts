// ============================================================
// Shared TypeScript types derived from the database schema
// ============================================================

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryItem = {
  id: string;
  category_id: string | null;
  public_id: string;
  title: string | null;
  alt_text: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
  bytes: number | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category | null;
};

export type Service = {
  id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  price_hint: string | null;
  cover_public_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category | null;
};

export type InquiryStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "completed"
  | "cancelled";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: InquiryStatus;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  client_name: string;
  client_title: string | null;
  quote: string;
  rating: number | null;
  avatar_url: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: string;
  business_name: string;
  tagline: string;
  logo_public_id: string | null;
  favicon_public_id: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  social_twitter: string | null;
  social_youtube: string | null;
  social_linkedin: string | null;
  social_pinterest: string | null;
  hero_heading: string;
  hero_subheading: string | null;
  hero_image_public_id: string | null;
  about_heading: string;
  about_body: string | null;
  about_image_public_id: string | null;
  meta_description: string | null;
  og_image_public_id: string | null;
  created_at: string;
  updated_at: string;
};

// ── Derived / utility types ──────────────────────────────────

export type InquiryStatusLabel = Record<InquiryStatus, string>;

export const INQUIRY_STATUS_LABELS: InquiryStatusLabel = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};
