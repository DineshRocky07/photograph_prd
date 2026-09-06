import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { AnimatedSection } from "@/components/public/animated-section";
import type { Service } from "@/types";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our professional photography and graphic design services.",
};

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*, category:categories(*)")
    .eq("is_active", true)
    .order("sort_order");

  const services = (data as Service[]) ?? [];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold">Our Services</h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Professional photography and graphic design tailored to your needs.
            </p>
          </div>
        </AnimatedSection>

        {services.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            Services coming soon — check back shortly!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <AnimatedSection key={service.id}>
                <div className="rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  {service.cover_public_id && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={getCloudinaryUrl(service.cover_public_id, {
                          width: 700,
                          height: 450,
                          crop: "fill",
                          format: "auto",
                          quality: "auto",
                        })}
                        alt={service.title}
                        width={700}
                        height={450}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    {service.category && (
                      <span className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                        {service.category.name}
                      </span>
                    )}
                    <h2 className="text-xl font-semibold">{service.title}</h2>
                    {service.description && (
                      <p className="mt-2 text-sm text-muted-foreground flex-1">
                        {service.description}
                      </p>
                    )}
                    {service.price_hint && (
                      <p className="mt-4 font-medium text-primary">
                        {service.price_hint}
                      </p>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
