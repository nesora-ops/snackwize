'use client'

import React, { useRef } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, MapPin, Instagram, Facebook } from 'lucide-react';
import { Logo } from './Logo';
import { WHATSAPP, INSTAGRAM, FACEBOOK, PHONE } from "@/lib/data";

const COLORS = {
  bg: '#1C1917',
  orange: '#F97316',
  orangeStroke: 'rgba(249,115,22,0.4)',
  orangeDivider: 'rgba(249,115,22,0.15)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',
  textMuted: 'rgba(255,255,255,0.35)',
  textLinks: 'rgba(255,255,255,0.55)',
};

export function FooterWordmark() {
  const gradientRef = useRef<HTMLDivElement>(null)
  const zoneRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gradientRef.current) return
    const rect = gradientRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    gradientRef.current.style.backgroundImage = `
      radial-gradient(
        circle 240px at ${x}px ${y}px,
        #FF8C00 0%,
        #F97316 18%,
        rgba(249,115,22,0.55) 42%,
        rgba(249,115,22,0.1) 65%,
        transparent 80%
      )
    `
  }

  const handleMouseLeave = () => {
    if (!gradientRef.current) return
    gradientRef.current.style.backgroundImage =
      'radial-gradient(circle 220px at -999px -999px, #FF6B00, transparent)'
  }

  return (
    <div className="w-full bg-[#1C1917] pb-6 pt-2">
      <div
        ref={zoneRef}
        className="relative w-full overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Outline base layer */}
        <div
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-center"
          style={{
            fontSize: 'clamp(80px, 18vw, 220px)',
            fontWeight: 900,
            fontFamily: 'Playfair Display, Georgia, serif',
            letterSpacing: '-0.02em',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(249,115,22,0.28)',
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          SNACKWIZE
        </div>

        {/* Gradient reveal layer */}
        <div
          ref={gradientRef}
          className="relative w-full flex items-center justify-center text-center"
          style={{
            fontSize: 'clamp(80px, 18vw, 220px)',
            fontWeight: 900,
            fontFamily: 'Playfair Display, Georgia, serif',
            letterSpacing: '-0.02em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(249,115,22,0.12)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            backgroundImage:
              'radial-gradient(circle 220px at -999px -999px, #FF6B00, transparent)',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          SNACKWIZE
        </div>
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: COLORS.bg }} className="w-full font-sans">
      {/* Zone 1 — Top Content Area */}
      <div className="py-16 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1 — Brand */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Logo className="h-10 w-10 text-[#F97316]" />
              <span 
                style={{ color: COLORS.orange, fontFamily: "'Playfair Display', serif" }} 
                className="text-3xl font-bold"
              >
                Snackwize
              </span>
            </div>
            <p style={{ color: COLORS.textSecondary, fontFamily: "'DM Sans', sans-serif" }} className="text-base">
              Let's Make India Healthy 🇮🇳
            </p>
            <p style={{ color: COLORS.textLinks }} className="text-sm max-w-[260px]">
              Homemade healthy baked snacks, delivered Pan India. No preservatives, made with love by Nupur.
            </p>
            <p 
              style={{ color: COLORS.orange, fontFamily: "'Space Mono', monospace", letterSpacing: '0.1em' }} 
              className="text-sm uppercase"
            >
              Homemade · Baked · Honest
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a 
                href={INSTAGRAM} 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-colors duration-300"
                style={{ color: COLORS.textLinks }}
                onMouseEnter={(e) => e.currentTarget.style.color = COLORS.orange}
                onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textLinks}
              >
                <Instagram size={24} />
              </a>
              <a 
                href={FACEBOOK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-colors duration-300"
                style={{ color: COLORS.textLinks }}
                onMouseEnter={(e) => e.currentTarget.style.color = COLORS.orange}
                onMouseLeave={(e) => e.currentTarget.style.color = COLORS.textLinks}
              >
                <Facebook size={24} />
              </a>
            </div>
          </div>

          {/* Column 2 — Explore */}
          <div>
            <h4 
              style={{ color: COLORS.textPrimary, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.15em' }} 
              className="text-sm font-medium uppercase mb-6"
            >
              Explore
            </h4>
            <ul className="space-y-3 flex flex-col">
              {[
                { name: 'Menu', href: '/menu' },
                { name: 'Our Story', href: '/about' },
                { name: 'Testimonials', href: '/testimonials' },
                { name: 'Contact', href: '/contact' }
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{ color: COLORS.textLinks, fontFamily: "'DM Sans', sans-serif" }}
                  className="text-base transition-all duration-200 hover:text-[#F97316] hover:translate-x-1 w-fit inline-block"
                >
                  {link.name}
                </Link>
              ))}
            </ul>
          </div>

          {/* Column 3 — Ordering. Account links are hidden for the stall event;
              the pages still work at their URLs. */}
          <div>
            <h4
              style={{ color: COLORS.textPrimary, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.15em' }}
              className="text-sm font-medium uppercase mb-6"
            >
              Order
            </h4>
            <ul className="space-y-3 flex flex-col">
              {[
                { name: 'Order Now', href: '/order' },
                { name: 'Browse Menu', href: '/menu' },
                { name: 'Our Story', href: '/about' }
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{ color: COLORS.textLinks, fontFamily: "'DM Sans', sans-serif" }}
                  className="text-base transition-all duration-200 hover:text-[#F97316] hover:translate-x-1 w-fit inline-block"
                >
                  {link.name}
                </Link>
              ))}
            </ul>
          </div>

          {/* Column 4 — Reach Us */}
          <div>
            <h4 
              style={{ color: COLORS.textPrimary, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.15em' }} 
              className="text-sm font-medium uppercase mb-6"
            >
              Reach Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href={`tel:${PHONE.replace(/\s+/g, '')}`}
                  className="flex items-center space-x-3 group w-fit"
                >
                  <Phone size={18} color={COLORS.orange} />
                  <span 
                    style={{ color: COLORS.textSecondary }} 
                    className="text-base transition-colors duration-200 group-hover:text-[#F97316]"
                  >
                    {PHONE}
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href={WHATSAPP} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-3 group w-fit"
                >
                  <MessageCircle size={18} color={COLORS.orange} />
                  <span 
                    style={{ color: COLORS.textSecondary }} 
                    className="text-base transition-colors duration-200 group-hover:text-[#F97316]"
                  >
                    WhatsApp
                  </span>
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin size={18} color={COLORS.orange} />
                <span style={{ color: COLORS.textSecondary }} className="text-base">
                  Mumbai, India
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Divider Row */}
      <div 
        className="w-full border-t" 
        style={{ borderColor: COLORS.orangeDivider }}
      ></div>
      <div className="max-w-7xl mx-auto py-5 px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex space-x-4">
          <a 
            href={INSTAGRAM} 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-colors duration-300"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.orange}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <Instagram size={24} />
          </a>
          <a 
            href={FACEBOOK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-colors duration-300"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.orange}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <Facebook size={24} />
          </a>
        </div>
        <p style={{ color: COLORS.textMuted }} className="text-sm">
          © {new Date().getFullYear()} Snackwize. All rights reserved.
        </p>
      </div>

      {/* Zone 2 — The Giant SNACKWIZE Wordmark */}
      <FooterWordmark />
    </footer>
  );
}