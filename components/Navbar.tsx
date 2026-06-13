"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "CV Maker", href: "/cv-maker" },
  { label: "Results", href: "/#results" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-350 ${
        scrolled
          ? "py-4 bg-brand-dark/80 backdrop-blur-md border-b border-brand-gray-800/40 shadow-lg"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="/"
          className="font-heading font-bold text-xl md:text-2xl tracking-tight text-white flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-emerald rounded"
          aria-label="Mibin Thomas Home"
        >
          <span>Mibin</span>
          <span className="text-brand-emerald">Thomas</span>
          <span className="inline-block w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Desktop navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-brand-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm tracking-wide relative py-1 focus:outline-none focus:ring-2 focus:ring-brand-emerald rounded px-1 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-emerald to-brand-blue transition-all duration-350 group-hover:w-full"></span>
            </a>
          ))}
          <a
            href="/#contact"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark font-heading font-semibold text-sm hover:opacity-90 transition-all duration-350 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-emerald group shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
          >
            <span>{"Let's Talk"}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </nav>

        {/* Mobile Navigation Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-brand-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald rounded-lg"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden w-full bg-brand-dark/95 border-b border-brand-gray-800/80 backdrop-blur-lg absolute left-0 overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-5" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-brand-gray-300 hover:text-white font-medium text-lg focus:outline-none focus:ring-2 focus:ring-brand-emerald rounded p-1"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark font-heading font-semibold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span>{"Let's Talk"}</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
