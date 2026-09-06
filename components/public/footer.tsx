import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube, Linkedin, Share2 } from "lucide-react";
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

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold">{settings.business_name}</p>
            {settings.tagline && (
              <p className="mt-1 text-sm text-muted-foreground">{settings.tagline}</p>
            )}
          </div>

          {/* Quick links */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider mb-3">
              Quick Links
            </p>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
              <Link href="/gallery" className="hover:text-foreground transition-colors">Gallery</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Contact + socials */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider mb-3">
              Contact
            </p>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {settings.contact_email}
                </a>
              )}
              {settings.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="hover:text-foreground transition-colors"
                >
                  {settings.contact_phone}
                </a>
              )}
              {settings.contact_address && (
                <p className="mt-1">{settings.contact_address}</p>
              )}
            </div>

            {hasSocials && (
              <div className="mt-4 flex gap-3">
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
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {currentYear} {settings.business_name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
