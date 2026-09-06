import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient, createStaticClient } from "@/lib/supabase/server";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { AnimatedSection } from "@/components/public/animated-section";
import type { GalleryItem, Category } from "@/types";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  // Use static client — generateMetadata may run at build time
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Category Not Found" };

  return {
    title: data.name,
    description: data.description ?? `Browse our ${data.name} photography portfolio.`,
  };
}

export async function generateStaticParams() {
  // Must use static client — cookies() is not available at build time
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("categories")
    .select("slug")
    .eq("is_active", true);

  return (data ?? []).map((cat: { slug: string }) => ({ category: cat.slug }));
}

export default async function CategoryGalleryPage({ params }: Props) {
  const { category: slug } = await params;
  const supabase = await createClient();

  const [categoryRes, galleryRes] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single(),
    supabase
      .from("gallery")
      .select("*, category:categories(*)")
      .eq("is_published", true)
      .order("sort_order"),
  ]);

  if (!categoryRes.data) notFound();

  const category = categoryRes.data as Category;
  const allItems = (galleryRes.data as GalleryItem[]) ?? [];
  const filtered = allItems.filter((item) => item.category?.slug === slug);

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">{category.name}</h1>
            {category.description && (
              <p className="mt-3 text-muted-foreground">{category.description}</p>
            )}
          </div>
        </AnimatedSection>
        <GalleryGrid items={filtered} initialCategory={slug} />
      </div>
    </div>
  );
}
