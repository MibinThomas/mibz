import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe2, Linkedin, MessageSquare, Award, Compass, Layers } from "lucide-react";
import { projects } from "@/lib/portfolioData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBrowserMockup from "@/components/AnimatedBrowserMockup";

interface PageProps {
  params: {
    slug: string;
  };
}

// Statically pre-render routes at build time
export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

// Dynamic SEO metadata builder
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};

  return {
    title: `${project.title} | Web Development Case Study | Mibin Thomas`,
    description: `Detailed case study on how Mibin Thomas designed, built, and optimized the ${project.title} website (${project.category} industry) for performance and user conversion.`,
    alternates: {
      canonical: `/portfolio/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} Web Project Case Study | Mibin Thomas`,
      description: project.description,
      url: `https://mibinthomas.com/portfolio/${project.slug}`,
      type: "article",
    },
  };
}

export default function ProjectDetailsPage({ params }: PageProps) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-between selection:bg-brand-emerald/30 selection:text-brand-emerald">
      {/* Navigation Menu */}
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 md:px-12 pt-32 pb-24 space-y-12">
        {/* Back navigation */}
        <div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-brand-gray-400 hover:text-white transition-colors group text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-emerald rounded p-1"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Selected Projects</span>
          </Link>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Visual Mockup & Overview */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-brand-blue bg-brand-dark/50 px-2.5 py-0.5 rounded border border-brand-gray-850 inline-block">
                {project.category} Project
              </span>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
                {project.title}
              </h1>
            </div>

            {/* Massive Browser mockup visual */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-xl opacity-10 blur-[60px]"
                style={{ backgroundColor: project.themeColor }}
              />
              <div className="relative">
                <AnimatedBrowserMockup
                  slug={project.slug}
                  url={project.url}
                  themeColor={project.themeColor}
                  type={project.mockupType}
                />
              </div>
            </div>

            {/* In-depth Overview */}
            <div className="space-y-4 pt-4">
              <h2 className="text-white font-heading font-bold text-xl uppercase tracking-wider">
                Project Overview
              </h2>
              <p className="text-brand-gray-400 text-sm sm:text-base leading-relaxed">
                {project.overview}
              </p>
            </div>
          </div>

          {/* Right Column: Metadata info sheet */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-brand-gray-800/80 bg-brand-card/30 backdrop-blur-sm space-y-6">
              <h3 className="text-white font-heading font-bold text-base uppercase tracking-wider pb-3 border-b border-brand-gray-800/40">
                Project Information
              </h3>
              
              <div className="space-y-5 text-sm">
                {/* Industry */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gray-500 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-brand-emerald" />
                    <span>Industry Sector</span>
                  </span>
                  <p className="font-medium text-white">{project.industry}</p>
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gray-500 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-brand-blue" />
                    <span>My Role</span>
                  </span>
                  <p className="font-medium text-white">{project.role}</p>
                </div>

                {/* Tech deployed */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gray-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-emerald" />
                    <span>Technologies Deployed</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-brand-dark/50 border border-brand-gray-800 text-brand-gray-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-brand-gray-800/40">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4.5 rounded-full bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark hover:scale-[1.01] font-heading font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                >
                  <Globe2 className="w-4 h-4" />
                  <span>Visit Live Website</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Full width features segment */}
        <div className="space-y-6 pt-12 border-t border-brand-gray-850">
          <h2 className="text-white font-heading font-bold text-xl uppercase tracking-wider">
            Key Features & Development Scope
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.features.map((feature, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border border-brand-gray-800 bg-brand-card/10 backdrop-blur-sm flex items-start gap-4"
              >
                <span className="text-brand-emerald font-heading font-extrabold text-lg mt-0.5 select-none">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <p className="text-brand-gray-300 text-sm leading-relaxed">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer High Conversion CTA Block */}
        <div className="pt-12">
          <div className="p-8 sm:p-12 rounded-3xl border border-brand-gray-800/80 bg-brand-card/20 backdrop-blur-md relative overflow-hidden text-center space-y-6 max-w-4xl mx-auto">
            {/* Background design accents */}
            <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-brand-emerald/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-brand-blue/2 blur-3xl pointer-events-none" />

            <div className="space-y-3">
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                Have a website idea or business project?
              </h3>
              <p className="text-brand-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
                {"Let's build a fast, modern and conversion-focused website for your brand."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
              <Link
                href="/#contact"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark font-heading font-semibold text-sm hover:opacity-95 transition-opacity flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Me</span>
              </Link>
              <a
                href="https://www.linkedin.com/in/mibin-thomas/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-brand-gray-950 border border-brand-gray-850 text-white font-heading font-semibold text-sm hover:bg-brand-gray-900 transition-colors flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4 text-brand-blue" />
                <span>View LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <Footer />
    </div>
  );
}
