"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProjectStats from "./ProjectStats";
import ProjectFilter from "./ProjectFilter";
import ProjectCard from "./ProjectCard";
import { projects } from "@/lib/portfolioData";

const categories = [
  "All",
  "Automotive",
  "Logistics",
  "Healthcare",
  "Education",
  "Furniture",
  "Marketing",
  "Recruitment",
];

export default function PortfolioShowcase() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter projects based on active pill
  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter(
      (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-between selection:bg-brand-emerald/30 selection:text-brand-emerald">
      {/* Navigation Header */}
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 md:px-12 pt-32 pb-24 space-y-16">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-gray-400 hover:text-white transition-colors group text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-emerald rounded p-1"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Profile</span>
          </Link>
        </div>

        {/* Section Header */}
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs font-semibold uppercase tracking-wider select-none animate-pulse">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer Portfolio</span>
          </div>
          
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            Websites I’ve Designed & Built
          </h1>
          
          <p className="text-brand-gray-400 text-sm sm:text-base leading-relaxed">
            Over the years, I’ve designed and developed responsive websites for brands across the UAE and India, covering industries such as automotive, logistics, healthcare, education, furniture, recruitment and digital marketing. Each project was built with a focus on performance, clean UI, mobile responsiveness and business conversion.
          </p>
        </div>

        {/* Stats counter widget */}
        <div className="pt-4 border-t border-brand-gray-800/40">
          <ProjectStats />
        </div>

        {/* Interactive filters */}
        <div className="space-y-4 pt-6">
          <h2 className="text-white font-heading font-bold text-sm uppercase tracking-widest text-brand-gray-450">
            Filter Projects
          </h2>
          <ProjectFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Dynamic Project Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                key={project.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center text-brand-gray-500 font-medium">
            No projects in this category yet.
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <Footer />
    </div>
  );
}
