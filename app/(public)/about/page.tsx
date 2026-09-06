import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { AnimatedSection } from "@/components/public/animated-section";
import type { SiteSettings } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("business_name, about_heading")
    .single();

  return {
    title: settings?.about_heading ?? "About",
    description: `Learn more about ${settings?.business_name ?? "our studio"}.`,
  };
}

export default async function AboutPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  const settings = data as SiteSettings | null;

  const aboutImageUrl = settings?.about_image_public_id
    ? getCloudinaryUrl(settings.about_image_public_id, {
        width: 900,
        height: 700,
        crop: "fill",
        format: "auto",
        quality: "auto",
      })
    : null;

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h1 className="text-4xl font-bold mb-12 text-center">
            {settings?.about_heading ?? "About Us"}
          </h1>
        </AnimatedSection>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-start max-w-5xl mx-auto">
          {aboutImageUrl && (
            <AnimatedSection>
              <div className="overflow-hidden rounded-xl sticky top-24">
                <Image
                  src={aboutImageUrl}
                  alt={settings?.about_heading ?? "About us"}
                  width={900}
                  height={700}
                  className="w-full object-cover"
                />
              </div>
            </AnimatedSection>
          )}
          <AnimatedSection className={aboutImageUrl ? "" : "md:col-span-2"}>
            {settings?.about_body ? (
              <div className="prose prose-gray max-w-none">
                {settings.about_body.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                We are a creative photography and graphic design studio dedicated
                to capturing your most important moments.
              </p>
            )}
            {settings?.contact_email && (
              <div className="mt-8 p-6 bg-muted rounded-lg">
                <p className="font-semibold mb-1">Get in touch</p>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-primary hover:underline"
                >
                  {settings.contact_email}
                </a>
                {settings.contact_phone && (
                  <p className="mt-1 text-muted-foreground">
                    {settings.contact_phone}
                  </p>
                )}
              </div>
            )}
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
