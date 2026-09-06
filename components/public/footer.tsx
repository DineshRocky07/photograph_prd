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
    ? `https://wa.me/${cleanPhone}?text=Hi%20Bala%20Photography,%20I%20would%20like%20to%20inquire%20about%20a%20photo%20shoot.`
    : "/contact";

  return (
    <footer className="border-t border-white/10 bg-[#070707] text-[#e5e5e5]">
      <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center border border-[#c59b27] bg-[#c59b27]/10 text-[#c59b27] font-serif font-bold text-xs tracking-wider">
                BA
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-white">
                BALA <span className="font-serif italic font-normal text-[#dfb15b]">Photography</span>
              </span>
            </div>
            {settings.tagline && (
              <p className="text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed">
                {settings.tagline}
              </p>
            )}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target={cleanPhone ? "_blank" : undefined}
                rel={cleanPhone ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 rounded-sm border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#dfb15b] mb-4">
              Explore
            </p>
            <nav className="flex flex-col gap-2.5 text-xs font-medium text-white/70">
              <Link href="/" className="hover:text-[#dfb15b] transition-colors">Home</Link>
              <Link href="/services" className="hover:text-[#dfb15b] transition-colors">Services</Link>
              <Link href="/gallery" className="hover:text-[#dfb15b] transition-colors">Gallery</Link>
              <Link href="/contact" className="hover:text-[#dfb15b] transition-colors">Contact / Book</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#dfb15b] mb-4">
              Contact Studio
            </p>
            <div className="flex flex-col gap-3 text-xs text-white/70">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-2 hover:text-[#dfb15b] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-[#dfb15b] shrink-0" />
                  <span className="truncate">{settings.contact_email}</span>
                </a>
              )}
              {settings.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="flex items-center gap-2 hover:text-[#dfb15b] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-[#dfb15b] shrink-0" />
                  <span>{settings.contact_phone}</span>
                </a>
              )}
              {settings.contact_address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#dfb15b] shrink-0 mt-0.5" />
                  <span>{settings.contact_address}</span>
                </div>
              )}
            </div>

            {hasSocials && (
              <div className="mt-5 flex gap-2.5">
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
                      className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 bg-white/5 text-white/70 hover:border-[#c59b27] hover:text-[#dfb15b] transition-all"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-[11px] text-white/40 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© {currentYear} {settings.business_name}. All rights reserved.</span>
          <span className="text-[#dfb15b]/80">Crafted for Excellence</span>
        </div>
      </div>
    </footer>
  );
}
