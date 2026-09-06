"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Calendar, MessageCircle } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";
import type { SiteSettings } from "@/types";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/services", label: "SERVICES" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/contact", label: "CONNECT" },
];

export function Navbar({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const logoUrl = settings.logo_public_id
    ? getCloudinaryUrl(settings.logo_public_id, { width: 240, height: 80, crop: "fit", format: "auto" })
    : null;

  const cleanPhone = settings.contact_phone?.replace(/[^0-9]/g, "") || "";
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=Hi%20Bala%20Photography,%20I%20would%20like%20to%20inquire%20about%20a%20photo%20shoot.`
    : "/contact";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080808]/90 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={settings.business_name}
              width={140}
              height={45}
              className="h-9 sm:h-10 w-auto object-contain"
              priority
            />
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Boxed BA monogram */}
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center border border-[#c59b27] bg-[#c59b27]/10 text-[#c59b27] font-serif font-bold text-xs sm:text-sm tracking-wider transition-transform group-hover:scale-105">
                BA
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-white">
                  BALA <span className="font-serif italic font-normal text-[#dfb15b]">Photography</span>
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-xs font-semibold tracking-widest transition-colors ${
                  isActive
                    ? "text-[#dfb15b]"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c59b27]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-sm bg-[#c59b27] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-[#dfb15b] hover:shadow-[0_0_20px_rgba(197,155,39,0.3)]"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>BOOK NOW</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-white/80 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-b border-white/10 bg-[#0c0c0c] px-6 py-5">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold tracking-widest ${
                    isActive ? "text-[#dfb15b]" : "text-white/80 hover:text-white"
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
                className="flex items-center justify-center gap-2 w-full rounded-sm bg-[#c59b27] px-5 py-3 text-xs font-bold uppercase tracking-wider text-black"
                onClick={() => setOpen(false)}
              >
                <Calendar className="h-4 w-4" />
                <span>BOOK NOW</span>
              </Link>

              {cleanPhone && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-sm border border-[#25D366]/40 bg-[#25D366]/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#25D366]"
                  onClick={() => setOpen(false)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>CHAT ON WHATSAPP</span>
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
