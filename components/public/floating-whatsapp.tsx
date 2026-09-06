"use client";

import { MessageCircle } from "lucide-react";

type Props = {
  phone?: string | null;
  businessName?: string;
};

export function FloatingWhatsApp({ phone, businessName = "Bala Photography" }: Props) {
  const cleanPhone = phone?.replace(/[^0-9]/g, "") || "";
  if (!cleanPhone) return null;

  const url = `https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
    businessName
  )},%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20inquire%20about%20a%20photoshoot!`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-[0_4px_25px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_30px_rgba(37,211,102,0.6)] group"
    >
      <MessageCircle className="h-5 w-5 fill-white text-[#25D366]" />
      <span className="text-xs font-bold tracking-wider uppercase hidden sm:inline-block">
        Chat on WhatsApp
      </span>
      {/* Subtle pulse ring */}
      <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none -z-10" />
    </a>
  );
}
