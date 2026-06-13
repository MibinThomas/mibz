import React from "react";
import type { Metadata } from "next";
import PortfolioShowcase from "@/components/PortfolioShowcase";

export const metadata: Metadata = {
  title: "Web Development Portfolio | Selected Web Projects | Mibin Thomas",
  description:
    "Explore websites designed and developed by Mibin Thomas in the UAE. High-performance, mobile-responsive, and SEO-optimized builds across automotive, logistics, healthcare, furniture, education, recruitment, and marketing.",
  keywords: [
    "Web Developer Dubai",
    "Portfolio Websites UAE",
    "Creative Next.js Developer",
    "E-Commerce Web Builder GCC",
    "Automotive Site Development",
    "Logistics Website Design",
    "Responsive Frontend Developer"
  ],
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Web Development Portfolio | Selected Web Projects | Mibin Thomas",
    description:
      "Explore responsive, search-optimized e-commerce and B2B websites built by Mibin Thomas across major industries in the GCC.",
    url: "https://mibinthomas.com/portfolio",
    type: "website",
  },
};

export default function PortfolioPage() {
  return <PortfolioShowcase />;
}
