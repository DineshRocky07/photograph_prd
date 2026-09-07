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
    ? getCloudinaryUrl(settings.logo_public_id, { width: 128, height: 128, crop: "fill", format: "auto" })
    : null;

  const cleanPhone = settings.contact_phone?.replace(/[^0-9]/g, "") || "";
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=Hi%20Bala%20Photography,%20I%20would%20like%20to%20inquire%20about%20a%20photoshoot.`
    : "/contact";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3.5 sm:px-6">
        {/* Logo + Business Name side by side */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0 max-w-[75%] sm:max-w-none">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={settings.business_name}
              width={36}
              height={36}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-md object-cover shadow-xs shrink-0"
              priority
            />
          )}
          <span className="text-base sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
            {settings.business_name}
          </span>
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
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
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
          className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors shrink-0"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-background px-4 py-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 mt-1 border-t flex flex-col gap-2">
              <Link
                href="/contact"
                className="rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground text-center shadow-sm"
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
