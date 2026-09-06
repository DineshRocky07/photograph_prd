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
        .limit(12),
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
    title: settings?.business_name ?? "Home",
    description: settings?.meta_description ?? settings?.tagline ?? "",
  };
}

export default async function HomePage() {
  const { settings, services, gallery, testimonials, categories, heroImages } =
    await getHomeData();

  // Build slideshow: up to 5 published gallery images, or the single hero image from settings
  let slides: { src: string; alt: string }[] = heroImages.map((img) => ({
    src: getCloudinaryUrl(img.public_id, {
      width: 1920,
      height: 1080,
      crop: "fill",
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
          format: "auto",
          quality: "auto",
        }),
        alt: settings.business_name ?? "Hero image",
      },
    ];
  }

  const aboutImageUrl = settings?.about_image_public_id
    ? getCloudinaryUrl(settings.about_image_public_id, {
        width: 800,
        height: 600,
        crop: "fill",
        format: "auto",
        quality: "auto",
      })
    : null;

  return (
    <>
      {/* ── Hero Slideshow ─────────────────────────────────────── */}
      {slides.length > 0 ? (
        <HeroSlideshow
          slides={slides}
          heading={settings?.hero_heading}
          subheading={settings?.hero_subheading}
        />
      ) : (
        /* Fallback: no images yet */
        <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-muted">
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {settings?.hero_heading ?? "Professional Photography & Design"}
            </h1>
            {settings?.hero_subheading && (
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
                {settings.hero_subheading}
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
        </section>
      )}

      {/* ── Featured Services ──────────────────────────────────── */}
      {services.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Our Services</h2>
                <p className="mt-2 text-muted-foreground">
                  Professional photography and design for every occasion
                </p>
              </div>
            </AnimatedSection>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <AnimatedSection key={service.id}>
                  <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
                    {service.cover_public_id && (
                      <div className="mb-4 overflow-hidden rounded-md aspect-video">
                        <Image
                          src={getCloudinaryUrl(service.cover_public_id, {
                            width: 600,
                            height: 400,
                            crop: "fill",
                            format: "auto",
                            quality: "auto",
                          })}
                          alt={service.title}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    {service.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                        {service.description}
                      </p>
                    )}
                    {service.price_hint && (
                      <p className="mt-3 text-sm font-medium text-primary">
                        {service.price_hint}
                      </p>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/services"
                className="rounded-md border border-input px-6 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Gallery ───────────────────────────────────── */}
      {gallery.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Gallery</h2>
                <p className="mt-2 text-muted-foreground">
                  A glimpse of our recent work
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
      )}

      {/* ── About ─────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
              {aboutImageUrl && (
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src={aboutImageUrl}
                    alt={settings?.about_heading ?? "About us"}
                    width={800}
                    height={600}
                    className="w-full object-cover"
                  />
                </div>
              )}
              <div className={aboutImageUrl ? "" : "md:col-span-2 max-w-2xl mx-auto text-center"}>
                <h2 className="text-3xl font-bold">
                  {settings?.about_heading ?? "About Us"}
                </h2>
                {settings?.about_body && (
                  <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                    {settings.about_body}
                  </p>
                )}
                <div className="mt-6">
                  <Link
                    href="/about"
                    className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">What Our Clients Say</h2>
              </div>
            </AnimatedSection>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <AnimatedSection key={t.id}>
                  <div className="rounded-lg border bg-card p-6">
                    {t.rating && (
                      <div className="flex gap-0.5 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < t.rating!
                                ? "text-yellow-400"
                                : "text-muted-foreground/30"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                    <blockquote className="text-sm text-muted-foreground italic">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <div className="mt-4 flex items-center gap-3">
                      <div>
                        <p className="text-sm font-semibold">{t.client_name}</p>
                        {t.client_title && (
                          <p className="text-xs text-muted-foreground">
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

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold">Ready to create something beautiful?</h2>
            <p className="mt-3 text-primary-foreground/80">
              Let&apos;s discuss your project and bring your vision to life.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="rounded-md bg-background text-foreground px-8 py-3 text-sm font-semibold hover:bg-background/90 transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
