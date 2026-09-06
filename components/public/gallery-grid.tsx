"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";
import type { Category, GalleryItem } from "@/types";

type Props = {
  items: GalleryItem[];
  categories?: Category[];
  showFilter?: boolean;
  linkToFullGallery?: boolean;
  initialCategory?: string;
};

export function GalleryGrid({
  items,
  categories = [],
  showFilter = false,
  linkToFullGallery = false,
  initialCategory,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory ?? "all"
  );
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category?.slug === activeCategory);

  const slides = filtered.map((item) => ({
    src: getCloudinaryUrl(item.public_id, {
      width: 1600,
      crop: "limit",
      format: "auto",
      quality: "auto",
    }),
    alt: item.alt_text || item.title || "",
    title: item.title ?? undefined,
    description: item.caption ?? undefined,
  }));

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        No images yet — check back soon!
      </div>
    );
  }

  return (
    <div>
      {/* Category filter tabs */}
      {showFilter && (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Masonry-style grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          No images in this category yet.
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((item, index) => (
            <div
              key={item.id}
              className="break-inside-avoid overflow-hidden rounded-lg cursor-pointer group relative"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={getCloudinaryUrl(item.public_id, {
                  width: 600,
                  format: "auto",
                  quality: "auto",
                  crop: "limit",
                })}
                alt={item.alt_text || item.title || "Gallery image"}
                width={item.width ?? 600}
                height={item.height ?? 400}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {(item.title || item.caption) && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  {item.title && (
                    <p className="text-white text-sm font-medium">{item.title}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Link to full gallery */}
      {linkToFullGallery && (
        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="rounded-md border border-input px-6 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            View Full Gallery
          </Link>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
    </div>
  );
}
