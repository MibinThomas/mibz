"use client";

import React from "react";
import { CheckCircle2, Layout, Award, Server } from "lucide-react";

export default function ProjectStats() {
  const stats = [
    {
      label: "Websites Delivered",
      value: "14+",
      icon: <CheckCircle2 className="w-5 h-5 text-brand-emerald" />,
      desc: "Custom high-speed solutions",
    },
    {
      label: "Industries Covered",
      value: "7+",
      icon: <Server className="w-5 h-5 text-brand-blue" />,
      desc: "B2B & E-Commerce systems",
    },
    {
      label: "Responsive Layouts",
      value: "100%",
      icon: <Layout className="w-5 h-5 text-brand-emerald" />,
      desc: "Mobile‑first architecture",
    },
    {
      label: "SEO-Friendly Builds",
      value: "Core",
      icon: <Award className="w-5 h-5 text-brand-blue" />,
      desc: "Lighthouse optimization",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-5 sm:p-6 rounded-xl border border-brand-gray-800/60 bg-brand-card/20 backdrop-blur-sm space-y-3 hover:border-brand-gray-700/60 transition-colors duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 bg-brand-dark rounded-lg border border-brand-gray-850">
              {stat.icon}
            </div>
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              {stat.value}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
              {stat.label}
            </h3>
            <p className="text-brand-gray-400 text-[10px] sm:text-xs">
              {stat.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
