import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube, Linkedin, Share2, MessageCircle, Phone, Mail, MapPin } from "lucide-react";
import type { SiteSettings } from "@/types";

const SOCIAL_ICONS = {
  social_instagram: { Icon: Instagram, label: "Instagram" },
  social_facebook: { Icon: Facebook, label: "Facebook" },
  social_twitter: { Icon: Twitter, label: "Twitter / X" },
  social_youtube: { Icon: Youtube, label: "YouTube" },
  social_linkedin: { Icon: Linkedin, label: "LinkedIn" },
  social_pinterest: { Icon: Share2, label: "Pinterest" },
} as const;

export function Footer({ settings }: { settings: SiteSettings }) {
  const currentYear = new Date().getFullYear();
  const hasSocials = Object.keys(SOCIAL_ICONS).some(
    (k) => !!settings[k as keyof SiteSettings]
  );

  const cleanPhone = settings.contact_phone?.replace(/[^0-9]/g, "") || "";
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=Hi%20Bala%20Photography,%20I%20would%20like%20to%20inquire%20about%20a%20photoshoot.`
    : "/contact";

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-lg font-bold tracking-tight text-foreground">{settings.business_name}</p>
            {settings.tagline && (
              <p className="text-sm text-muted-foreground max-w-sm">{settings.tagline}</p>
            )}
            {cleanPhone && (
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors shadow-sm"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Quick Links
            </p>
            <nav className="flex flex-col gap-2 text-sm text-foreground/80">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="hover:text-primary transition-colors">About</Link>
              <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
              <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Contact + socials */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Contact
            </p>
            <div className="flex flex-col gap-2 text-sm text-foreground/80">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{settings.contact_email}</span>
                </a>
              )}
              {settings.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{settings.contact_phone}</span>
                </a>
              )}
              {settings.contact_address && (
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>{settings.contact_address}</span>
                </div>
              )}
            </div>

            {hasSocials && (
              <div className="mt-4 flex gap-2.5">
                {Object.entries(SOCIAL_ICONS).map(([key, { Icon, label }]) => {
                  const url = settings[key as keyof SiteSettings] as string | null;
                  if (!url) return null;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-8 w-8 items-center justify-center rounded-md border bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shadow-sm"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {currentYear} {settings.business_name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
