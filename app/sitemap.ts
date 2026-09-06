import { createStaticClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://balaphoto.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use static client — sitemap runs at build time without an HTTP request
  const supabase = createStaticClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at")
    .eq("is_active", true);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.7 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map(
    (cat: { slug: string; updated_at: string }) => ({
      url: `${BASE_URL}/gallery/${cat.slug}`,
      lastModified: new Date(cat.updated_at),
      priority: 0.7,
    })
  );

  return [...staticRoutes, ...categoryRoutes];
}
