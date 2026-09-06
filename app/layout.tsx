import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Bala Photography",
    default: "Bala Photography — Professional Photography Studio",
  },
  description: "Award-winning photography studio capturing moments that last forever.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sans.variable} ${serif.variable} font-sans bg-[#080808] text-[#f5f5f5] antialiased selection:bg-[#c59b27]/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
