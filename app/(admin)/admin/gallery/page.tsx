import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { GalleryUploader } from "./gallery-uploader";
import { GalleryManager } from "./gallery-manager";
import type { GalleryItem, Category } from "@/types";

export const metadata: Metadata = { title: "Gallery | Admin" };

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const [galleryRes, categoriesRes] = await Promise.all([
    supabase
      .from("gallery")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
  ]);

  const gallery = (galleryRes.data as GalleryItem[]) ?? [];
  const categories = (categoriesRes.data as Category[]) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gallery</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {gallery.length} image{gallery.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {/* Upload section */}
      <section className="mb-10 rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-4">Upload Images</h2>
        <GalleryUploader />
      </section>

      {/* Manage section */}
      <section>
        <h2 className="font-semibold mb-4">Manage Images</h2>
        <GalleryManager items={gallery} categories={categories} />
      </section>
    </div>
  );
}
