"use client";

import React, { useState, useRef, MouseEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe2, Eye } from "lucide-react";
import AnimatedBrowserMockup from "./AnimatedBrowserMockup";
import { Project } from "@/lib/portfolioData";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalise mouse cursor position inside the card coordinate grid (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Calculate dynamic angles (maximum tilt angle of 10 degrees)
    setRotateX(-mouseY * 10);
    setRotateY(mouseX * 10);
  };

  const handleMouseLeave = () => {
    // Return to flat state
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group bg-brand-card/45 border border-brand-gray-800/60 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:border-brand-emerald/45 flex flex-col gap-5 relative hover:shadow-[0_0_30px_rgba(16,185,129,0.02)] select-none select-none"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D Glassmorphic Browser Mockup */}
      <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
        <AnimatedBrowserMockup
          url={project.url}
          themeColor={project.themeColor}
          type={project.mockupType}
        />
      </div>

      {/* Meta & Descriptions */}
      <div className="flex-grow flex flex-col justify-between gap-4" style={{ transform: "translateZ(15px)" }}>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue bg-brand-dark/50 px-2.5 py-0.5 rounded border border-brand-gray-850">
              {project.category}
            </span>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: project.themeColor }} />
          </div>

          <h3 className="font-heading font-extrabold text-lg text-white group-hover:text-brand-emerald transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="text-brand-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Tech Stack deployment */}
        <div className="space-y-4 pt-4 border-t border-brand-gray-800/40">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-dark/40 border border-brand-gray-850 text-brand-gray-300"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-dark/20 text-brand-gray-500">
                +{project.tech.length - 3} More
              </span>
            )}
          </div>

          {/* Interactive Navigation Actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* View Live */}
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-full border border-brand-gray-800 hover:border-brand-emerald bg-brand-dark/30 hover:bg-brand-dark/80 text-brand-gray-300 hover:text-white font-heading font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Live Site</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </a>

            {/* View Details Case Study Page */}
            <Link
              href={`/portfolio/${project.slug}`}
              className="py-2.5 rounded-full bg-gradient-to-r from-brand-emerald/80 to-brand-blue/80 hover:from-brand-emerald hover:to-brand-blue text-brand-dark hover:scale-[1.02] font-heading font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
