"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram,
  MessageCircle,
  Mail,
  Github,
  Plus,
} from "lucide-react";

// Custom Behance Icon SVG Component since Lucide does not ship Behance
function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.228 15.01c0 .878-.458 1.34-1.258 1.34H5.32v-2.65h1.62c.79 0 1.288.43 1.288 1.31zm-.24-4.14c0 .8-.43 1.22-1.19 1.22H5.32V10.9h1.458c.74 0 1.21.35 1.21.97zM0 4v16h24V4H0zm11.378 12.35c0 1.63-1.078 2.65-2.97 2.65H3.19V9h4.86c1.78 0 2.76.96 2.76 2.39 0 1.01-.52 1.74-1.42 2.06.99.3 1.98.99 1.98 2.9zm10.27-1.12h-4.998c.09 1.07.96 1.76 2.19 1.76 1 0 1.7-.45 1.96-1.09h1.79c-.49 1.63-1.95 2.75-3.75 2.75-2.62 0-4.04-1.78-4.04-4.22 0-2.43 1.43-4.22 3.88-4.22 2.45 0 3.96 1.75 3.96 4.19v.83zm-1.66-1.14c-.05-1.01-.81-1.63-1.85-1.63-1.05 0-1.89.65-2.07 1.63h3.92zM15.42 8.04h4.4v1.1h-4.4v-1.1z"/>
    </svg>
  );
}

export default function FloatingContactDial() {
  const [isOpen, setIsOpen] = useState(false);

  // Custom social contact options configurations
  const socialOptions = [
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5 text-white transition-transform duration-500 group-hover:rotate-[360deg]" />,
      href: "https://www.instagram.com/", // Replace with custom profile URL later
      bgClass: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
      x: -120,
      y: 0,
      delay: 0.05,
    },
    {
      name: "Behance",
      icon: <BehanceIcon className="w-5 h-5 text-white transition-transform duration-500 group-hover:rotate-[360deg]" />,
      href: "https://www.behance.net/", // Replace with custom profile URL later
      bgClass: "bg-[#0057ff]",
      x: -104,
      y: -60,
      delay: 0.1,
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5 text-white transition-transform duration-500 group-hover:rotate-[360deg]" />,
      href: "https://wa.me/971566556278",
      bgClass: "bg-[#25D366]",
      x: -60,
      y: -104,
      delay: 0.15,
    },
    {
      name: "Gmail",
      icon: <Mail className="w-5 h-5 text-white transition-transform duration-500 group-hover:rotate-[360deg]" />,
      href: "mailto:mibin@webeyecraft.com",
      bgClass: "bg-[#EA4335]",
      x: 0,
      y: -120,
      delay: 0.2,
    },
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5 text-white transition-transform duration-500 group-hover:rotate-[360deg]" />,
      href: "https://github.com/MibinThomas",
      bgClass: "bg-[#181717] border border-brand-gray-800",
      x: 60,
      y: -104,
      delay: 0.25,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Social options fanning arc */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click away handler */}
            <div
              className="fixed inset-0 z-0 cursor-default"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu options buttons */}
            <div className="absolute bottom-0 right-0 z-10 pointer-events-none">
              {socialOptions.map((opt) => (
                <motion.a
                  key={opt.name}
                  href={opt.href}
                  target={opt.name !== "Gmail" && opt.href.startsWith("http") ? "_blank" : undefined}
                  rel={opt.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{
                    x: opt.x,
                    y: opt.y,
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: isOpen ? opt.delay : 0,
                  }}
                  className={`absolute bottom-1 right-1 w-12 h-12 rounded-full ${opt.bgClass} flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.35)] pointer-events-auto hover:scale-110 active:scale-95 transition-all duration-200 group`}
                  aria-label={opt.name}
                >
                  {opt.icon}
                </motion.a>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main Trigger Plus (+) Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-20 w-14 h-14 rounded-full bg-white border-[3px] border-brand-dark flex items-center justify-center shadow-[0_6px_25px_rgba(0,0,0,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
        aria-label="Toggle contact menu"
        aria-expanded={isOpen}
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center justify-center text-black"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </motion.div>
      </button>
    </div>
  );
}
