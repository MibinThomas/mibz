"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Send, MapPin, Mail, Phone, CheckCircle2, AlertCircle } from "lucide-react";

interface FormFields {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function Contact() {
  const [fields, setFields] = useState<FormFields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mask spam bots by constructing email/phone coordinates on dynamic client mount
  const [obfuscatedEmail, setObfuscatedEmail] = useState("");
  const [obfuscatedPhone, setObfuscatedPhone] = useState("");

  useEffect(() => {
    // Deliberate construction to prevent static scraper harvesting
    const user = "mibin";
    const domain = "webeyecraft.com";
    setObfuscatedEmail(`${user}@${domain}`);
    setObfuscatedPhone("+971 56 655 6278");
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!fields.name.trim()) newErrors.name = "Name field is required.";
    
    if (!fields.email.trim()) {
      newErrors.email = "Email field is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      newErrors.email = "Please specify a valid email address.";
    }

    if (!fields.message.trim()) {
      newErrors.message = "Message field is required.";
    } else if (fields.message.length < 10) {
      newErrors.message = "Message details must exceed 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Mimic API post transition
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setIsSuccess(true);
    setFields({ name: "", email: "", message: "" });

    // Auto dismiss success banner after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <section id="contact" className="relative bg-transparent py-24 px-6 md:px-12 border-t border-brand-gray-900/40">
      
      {/* Background visual overlay */}
      <div className="absolute bottom-0 left-0 w-[45%] aspect-square bg-brand-blue/2 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Contact Coordinates & Map */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <div className="space-y-4">
            <span className="text-brand-blue text-sm font-semibold uppercase tracking-wider block">
              Contact & Consultations
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              {"Let's Scale Your E‑Commerce Channel"}
            </h2>
            <p className="text-brand-gray-400 text-sm sm:text-base leading-relaxed">
              Based in Dubai, UAE. Ready to coordinate with high-growth Shopify storefronts across the GCC. Get in touch to schedule a growth analysis.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-card border border-brand-gray-800/20">
              <div className="p-2.5 rounded-lg bg-brand-dark border border-brand-gray-800 text-brand-emerald">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-brand-gray-500 font-bold uppercase tracking-wider">Email Address</span>
                <a
                  href={`mailto:${obfuscatedEmail}`}
                  className="text-sm font-semibold text-white hover:text-brand-emerald hover:underline transition-colors"
                >
                  {obfuscatedEmail || "loading..."}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-card border border-brand-gray-800/20">
              <div className="p-2.5 rounded-lg bg-brand-dark border border-brand-gray-800 text-brand-blue">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-brand-gray-500 font-bold uppercase tracking-wider">Call Coordinates</span>
                <a
                  href={`tel:${obfuscatedPhone.replace(/\s+/g, "")}`}
                  className="text-sm font-semibold text-white hover:text-brand-blue hover:underline transition-colors"
                >
                  {obfuscatedPhone || "loading..."}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-card border border-brand-gray-800/20">
              <div className="p-2.5 rounded-lg bg-brand-dark border border-brand-gray-800 text-brand-emerald">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs text-brand-gray-500 font-bold uppercase tracking-wider">GCC Coverage</span>
                <span className="text-sm font-semibold text-white">Dubai, United Arab Emirates</span>
              </div>
            </div>
          </div>

          {/* Minimalist Vector Map representation of UAE & GCC region */}
          <div className="h-44 w-full rounded-2xl bg-brand-gray-950/20 border border-brand-gray-900/30 overflow-hidden relative flex items-center justify-center p-6 select-none">
            <svg viewBox="0 0 320 160" className="w-full h-full opacity-35" aria-hidden="true">
              <path
                d="M 50 120 Q 80 80 120 70 T 200 90 T 280 60"
                fill="none"
                stroke="#1f2937"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              <path
                d="M 120 70 Q 150 110 240 80"
                fill="none"
                stroke="#1f2937"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              {/* Regional milestone pins */}
              <circle cx="120" cy="70" r="14" fill="#3b82f6" fillOpacity="0.1" />
              <circle cx="120" cy="70" r="3" fill="#3b82f6" />
              
              <circle cx="240" cy="80" r="24" fill="#10b981" fillOpacity="0.1" className="animate-pulse" />
              <circle cx="240" cy="80" r="4" fill="#10b981" />
              <circle cx="240" cy="80" r="8" fill="none" stroke="#10b981" strokeWidth="1" className="animate-ping" />
            </svg>
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-dark/80 backdrop-blur-sm border border-brand-gray-850">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-ping"></span>
              <span className="text-[10px] text-brand-gray-300 font-bold uppercase tracking-widest">Growth Office Hub</span>
            </div>
          </div>
        </div>

        {/* Contact Form Submission Area */}
        <div className="lg:col-span-7 bg-brand-card border border-brand-gray-800/40 rounded-2xl p-6 sm:p-8 hover:border-brand-blue/30 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {/* Display success messages */}
            {isSuccess && (
              <div className="p-4 rounded-xl bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald text-sm flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Thank you! Your growth request was submitted. I will respond inside 24 hours.</span>
              </div>
            )}

            {/* Input name */}
            <div className="space-y-1.5">
              <label htmlFor="form-name" className="block text-xs font-bold text-brand-gray-350 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="form-name"
                  value={fields.name}
                  onChange={(e) => setFields({ ...fields, name: e.target.value })}
                  className={`w-full bg-brand-dark/60 border rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald transition-all ${
                    errors.name ? "border-red-500/50" : "border-brand-gray-800/80 hover:border-brand-gray-650"
                  }`}
                  placeholder="Mibin Thomas"
                  disabled={isSubmitting}
                  aria-describedby={errors.name ? "error-name" : undefined}
                />
              </div>
              {errors.name && (
                <span id="error-name" className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.name}</span>
                </span>
              )}
            </div>

            {/* Input email */}
            <div className="space-y-1.5">
              <label htmlFor="form-email" className="block text-xs font-bold text-brand-gray-350 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="form-email"
                  value={fields.email}
                  onChange={(e) => setFields({ ...fields, email: e.target.value })}
                  className={`w-full bg-brand-dark/60 border rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald transition-all ${
                    errors.email ? "border-red-500/50" : "border-brand-gray-800/80 hover:border-brand-gray-650"
                  }`}
                  placeholder="name@company.com"
                  disabled={isSubmitting}
                  aria-describedby={errors.email ? "error-email" : undefined}
                />
              </div>
              {errors.email && (
                <span id="error-email" className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </span>
              )}
            </div>

            {/* Input message details */}
            <div className="space-y-1.5">
              <label htmlFor="form-message" className="block text-xs font-bold text-brand-gray-350 uppercase tracking-wider">
                Project Details
              </label>
              <div className="relative">
                <textarea
                  id="form-message"
                  rows={5}
                  value={fields.message}
                  onChange={(e) => setFields({ ...fields, message: e.target.value })}
                  className={`w-full bg-brand-dark/60 border rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald transition-all resize-none ${
                    errors.message ? "border-red-500/50" : "border-brand-gray-800/80 hover:border-brand-gray-650"
                  }`}
                  placeholder="Share details regarding your e‑commerce brand, current monthly ad budgets, and CAC targets..."
                  disabled={isSubmitting}
                  aria-describedby={errors.message ? "error-message" : undefined}
                />
              </div>
              {errors.message && (
                <span id="error-message" className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.message}</span>
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-brand-emerald to-brand-blue text-brand-dark font-heading font-extrabold text-sm hover:opacity-95 transition-opacity flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-emerald disabled:opacity-50"
            >
              <span>{isSubmitting ? "Submitting Request..." : "Submit Growth Request"}</span>
              {!isSubmitting && <Send className="w-4 h-4" />}
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}
