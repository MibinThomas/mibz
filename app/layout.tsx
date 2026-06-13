import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import FloatingContactDial from "@/components/FloatingContactDial";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mibin Thomas | E-Commerce & Performance Marketing UAE",
  description: "Scale your UAE & GCC e-commerce brand with Mibin Thomas. Expert paid media campaigns (Meta, Google, TikTok), SEO, and data-driven marketing growth.",
  keywords: [
    "Performance Marketing UAE",
    "E-Commerce Growth Specialist",
    "Paid Media Expert Dubai",
    "Meta Ads Specialist GCC",
    "Google Analytics GA4 Consultant",
    "Shopify Growth Marketing",
    "Mibin Thomas Portfolio"
  ],
  authors: [{ name: "Mibin Thomas" }],
  creator: "Mibin Thomas",
  metadataBase: new URL("https://mibinthomas.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mibin Thomas | E-Commerce & Performance Marketing UAE",
    description: "Scale your UAE & GCC e-commerce brand with Mibin Thomas. Expert paid media, CRO, and data-driven e-commerce growth strategies.",
    url: "https://mibinthomas.com",
    siteName: "Mibin Thomas Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mibin Thomas | E-Commerce & Performance Marketing UAE",
    description: "Scale your UAE & GCC e-commerce brand with Mibin Thomas. Expert paid media, CRO, and data-driven e-commerce growth strategies.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="font-sans bg-brand-dark text-foreground antialiased selection:bg-brand-emerald/30 selection:text-brand-emerald">
        <a href="#main-content" className="skip-link font-heading font-semibold rounded-br-md">
          Skip to main content
        </a>
        {children}
        <FloatingContactDial />
      </body>
    </html>
  );
}
