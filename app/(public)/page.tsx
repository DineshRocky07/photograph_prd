import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { AnimatedSection } from "@/components/public/animated-section";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { HeroSlideshow } from "@/components/public/hero-slideshow";
import type { SiteSettings, Service, GalleryItem, Testimonial, Category } from "@/types";

async function getHomeData() {
  const supabase = await createClient();

  const [settingsRes, servicesRes, galleryRes, testimonialsRes, categoriesRes, heroRes] =
    await Promise.all([
      supabase.from("site_settings").select("*").single(),
      supabase
        .from("services")
        .select("*, category:categories(*)")
        .eq("is_active", true)
        .order("sort_order")
        .limit(6),
      supabase
        .from("gallery")
        .select("*, category:categories(*)")
        .eq("is_published", true)
        .order("sort_order")
        .limit(16),
      supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("sort_order")
        .limit(6),
      supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order"),
      // Up to 5 published photos for the hero slideshow
      supabase
        .from("gallery")
        .select("public_id, alt_text, title")
        .eq("is_published", true)
        .order("sort_order")
        .limit(5),
    ]);

  return {
    settings: (settingsRes.data as SiteSettings) ?? null,
    services: (servicesRes.data as Service[]) ?? [],
    gallery: (galleryRes.data as GalleryItem[]) ?? [],
    testimonials: (testimonialsRes.data as Testimonial[]) ?? [],
    categories: (categoriesRes.data as Category[]) ?? [],
    heroImages: (heroRes.data as Pick<GalleryItem, "public_id" | "alt_text" | "title">[]) ?? [],
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("business_name, tagline, meta_description")
    .single();

  return {
    title: settings?.business_name ?? "Bala Photography",
    description: settings?.meta_description ?? settings?.tagline ?? "Professional photography studio.",
  };
}

export default async function HomePage() {
  const { settings, services, gallery, testimonials, categories, heroImages } =
    await getHomeData();

  // Build slides: up to 5 published gallery images, or fallback to settings hero image
  let slides: { src: string; alt: string }[] = heroImages.map((img) => ({
    src: getCloudinaryUrl(img.public_id, {
      width: 1920,
      height: 1080,
      crop: "fill",
      gravity: "auto",
      format: "auto",
      quality: "auto",
    }),
    alt: img.alt_text || img.title || "Hero image",
  }));

  if (slides.length === 0 && settings?.hero_image_public_id) {
    slides = [
      {
        src: getCloudinaryUrl(settings.hero_image_public_id, {
          width: 1920,
          height: 1080,
          crop: "fill",
          gravity: "auto",
          format: "auto",
          quality: "auto",
        }),
        alt: settings.business_name ?? "Hero image",
      },
    ];
  }

  // Fallback demo slides if no images uploaded yet
  if (slides.length === 0) {
    slides = [
      {
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
        alt: "Wedding photo",
      },
      {
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
        alt: "Fashion portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop",
        alt: "Celebration",
      },
    ];
  }

  const aboutImageUrl = settings?.about_image_public_id
    ? getCloudinaryUrl(settings.about_image_public_id, {
        width: 800,
        height: 600,
        crop: "fill",
        gravity: "auto",
        format: "auto",
        quality: "auto",
      })
    : null;

  return (
    <>
      {/* ── 1. Hero Slideshow (Image 2 Sample Style — HD, No milky fade) ── */}
      <HeroSlideshow
        slides={slides}
        heading={settings?.hero_heading}
        subheading={settings?.hero_subheading}
        whatsappPhone={settings?.contact_phone}
      />

      {/* ── 2. Featured Gallery (Image 1 Sample Style) ──────────────────── */}
      <section className="py-20 sm:py-24 bg-[#080808]">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="text-center mb-10 space-y-2">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#dfb15b]">
                — OUR PORTFOLIO —
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-tight text-white">
                <span className="italic font-normal text-[#dfb15b]">Featured</span>{" "}
                <span className="font-bold">Gallery</span>
              </h2>
            </div>
          </AnimatedSection>
          <GalleryGrid
            items={gallery}
            categories={categories}
            showFilter
            linkToFullGallery
          />
        </div>
      </section>

      {/* ── 3. Services ─────────────────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="py-20 sm:py-24 bg-[#0c0c0c] border-t border-white/5">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <div className="text-center mb-14 space-y-2">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#dfb15b]">
                  — WHAT WE OFFER —
                </p>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
                  Our <span className="italic font-normal text-[#dfb15b]">Services</span>
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <AnimatedSection key={service.id}>
                  <div className="group rounded-sm border border-white/10 bg-[#121212] p-6 transition-all duration-300 hover:border-[#c59b27]/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
                    {service.cover_public_id && (
                      <div className="mb-5 overflow-hidden rounded-sm aspect-[16/10]">
                        <Image
                          src={getCloudinaryUrl(service.cover_public_id, {
                            width: 600,
                            height: 380,
                            crop: "fill",
                            gravity: "auto",
                            format: "auto",
                            quality: "auto",
                          })}
                          alt={service.title}
                          width={600}
                          height={380}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#dfb15b] transition-colors">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="mt-3 text-xs sm:text-sm text-white/60 line-clamp-3 leading-relaxed">
                        {service.description}
                      </p>
                    )}
                    {service.price_hint && (
                      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#dfb15b]">
                        {service.price_hint}
                      </p>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-black/60 px-7 py-3 text-xs font-bold uppercase tracking-widest text-white hover:border-[#c59b27] hover:text-[#dfb15b] transition-all"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. About ────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#080808] border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 items-center">
              {aboutImageUrl ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-white/10 shadow-2xl">
                  <Image
                    src={aboutImageUrl}
                    alt={settings?.about_heading ?? "About us"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 border border-[#c59b27]/30 pointer-events-none" />
                </div>
              ) : (
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-white/10 bg-[#121212] flex items-center justify-center">
                  <span className="font-serif italic text-white/30 text-2xl">Bala Photography</span>
                </div>
              )}

              <div className="space-y-5">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#dfb15b]">
                  — THE STUDIO —
                </p>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                  {settings?.about_heading ?? "About Us"}
                </h2>
                {settings?.about_body && (
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed whitespace-pre-line">
                    {settings.about_body}
                  </p>
                )}
                <div className="pt-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-sm bg-[#c59b27] px-7 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-[#dfb15b] transition-all"
                  >
                    Connect With Us
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 5. Testimonials ─────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-20 sm:py-24 bg-[#0c0c0c] border-t border-white/5">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <div className="text-center mb-14 space-y-2">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#dfb15b]">
                  — CLIENT LOVE —
                </p>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
                  Words From <span className="italic font-normal text-[#dfb15b]">Our Clients</span>
                </h2>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <AnimatedSection key={t.id}>
                  <div className="rounded-sm border border-white/10 bg-[#121212] p-7 space-y-4">
                    {t.rating && (
                      <div className="flex gap-1 text-[#dfb15b]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < t.rating! ? "text-[#dfb15b]" : "text-white/20"}>
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                    <blockquote className="font-serif italic text-white/80 text-xs sm:text-sm leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="pt-2 border-t border-white/5 flex items-center gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white">
                          {t.client_name}
                        </p>
                        {t.client_title && (
                          <p className="text-[11px] text-white/50 tracking-wider">
                            {t.client_title}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. Bottom Banner CTA ────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-24 overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#080808] to-[#121212]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#dfb15b] mb-3">
              — LET&apos;S TALK —
            </p>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-5">
              Ready to capture your <span className="italic font-normal text-[#dfb15b]">timeless story</span>?
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-white/70 mb-8 leading-relaxed">
              From intimate celebrations to grand weddings, we turn your precious moments into art that lasts forever.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-sm bg-[#c59b27] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black hover:bg-[#dfb15b] hover:shadow-[0_0_30px_rgba(197,155,39,0.4)] transition-all"
            >
              BOOK YOUR SESSION
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
