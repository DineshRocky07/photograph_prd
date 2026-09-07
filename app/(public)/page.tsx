import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { AnimatedSection } from "@/components/public/animated-section";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { HeroSlideshow } from "@/components/public/hero-slideshow";
import type { SiteSettings, Service, GalleryItem, Testimonial, Category } from "@/types";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const supabase = await createClient();

  const [settingsRes, servicesRes, galleryRes, testimonialsRes, categoriesRes, heroRes] =
    await Promise.all([
      supabase
        .from("site_settings")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
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
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    title: settings?.business_name ?? "Home",
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
        alt: "Portrait photo",
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
    : gallery[0]?.public_id
    ? getCloudinaryUrl(gallery[0].public_id, {
        width: 800,
        height: 600,
        crop: "fill",
        gravity: "auto",
        format: "auto",
        quality: "auto",
      })
    : "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=1200&auto=format&fit=crop";

  return (
    <>
      {/* ── 1. Hero Slideshow (Full HD, Unobstructed, Clean Bottom Buttons) ── */}
      <HeroSlideshow
        slides={slides}
        heading={settings?.hero_heading}
        subheading={settings?.hero_subheading}
        whatsappPhone={settings?.contact_phone}
      />

      {/* ── 2. Featured Gallery ────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 md:py-20 bg-background">
        <div className="container mx-auto px-3.5 sm:px-6">
          <AnimatedSection>
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Our Portfolio</h2>
              <p className="mt-1.5 text-xs sm:text-sm md:text-base text-muted-foreground">
                A showcase of our recent moments and visual stories
              </p>
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
        <section className="py-10 sm:py-16 md:py-20 bg-muted/40 border-t">
          <div className="container mx-auto px-3.5 sm:px-6">
            <AnimatedSection>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Services</h2>
                <p className="mt-1.5 text-xs sm:text-sm md:text-base text-muted-foreground">
                  Tailored photography and visual design for every occasion
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service) => (
                <AnimatedSection key={service.id}>
                  <div className="rounded-lg border bg-card p-4 sm:p-6 transition-all hover:shadow-md">
                    {service.cover_public_id && (
                      <div className="mb-3 sm:mb-4 overflow-hidden rounded-md aspect-[16/10]">
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
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {service.description}
                      </p>
                    )}
                    {service.price_hint && (
                      <p className="mt-2.5 sm:mt-3 text-xs font-semibold text-primary">
                        {service.price_hint}
                      </p>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <div className="mt-8 sm:mt-10 text-center">
              <Link
                href="/services"
                className="inline-block rounded-md border border-input bg-background px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-accent transition-colors shadow-xs"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. About ────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 md:py-20 bg-background border-t">
        <div className="container mx-auto px-3.5 sm:px-6">
          <AnimatedSection>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 items-center">
              {aboutImageUrl ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border shadow-xs">
                  <Image
                    src={aboutImageUrl}
                    alt={settings?.about_heading ?? "About us"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted flex items-center justify-center text-muted-foreground">
                  <span className="font-semibold text-lg sm:text-xl">Bala Photography</span>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  {settings?.about_heading ?? "About Us"}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {settings?.about_body ||
                    "We are a creative studio specialising in professional photography and visual design. With years of experience behind the lens, we turn your most cherished memories into timeless art."}
                </p>
                <div className="pt-1 sm:pt-2">
                  <Link
                    href="/contact"
                    className="inline-block rounded-md bg-primary px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 5. Testimonials ─────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-10 sm:py-16 md:py-20 bg-muted/30 border-t">
          <div className="container mx-auto px-3.5 sm:px-6">
            <AnimatedSection>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Client Testimonials</h2>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                  What our clients say about their experience
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
              {testimonials.map((t) => (
                <AnimatedSection key={t.id}>
                  <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-2.5 sm:space-y-3 shadow-xs">
                    {t.rating && (
                      <div className="flex gap-0.5 text-amber-500 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < t.rating! ? "text-amber-500" : "text-muted/40"}>
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                    <blockquote className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="pt-2 border-t flex items-center gap-3">
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          {t.client_name}
                        </p>
                        {t.client_title && (
                          <p className="text-[10px] sm:text-[11px] text-muted-foreground">
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
      <section className="py-12 sm:py-16 md:py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Ready to create something beautiful?
            </h2>
            <p className="max-w-xl mx-auto text-xs sm:text-sm md:text-base text-primary-foreground/80 mb-6 sm:mb-8">
              Let&apos;s discuss your project, event, or portrait session and bring your vision to life.
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-md bg-background text-foreground px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-semibold hover:bg-accent transition-colors shadow-xs"
            >
              Book a Session
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
