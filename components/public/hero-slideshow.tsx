"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = { src: string; alt: string };

type Props = {
  slides: Slide[];
  heading?: string | null;
  subheading?: string | null;
  whatsappPhone?: string | null;
};

const INTERVAL_MS = 4500;

export function HeroSlideshow({ slides, heading, subheading }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance every INTERVAL_MS unless hovered
  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  function prev() {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }
  function next() {
    setCurrent((c) => (c + 1) % slides.length);
  }

  return (
    <section
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-muted"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide images — fade in/out */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover opacity-60"
          />
        </div>
      ))}

      {/* Text content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {heading ?? "Professional Photography & Design"}
        </h1>
        {subheading && (
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
            {subheading}
          </p>
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/gallery"
            className="rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            View Gallery
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-input bg-background px-8 py-3 text-sm font-semibold hover:bg-accent transition-colors"
          >
            Book a Session
          </Link>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-background/80 border p-2 hover:bg-background transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-background/80 border p-2 hover:bg-background transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-primary/40 hover:bg-primary/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
