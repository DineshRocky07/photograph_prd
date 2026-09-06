import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { FloatingWhatsApp } from "@/components/public/floating-whatsapp";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";
import type { SiteSettings } from "@/types";

// Default fallback settings so the site never crashes if DB is empty
const DEFAULT_SETTINGS: SiteSettings = {
  id: "",
  business_name: "Bala Photography",
  tagline: "Capturing moments that last forever",
  logo_public_id: null,
  favicon_public_id: null,
  contact_email: null,
  contact_phone: null,
  contact_address: null,
  social_instagram: null,
  social_facebook: null,
  social_twitter: null,
  social_youtube: null,
  social_linkedin: null,
  social_pinterest: null,
  hero_heading: "Professional Photography & Graphic Design",
  hero_subheading: null,
  hero_image_public_id: null,
  about_heading: "About Us",
  about_body: null,
  about_image_public_id: null,
  meta_description: null,
  og_image_public_id: null,
  created_at: "",
  updated_at: "",
};

async function getSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .single();
  return (data as SiteSettings) ?? DEFAULT_SETTINGS;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://photograph-prd.vercel.app";

  const ogImageUrl = settings.og_image_public_id
    ? getCloudinaryUrl(settings.og_image_public_id, {
        width: 1200,
        height: 630,
        crop: "fill",
        format: "jpg",
      })
    : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      template: `%s | ${settings.business_name}`,
      default: `${settings.business_name} — ${settings.tagline}`,
    },
    description: settings.meta_description ?? settings.tagline,
    openGraph: {
      title: `${settings.business_name} — ${settings.tagline}`,
      description: settings.meta_description ?? settings.tagline,
      siteName: settings.business_name,
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.business_name} — ${settings.tagline}`,
      description: settings.meta_description ?? settings.tagline,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp phone={settings.contact_phone} businessName={settings.business_name} />
    </div>
  );
}
