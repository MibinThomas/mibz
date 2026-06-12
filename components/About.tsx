"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar, Globe, Award, ChevronRight } from "lucide-react";
import Image from "next/image";

interface AboutProps {
  onActiveIndexChange?: (index: number) => void;
}

const careerMilestones = [
  {
    role: "Marketing Executive",
    company: "BOSQ Ergonomic Living",
    period: "2024 - Present",
    description: "Spearheaded paid media scaling campaigns on Meta, Google, and TikTok. Fixed site structure issues and applied SEO best practices, yielding a +40% organic traffic lift in 6 months. Standardized GA4 analytical tracking and UTM coordinates across channels.",
    skills: ["GA4 Dashboards", "Conversion API", "Shopify CRO", "Search Console"]
  },
  {
    role: "Digital Marketing Intern",
    company: "BOSQ Ergonomic Living",
    period: "2023 - 2024",
    description: "Assisted in setting up paid marketing campaigns, managing product listings to boost CTR on product description pages (PDPs), and auditing cart drop-offs.",
    skills: ["Google Ads", "Product Listing Optimization", "GTM", "CTR Audits"]
  },
  {
    role: "Social Media Manager",
    company: "Freelance",
    period: "2022 - 2023",
    description: "Managed client profiles, engineered organic content funnels, and optimized ad copy for small e-commerce brands in the region.",
    skills: ["Ad Copywriting", "TikTok Organic", "Meta Ads Manager", "Design Basics"]
  },
  {
    role: "Home Consultant",
    company: "Interior & Living Agency",
    period: "2020 - 2022",
    description: "Developed understanding of customer psychology, spatial design, and conversion dynamics for premium ergonomic furniture products.",
    skills: ["Sales Psychology", "Client Consultations", "Ergonomics", "A/B Testing Pitch"]
  },
  {
    role: "Data Annotator & Analyst",
    company: "Data Operations",
    period: "2019 - 2020",
    description: "Labeled high-volume datasets, structured web links, and parsed UTM strings to refine recommendation engine data algorithms.",
    skills: ["Data Precision", "UTM Standardisation", "Excel Macro Analytics"]
  }
];

const languages = [
  { name: "English", level: "Professional" },
  { name: "Tamil", level: "Native" },
  { name: "Malayalam", level: "Fluent" },
  { name: "Hindi", level: "Conversational" },
  { name: "Kannada", level: "Conversational" }
];

export default function About({ onActiveIndexChange }: AboutProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      // Detect which milestone is currently in the center of viewport
      let closestIndex = 0;
      let minDistance = Infinity;

      cardRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
      onActiveIndexChange?.(closestIndex);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial run

    return () => window.removeEventListener("scroll", handleScroll);
  }, [onActiveIndexChange]);



  return (
    <section id="about" className="relative bg-brand-dark py-24 px-6 md:px-12 border-t border-brand-gray-900/40">
      
      {/* Sticky layout container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left column - Content timeline cards */}
        <div className="lg:col-span-7 space-y-16">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-brand-gray-800/40 pb-10">
            <div className="space-y-4 max-w-xl">
              <span className="text-brand-emerald text-sm font-semibold uppercase tracking-wider block">
                About & Experience
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                An E-Commerce Journey Rooted in Data
              </h2>
              <p className="text-brand-gray-400 leading-relaxed text-sm sm:text-base">
                I specialize in scaling GCC-based e-commerce storefronts. By auditing user acquisition funnels, standardizing GA4 event tags, and executing highly-targeted performance ad campaigns, I bridge the gap between media spend and net margins.
              </p>
            </div>
            
            {/* Visual profile portrait of Mibin */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 group self-center md:self-start">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-brand-emerald to-brand-blue opacity-50 blur-lg group-hover:opacity-75 transition-opacity duration-350"></div>
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-brand-gray-800/60 group-hover:border-brand-emerald/50 transition-colors duration-350 bg-brand-dark shadow-xl">
                <Image
                  src="/mibin.jpg"
                  alt="Mibin Thomas Portrait"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Interactive scrolly cards */}
          <div className="relative space-y-8 pl-4 border-l border-brand-gray-800/60">
            {careerMilestones.map((milestone, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={idx}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  className={`transition-all duration-350 relative p-6 md:p-8 rounded-xl border ${
                    isActive
                      ? "bg-brand-gray-900/60 border-brand-emerald/40 shadow-lg shadow-brand-emerald/5 scale-[1.01]"
                      : "bg-transparent border-transparent opacity-50"
                  }`}
                >
                  {/* Indicator bullet */}
                  <span
                    className={`absolute -left-[21px] top-9 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-brand-emerald border-brand-dark scale-125"
                        : "bg-brand-dark border-brand-gray-650"
                    }`}
                  ></span>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white">
                        {milestone.role}
                      </h3>
                      <span className="text-brand-blue text-sm font-medium">
                        {milestone.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-brand-gray-400 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{milestone.period}</span>
                    </div>
                  </div>

                  <p className="text-brand-gray-400 text-sm leading-relaxed mb-6">
                    {milestone.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {milestone.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-brand-dark border border-brand-gray-800 text-brand-gray-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subgrid - Languages and context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-brand-gray-800/40">
            {/* Languages card */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-brand-emerald" />
                <span>Languages</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <div key={lang.name} className="p-3 bg-brand-card border border-brand-gray-800/40 rounded-lg">
                    <span className="block text-sm font-semibold text-white">{lang.name}</span>
                    <span className="block text-[11px] text-brand-gray-500 font-medium uppercase tracking-wider">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Quick Highlight */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-blue" />
                <span>Growth Frameworks</span>
              </h4>
              <div className="space-y-2.5 text-sm text-brand-gray-400">
                <p className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-brand-emerald mt-0.5 flex-shrink-0" />
                  <span><strong>Paid Funnel Architecting:</strong> Standardized multi-touch conversion attribution models.</span>
                </p>
                <p className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-brand-emerald mt-0.5 flex-shrink-0" />
                  <span><strong>E-Commerce SEO:</strong> PDP keyword mapping & canonical hierarchy alignment.</span>
                </p>
                <p className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-brand-emerald mt-0.5 flex-shrink-0" />
                  <span><strong>Analytical Dashboards:</strong> Unified raw channel APIs into real-time metrics.</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Sticky placeholder on desktop to let fixed canvas show through */}
        <div className="hidden lg:block lg:col-span-5 h-[550px] sticky top-28 self-start pointer-events-none select-none" />
      </div>
    </section>
  );
}
