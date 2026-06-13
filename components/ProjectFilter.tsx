"use client";

import React from "react";

interface ProjectFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ProjectFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: ProjectFilterProps) {
  return (
    <div className="flex flex-wrap gap-2.5 items-center justify-start py-2 select-none">
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4.5 py-2 rounded-full text-xs font-heading font-semibold tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald/40 ${
              isActive
                ? "bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark shadow-[0_0_15px_rgba(16,185,129,0.25)] scale-[1.03]"
                : "bg-brand-card/30 border border-brand-gray-850 text-brand-gray-300 hover:border-brand-gray-750 hover:text-white"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
