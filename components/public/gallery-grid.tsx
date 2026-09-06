"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Maximize2, ArrowRight } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";
import type { Category, GalleryItem } from "@/types";

type Props = {
  items: GalleryItem[];
  categories?: Category[];
  showFilter?: boolean;
  linkToFullGallery?: boolean;
  initialCategory?: string;
};

// Automatic emoji mapping for popular photography categories
const CATEGORY_ICONS: Record<string, string> = {
  all: "✦",
  birthday: "🎂",
  birthdays: "🎂",
  model: "💃",
  modeling: "💃",
  "new home": "🏡",
  "new-home": "🏡",
  wedding: "💍",
  weddings: "💍",
  family: "👨‍👩‍👧‍👦",
  corporate: "💼",
  portrait: "📸",
  portraits: "📸",
  event: "🎉",
  events: "🎉",
};

function getCategoryIcon(name: string): string {
  const lower = name.toLowerCase().trim();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "📷";
}

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

  return (
    <div className="w-full">
      {/* Category Filter Bar (Matching Sample in Image 1) */}
      {showFilter && (
        <div className="mb-8 sm:mb-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveCategory("all")}
            className={`relative px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold tracking-widest uppercase transition-all ${
              activeCategory === "all"
                ? "text-[#dfb15b]"
                : "text-white/60 hover:text-white"
            }`}
          >
            ALL
            {activeCategory === "all" && (
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#c59b27]" />
            )}
          </button>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            const icon = getCategoryIcon(cat.name);
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`relative flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold tracking-widest uppercase transition-all ${
                  isActive
                    ? "text-[#dfb15b]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span>{icon}</span>
                <span>{cat.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#c59b27]" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Gallery Grid (Matching 4-column sample layout) */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-white/50">
          <p className="font-serif text-lg">No photos in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((item, index) => {
            const categoryName = item.category?.name || "PORTFOLIO";
            const categoryIcon = getCategoryIcon(categoryName);
            const displayTitle = item.title || `BALA_${index + 1}`;

            return (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden rounded-sm bg-[#121212] border border-white/10 cursor-pointer transition-all duration-300 hover:border-[#c59b27]/70 hover:shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
              >
                <Image
                  src={getCloudinaryUrl(item.public_id, {
                    width: 700,
                    height: 900,
                    crop: "fill",
                    gravity: "auto",
                    format: "auto",
                    quality: "auto",
                  })}
                  alt={item.alt_text || item.title || "Gallery image"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 opacity-40 group-hover:opacity-85 transition-opacity" />

                {/* Top-right expand icon */}
                <div className="absolute top-3 right-3 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-sm bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 hover:border-[#c59b27] hover:text-[#dfb15b]">
                  <Maximize2 className="h-3.5 w-3.5" />
                </div>

                {/* Bottom label matching sample: title + category badge */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 z-10 flex flex-col gap-1 translate-y-1 sm:translate-y-2 group-hover:translate-y-0 transition-transform">
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-white/95 truncate">
                    {displayTitle}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#dfb15b]">
                    <span>{categoryIcon}</span>
                    <span>{categoryName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Explore Full Gallery Button */}
      {linkToFullGallery && (
        <div className="mt-10 sm:mt-14 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-3 rounded-sm border border-white/20 bg-black/60 px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:border-[#c59b27] hover:text-[#dfb15b] hover:shadow-[0_0_20px_rgba(197,155,39,0.25)]"
          >
            <span>EXPLORE FULL GALLERY</span>
            <ArrowRight className="h-4 w-4" />
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
