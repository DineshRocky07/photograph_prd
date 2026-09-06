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
  showFilter = true,
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
        No images yet — upload photos in the admin panel to display them here!
      </div>
    );
  }

  return (
    <div>
      {/* Category filter tabs — Clean modern pill buttons */}
      {showFilter && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid — Clean, responsive layout */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          No images in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item, index) => (
            <div
              key={item.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-muted cursor-pointer border hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={getCloudinaryUrl(item.public_id, {
                  width: 700,
                  height: 900,
                  format: "auto",
                  quality: "auto",
                  crop: "fill",
                  gravity: "auto",
                })}
                alt={item.alt_text || item.title || "Gallery image"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {/* Subtle hover gradient with title and category */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                {item.title && (
                  <p className="text-white text-sm font-semibold truncate">
                    {item.title}
                  </p>
                )}
                {item.category?.name && (
                  <p className="text-white/80 text-xs mt-0.5">
                    {item.category.name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link to full gallery */}
      {linkToFullGallery && (
        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium hover:bg-accent transition-colors shadow-sm"
          >
            View Full Gallery
          </Link>
        </div>
      )}

      {/* Fullscreen Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
    </div>
  );
}
