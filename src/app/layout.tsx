import type { Metadata, Viewport } from "next";
import { Cairo, Playfair_Display } from "next/font/google";
import Providers from "@/components/Providers";
import ServiceWorker from "@/components/ServiceWorker";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "مدرسة نور القرآن | École Nur Al-Quran",
  description: "تعليم قرآني متميز — Enseignement coranique d'excellence.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2d6a4f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${playfair.variable}`}>
      <body className="font-[family-name:var(--font-cairo)] antialiased">
        <ServiceWorker />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
