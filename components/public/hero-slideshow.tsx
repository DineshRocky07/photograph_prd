"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

type Slide = { src: string; alt: string };

type Props = {
  slides: Slide[];
  heading?: string | null;
  subheading?: string | null;
  whatsappPhone?: string | null;
};

const INTERVAL_MS = 4500;

export function HeroSlideshow({ slides, whatsappPhone }: Props) {
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

  // Touch swipe support for mobile
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

  // Format phone for direct WhatsApp chat
  const cleanPhone = whatsappPhone?.replace(/[^0-9]/g, "") || "";
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=Hi%20Bala%20Photography,%20I%20would%20like%20to%20inquire%20about%20a%20photo%20shoot.`
    : "/contact";

  return (
    <section
      className="relative flex min-h-[85vh] sm:min-h-[92vh] w-full items-center justify-center overflow-hidden bg-[#080808]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides — Full HD (No milky fade!) */}
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
            {/* Cinematic subtle gradients: darker at bottom/top for readability, crystal clear in center */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        );
      })}

      {/* Main Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24 text-center flex flex-col items-center">
        {/* Award-winning badge */}
        <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-[#c59b27]/50 bg-black/50 backdrop-blur-md px-4 py-1 sm:px-5 sm:py-1.5 shadow-[0_0_15px_rgba(197,155,39,0.2)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#dfb15b] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#dfb15b]">
            AWARD-WINNING PHOTOGRAPHY STUDIO
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#dfb15b] animate-pulse" />
        </div>

        {/* Hero Title Matching Sample: Scaled responsibly for mobile so it never covers the face */}
        <div className="max-w-4xl space-y-0.5 sm:space-y-2">
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-md">
            Moments That
          </h1>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl italic font-normal text-[#dfb15b] tracking-tight drop-shadow-[0_2px_15px_rgba(197,155,39,0.3)]">
            Last Forever
          </h2>
        </div>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-[11px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-white/80">
          EVERY MOMENT EVERY STORY
        </p>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center max-w-xs sm:max-w-none">
          <Link
            href="/gallery"
            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-sm bg-[#c59b27] px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#dfb15b] hover:shadow-[0_0_25px_rgba(197,155,39,0.4)]"
          >
            <Camera className="h-4 w-4" />
            <span>VIEW OUR WORK</span>
          </Link>

          <a
            href={whatsappUrl}
            target={cleanPhone ? "_blank" : undefined}
            rel={cleanPhone ? "noopener noreferrer" : undefined}
            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-sm border border-white/20 bg-black/50 backdrop-blur-md px-6 sm:px-8 py-3 sm:py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:border-white/50"
          >
            <MessageCircle className="h-4 w-4 text-[#dfb15b]" />
            <span>WHATSAPP US</span>
          </a>
        </div>
      </div>

      {/* Side Arrow Navigation (Hidden on mobile so it never covers the person's face/ears!) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:border-[#c59b27] hover:text-[#dfb15b] hover:bg-black/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:border-[#c59b27] hover:text-[#dfb15b] hover:bg-black/70"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Sleek bottom indicator dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-500 ${
                idx === current
                  ? "w-7 sm:w-8 h-1.5 rounded-full bg-[#dfb15b] shadow-[0_0_8px_rgba(223,177,91,0.6)]"
                  : "w-2 h-1.5 rounded-full bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
