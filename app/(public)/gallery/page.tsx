import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { AnimatedSection } from "@/components/public/animated-section";
import type { GalleryItem, Category } from "@/types";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our portfolio of photography and graphic design work.",
};

export default async function GalleryPage() {
  const supabase = await createClient();
  const [galleryRes, categoriesRes] = await Promise.all([
    supabase
      .from("gallery")
      .select("*, category:categories(*)")
      .eq("is_published", true)
      .order("sort_order"),
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  const gallery = (galleryRes.data as GalleryItem[]) ?? [];
  const categories = (categoriesRes.data as Category[]) ?? [];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">Gallery</h1>
            <p className="mt-3 text-muted-foreground">
              Explore our portfolio — click any image to view full size.
            </p>
          </div>
        </AnimatedSection>
        <GalleryGrid
          items={gallery}
          categories={categories}
          showFilter={categories.length > 0}
        />
      </div>
    </div>
  );
}
