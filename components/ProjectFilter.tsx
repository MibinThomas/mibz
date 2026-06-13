"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Car,
  Truck,
  HeartPulse,
  GraduationCap,
  Home,
  TrendingUp,
  Briefcase,
} from "lucide-react";

interface ProjectFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  All: Layers,
  Automotive: Car,
  Logistics: Truck,
  Healthcare: HeartPulse,
  Education: GraduationCap,
  Furniture: Home,
  Marketing: TrendingUp,
  Recruitment: Briefcase,
};

export default function ProjectFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: ProjectFilterProps) {
  return (
    <div className="w-full relative py-2 select-none">
      {/* Scrollable Container with Gradient Fades on Edges */}
      <div className="relative w-full flex items-center">
        {/* Left Fade Accent (visible on mobile scroll) */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-brand-dark to-transparent pointer-events-none z-20 md:hidden" />
        
        {/* Scroll Track */}
        <div className="w-full flex gap-3 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1.5 md:flex-wrap md:overflow-visible">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const Icon = categoryIcons[category] || Layers;

            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-heading font-bold tracking-wider transition-colors duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-emerald/40 select-none whitespace-nowrap group ${
                  isActive ? "text-brand-dark" : "text-brand-gray-300 hover:text-white"
                }`}
              >
                {/* Background sliding highlight pill */}
                {isActive && (
                  <motion.span
                    layoutId="activeFilterBackdrop"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-emerald to-brand-blue shadow-[0_0_20px_rgba(16,185,129,0.3)] z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}

                {/* Glassmorphic border for inactive buttons */}
                {!isActive && (
                  <span className="absolute inset-0 rounded-full border border-brand-gray-800 bg-brand-card/30 hover:border-brand-gray-700 transition-colors duration-300 z-0" />
                )}

                {/* Icon & Label */}
                <Icon className={`w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-brand-dark" : "text-brand-emerald"
                }`} />
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>

        {/* Right Fade Accent (visible on mobile scroll) */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-brand-dark to-transparent pointer-events-none z-20 md:hidden" />
      </div>
    </div>
  );
}
