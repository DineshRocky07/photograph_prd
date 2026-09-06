import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AnimatedSection } from "@/components/public/animated-section";
import { ContactForm } from "./contact-form";
import { Mail, Phone, MapPin } from "lucide-react";
import type { SiteSettings } from "@/types";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — we'd love to hear about your project.",
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  const settings = data as SiteSettings | null;

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold">Get In Touch</h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              We&apos;d love to hear about your project. Fill in the form below
              and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Contact info sidebar */}
          <div className="space-y-8">
            {settings?.contact_email && (
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {settings.contact_email}
                  </a>
                </div>
              </div>
            )}
            {settings?.contact_phone && (
              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Phone</p>
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {settings.contact_phone}
                  </a>
                </div>
              </div>
            )}
            {settings?.contact_address && (
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {settings.contact_address}
                  </p>
                </div>
              </div>
            )}
            {!settings?.contact_email &&
              !settings?.contact_phone &&
              !settings?.contact_address && (
                <p className="text-sm text-muted-foreground">
                  Use the form to get in touch with us.
                </p>
              )}
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <AnimatedSection>
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
