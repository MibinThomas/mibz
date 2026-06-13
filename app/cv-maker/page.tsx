import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Dynamically import the interactive builder to optimize performance and prevent hydration issues
const CVMakerPage = dynamic(() => import("@/components/cv-maker/CVMakerPage"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "ATS Friendly CV Maker | Create Professional Resume Online",
  description: "Build a clean, ATS-friendly CV online with live preview, professional templates, resume scoring and PDF export.",
  alternates: {
    canonical: "/cv-maker",
  },
  openGraph: {
    title: "ATS Friendly CV Maker | Create Professional Resume Online",
    description: "Build a clean, ATS-friendly CV online with live preview, professional templates, resume scoring and PDF export.",
    url: "https://mibinthomas.com/cv-maker",
    siteName: "Mibin Thomas Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATS Friendly CV Maker | Create Professional Resume Online",
    description: "Build a clean, ATS-friendly CV online with live preview, professional templates, resume scoring and PDF export.",
  },
};

export default function Page() {
  return <CVMakerPage />;
}
