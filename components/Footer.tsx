import React from "react";
import { Linkedin, Mail, FileText, Phone, Award } from "lucide-react";

export default function Footer() {
  const certifications = [
    "Campaign Manager 360",
    "Google Ads Display",
    "AI‑Powered Performance Ads"
  ];

  return (
    <footer className="bg-transparent border-t border-brand-gray-800/60 py-16 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-brand-emerald/40 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">
        {/* Left Column - Intro & Target */}
        <div className="space-y-4">
          <div className="font-heading font-bold text-2xl tracking-tight text-white flex items-center gap-1.5">
            <span>Mibin</span>
            <span className="text-brand-emerald">Thomas</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
          </div>
          <p className="text-brand-gray-400 text-sm max-w-sm leading-relaxed">
            Data‑driven performance marketing and e‑commerce growth specialist. Helping UAE & GCC brands scale campaign budgets, boost ROAS, and optimize customer acquisition costs.
          </p>
        </div>

        {/* Center Column - Certifications */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-brand-emerald">
            Certifications
          </h3>
          <ul className="space-y-2">
            {certifications.map((cert) => (
              <li key={cert} className="flex items-center gap-2.5 text-brand-gray-300 text-sm">
                <Award className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Contact Coordinate & Socials */}
        <div className="space-y-4">
          <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-brand-blue">
            Connect
          </h3>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:mibin@webeyecraft.com"
              className="text-brand-gray-300 hover:text-brand-emerald transition-colors text-sm flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-brand-emerald" />
              <span>mibin@webeyecraft.com</span>
            </a>
            <a
              href="tel:+971566556278"
              className="text-brand-gray-300 hover:text-brand-emerald transition-colors text-sm flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-brand-emerald" />
              <span>+971 56 655 6278</span>
            </a>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-brand-gray-800 hover:bg-brand-emerald hover:text-brand-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              aria-label="Mibin Thomas on LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:mibin@webeyecraft.com"
              className="p-2.5 rounded-full bg-brand-gray-800 hover:bg-brand-emerald hover:text-brand-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              aria-label="Email Mibin Thomas"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2.5 rounded-full bg-brand-gray-800 hover:bg-brand-emerald hover:text-brand-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              aria-label="Download Resume"
            >
              <FileText className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-brand-gray-800/40 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <p className="text-brand-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Mibin Thomas. All rights reserved.
        </p>
        <p className="text-brand-gray-500 text-xs flex items-center gap-2">
          <span>GCC E-Commerce Strategy & Marketing Portfolio</span>
          <span className="w-1 h-1 rounded-full bg-brand-gray-650"></span>
          <span>Dubai, UAE</span>
        </p>
      </div>
    </footer>
  );
}
