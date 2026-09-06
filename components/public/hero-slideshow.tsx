"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

type Slide = { src: string; alt: string };

type Props = {
  slides: Slide[];
  heading?: string | null;
  subheading?: string | null;
  whatsappPhone?: string | null;
};

const INTERVAL_MS = 4500;

export function HeroSlideshow({ slides, heading, subheading, whatsappPhone }: Props) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  function prevSlide() {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }

  function nextSlide() {
    setCurrent((prev) => (prev + 1) % slides.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 40) {
      nextSlide();
    } else if (diffX < -40) {
      prevSlide();
    }
    touchStartX.current = null;
  }

  const cleanPhone = whatsappPhone?.replace(/[^0-9]/g, "") || "";
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=Hi%20Bala%20Photography,%20I%20would%20like%20to%20inquire%20about%20a%20photoshoot.`
    : "/contact";

  return (
    <section
      className="relative flex min-h-[75vh] sm:min-h-[88vh] w-full items-end justify-center overflow-hidden bg-black select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides — 100% Full HD (Photo is the star, unobstructed!) */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={index === 0}
              className={`object-cover transition-transform duration-[6000ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
            />
            {/* Soft bottom vignette only so bottom buttons are crisp; center & top remain 100% clear! */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
          </div>
        );
      })}

      {/* Clean, unobtrusive bottom controls (photo is completely visible without big centered text blocking faces!) */}
      <div className="relative z-10 container mx-auto px-4 pb-12 sm:pb-16 text-center">
        {/* Subtle heading at the bottom if provided */}
        {(heading || subheading) && (
          <div className="max-w-2xl mx-auto mb-6 text-white drop-shadow-md">
            {heading && (
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
                {heading}
              </h1>
            )}
            {subheading && (
              <p className="mt-1 text-xs sm:text-sm text-white/90">
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons — sleek, modern, positioned neatly at bottom */}
        <div className="flex flex-row items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
          <Link
            href="/gallery"
            className="rounded-md bg-white text-black px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
          >
            View Gallery
          </Link>

          {cleanPhone ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#25D366] text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold hover:bg-[#20bd5a] transition-all shadow-lg"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <Link
              href="/contact"
              className="rounded-md bg-black/60 border border-white/40 text-white backdrop-blur-md px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold hover:bg-black/80 transition-all"
            >
              Book a Session
            </Link>
          )}
        </div>
      </div>

      {/* Desktop Side Arrows (Hidden on mobile so they never sit on subject's face/ears!) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white border border-white/20 backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white border border-white/20 backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Sleek bottom indicator dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === current
                  ? "w-6 h-1.5 bg-white shadow"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
