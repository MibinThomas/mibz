"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  MessageSquare,
  X,
  MessageSquareMore,
} from "lucide-react";

export default function FloatingContactDial() {
  const [isOpen, setIsOpen] = useState(false);

  // Radial options configuration
  // Spaced out along an arc from 180 deg (left) to 300 deg (top-right)
  const contactOptions = [
    {
      name: "Email",
      icon: <Mail className="w-5 h-5 text-[#22c55e]" />,
      href: "mailto:mibin@webeyecraft.com",
      x: -120,
      y: 0,
      delay: 0.05,
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-5 h-5 text-[#25D366]" />,
      href: "https://wa.me/971566556278",
      x: -104,
      y: -60,
      delay: 0.1,
    },
    {
      name: "Call",
      icon: <Phone className="w-5 h-5 text-[#22c55e]" />,
      href: "tel:+971566556278",
      x: -60,
      y: -104,
      delay: 0.15,
    },
    {
      name: "Location",
      icon: <MapPin className="w-5 h-5 text-[#22c55e]" />,
      href: "https://maps.google.com/?q=Dubai,United+Arab+Emirates",
      x: 0,
      y: -120,
      delay: 0.2,
    },
    {
      name: "Message",
      icon: <MessageSquare className="w-5 h-5 text-[#22c55e]" />,
      href: "/#contact",
      x: 60,
      y: -104,
      delay: 0.25,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Radial Options Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click-away backdrop */}
            <div
              className="fixed inset-0 z-0 cursor-default"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Buttons Arc */}
            <div className="absolute bottom-0 right-0 z-10 pointer-events-none">
              {contactOptions.map((opt) => (
                <motion.a
                  key={opt.name}
                  href={opt.href}
                  target={opt.name !== "Call" && opt.name !== "Email" && opt.href.startsWith("http") ? "_blank" : undefined}
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
                  className="absolute bottom-1 right-1 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] pointer-events-auto hover:scale-110 active:scale-95 transition-transform duration-200"
                  aria-label={opt.name}
                >
                  {opt.icon}
                </motion.a>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main Dial Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-20 w-14 h-14 rounded-full bg-white border-[3px] border-brand-dark flex items-center justify-center shadow-[0_6px_25px_rgba(0,0,0,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
        aria-label="Toggle contact menu"
        aria-expanded={isOpen}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center justify-center text-black"
        >
          {isOpen ? (
            <X className="w-6 h-6 stroke-[2.5]" />
          ) : (
            <MessageSquareMore className="w-6 h-6 stroke-[2.5]" />
          )}
        </motion.div>
      </button>
    </div>
  );
}
