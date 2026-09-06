"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";
import type { SiteSettings } from "@/types";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const logoUrl = settings.logo_public_id
    ? getCloudinaryUrl(settings.logo_public_id, { width: 240, height: 80, crop: "fit", format: "auto" })
    : null;

  const cleanPhone = settings.contact_phone?.replace(/[^0-9]/g, "") || "";
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=Hi%20Bala%20Photography,%20I%20would%20like%20to%20inquire%20about%20a%20photoshoot.`
    : "/contact";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo / Business Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={settings.business_name}
              width={160}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          ) : (
            <span className="text-xl font-bold tracking-tight text-foreground">
              {settings.business_name}
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {cleanPhone && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>WhatsApp</span>
            </a>
          )}
          <Link
            href="/contact"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-background px-5 py-4">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium py-1 ${
                    isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/contact"
                className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground text-center"
                onClick={() => setOpen(false)}
              >
                Book Now
              </Link>
              {cleanPhone && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-md border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2 text-xs font-bold text-[#25D366]"
                  onClick={() => setOpen(false)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
