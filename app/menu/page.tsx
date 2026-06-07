'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone, Instagram, Facebook, MapPin } from 'lucide-react';
import FlowArt, { FlowSection } from '@/components/ui/story-scroll';
import { WHATSAPP, INSTAGRAM, FACEBOOK, PHONE } from '@/lib/data';
import { Logo } from '@/components/layout/Logo';

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-background">
      <FlowArt aria-label="Snackwize Menu Story">

        {/* ══════════════════════════════════════
            SECTION 1 — Menu Cover (menupage.png)
            ══════════════════════════════════════ */}
        <FlowSection aria-label="The Menu" className="!p-0" style={{ backgroundColor: '#FAF5EE' }}>
          {/* Entire image fits the screen without being cropped */}
          <div className="absolute inset-0 p-[2vw] md:p-[4vw]">
            <div className="relative w-full h-full">
              <Image
                src="/menupage.png"
                alt="Snackwize Menu Cover"
                fill
                className="object-contain object-center"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </FlowSection>


        {/* ══════════════════════════════════════
            SECTION 2 — Thecha Curlies
            ══════════════════════════════════════ */}
        <FlowSection aria-label="Thecha Curlies" className="!p-0" style={{ backgroundColor: '#0D1F0D' }}>
          <div className="absolute inset-0">
            <Image
              src="/thecha curlies.png"
              alt="Thecha Curlies"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>

          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">

            {/* Product name */}
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">
                02 — Featured Product
              </p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight">
                {/* Thecha = Bottle Green */}
                <span style={{ color: '#1A5C1A' }}>Thecha</span>
                <br />
                {/* Curlies = White */}
                <span className="italic text-white">Curlies</span>
              </h2>
              <p className="mt-6 max-w-[40ch] text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Fiery Maharashtrian thecha meets baked curly snacks. Bold, crunchy, dangerously addictive — with zero guilt.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                  🌶 Spicy &amp; Bold
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                  🌿 Baked Not Fried
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30">
                  ₹120 · 120g
                </span>
              </div>
            </div>

            <hr className="border-white/20" />

            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">
                100% Homemade · No Preservatives · Pan India Delivery
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary"
              >
                Order on WhatsApp <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </FlowSection>


        {/* ══════════════════════════════════════
            SECTION 3 — Jowar Jhatka Sticks
            ══════════════════════════════════════ */}
        <FlowSection aria-label="Jowar Jhatka Sticks" className="!p-0" style={{ backgroundColor: '#1A1005' }}>
          <div className="absolute inset-0">
            <Image
              src="/jowar jhatka.png"
              alt="Jowar Jhatka Sticks"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
          </div>

          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">

            <div className="ml-auto max-w-[55ch] text-right">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">
                03 — Featured Product
              </p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight text-white">
                Jowar<br />
                <span className="italic" style={{ color: '#F5A623' }}>Jhatka</span><br />
                Sticks
              </h2>
              <p className="mt-6 text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Ancient jowar grain. Modern crunch. Packed with fiber, kissed with spice. The guilt-free munch that hits different.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                  🌾 Rich in Fiber
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                  🔥 Baked Not Fried
                </span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#F5A623', boxShadow: '0 4px 20px rgba(245,166,35,0.35)' }}>
                  ₹130 · 130g
                </span>
              </div>
            </div>

            <hr className="border-white/20" />

            <div className="flex items-center justify-between">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition"
                style={{ ['--hover-bg' as string]: '#F5A623' }}
              >
                <ArrowRight className="h-4 w-4 rotate-180 transition group-hover:-translate-x-1" /> Order on WhatsApp
              </a>
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">
                Made with Jowar · Zero Preservatives
              </p>
            </div>
          </div>
        </FlowSection>


        {/* ══════════════════════════════════════
            SECTION 4 — Meethi Mathri
            ══════════════════════════════════════ */}
        <FlowSection
          aria-label="Meethi Mathri"
          style={{ backgroundColor: '#FDF3E3' }}
        >
          {/* Decorative background pattern */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
            {/* Radial pattern decoration */}
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="absolute opacity-10"
                style={{
                  width: `${80 + i * 20}px`,
                  top: `${[10, 60, 30, 70, 15][i]}%`,
                  left: `${[75, 82, 88, 70, 92][i]}%`,
                }}
                viewBox="0 0 80 80"
              >
                <circle cx="40" cy="40" r="38" stroke="#C4873A" strokeWidth="1.5" fill="none"/>
                <circle cx="40" cy="40" r="26" stroke="#C4873A" strokeWidth="1.5" fill="none"/>
                <circle cx="40" cy="40" r="14" stroke="#C4873A" strokeWidth="1.5" fill="none"/>
                <circle cx="40" cy="40" r="4" fill="#C4873A" opacity="0.5"/>
              </svg>
            ))}
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row items-center gap-[4vw] flex-1">
            {/* Left — product info */}
            <div className="flex-1">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-foreground/40 mb-3">
                04 — New Arrival
              </p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight text-foreground">
                Meethi<br />
                <span className="italic text-primary">Mathri</span>
              </h2>
              <p className="mt-6 max-w-[42ch] text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-foreground/60">
                The classic festive mathri — reimagined as a sweet, melt-in-your-mouth bake. Jaggery-kissed, fennel-scented, made in small batches for big occasions.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-5 py-2 text-sm font-semibold text-amber-800">
                  🍯 Jaggery Sweetened
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 text-sm font-semibold text-orange-800">
                  🌿 Fennel &amp; Cardamom
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30">
                  Coming Soon
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-8">
                {[
                  { label: 'Weight', value: '~200g' },
                  { label: 'Pieces', value: '12 pcs' },
                  { label: 'Shelf Life', value: '15 days' },
                  { label: 'Contains', value: 'Wheat · Jaggery · Ghee' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-mono-accent text-[10px] uppercase tracking-widest text-foreground/40">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual placeholder */}
            <div className="flex-shrink-0 w-full max-w-[320px] md:max-w-[380px]">
              <div
                className="aspect-square rounded-3xl flex flex-col items-center justify-center text-center p-8 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #F5DEB3 0%, #FAEBD7 50%, #FFE4B5 100%)', boxShadow: '0 20px 60px rgba(196,135,58,0.25)' }}
              >
                <div className="text-7xl mb-4">🍪</div>
                <p className="font-display text-2xl font-bold text-amber-900">Meethi Mathri</p>
                <p className="mt-2 text-sm text-amber-700/70">Photography coming soon</p>
                <div
                  className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full"
                  style={{ backgroundColor: 'rgba(249,115,22,0.15)' }}
                />
                <div
                  className="absolute -top-8 -left-8 h-24 w-24 rounded-full"
                  style={{ backgroundColor: 'rgba(196,135,58,0.2)' }}
                />
              </div>
            </div>
          </div>

          <hr style={{ borderColor: '#C4873A', opacity: 0.2 }} />

          <div className="flex items-end justify-between">
            <p className="font-mono-accent text-[10px] uppercase tracking-widest text-foreground/30">
              Homemade · Small Batch · Festive Edition
            </p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
            >
              Notify me <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          </div>
        </FlowSection>


        {/* ══════════════════════════════════════
            SECTION 5 — Homemade Cheeseburger
            ══════════════════════════════════════ */}
        <FlowSection
          aria-label="Homemade Cheeseburger"
          style={{ backgroundColor: '#1C1410' }}
        >
          {/* Warm dark background with soft glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-yellow-800/20 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-orange-900/20 blur-3xl" />
          </div>

          {/* Center spotlight layout */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center gap-8">
            {/* Giant emoji placeholder with glow */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-yellow-500/10 blur-3xl scale-150" />
              <div
                className="relative flex h-48 w-48 md:h-64 md:w-64 items-center justify-center rounded-full text-[6rem] md:text-[8rem]"
                style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(28,20,16,0) 70%)' }}
              >
                🍔
              </div>
            </div>

            <div>
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/30 mb-4">
                05 — Next Drop
              </p>
              <h2 className="font-display text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[0.9] tracking-tight text-white">
                Homemade<br />
                <span className="italic" style={{ color: '#FBBF24' }}>Cheeseburger</span>
              </h2>
              <p className="mt-6 max-w-[40ch] mx-auto text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/50">
                Nupur&apos;s kitchen is working on something extraordinary. A homemade cheeseburger experience — every element crafted from scratch, no shortcuts.
              </p>
            </div>

            {/* Teaser badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {['🧀 House Cheese Sauce', '🥩 Signature Patty', '🍞 Brioche Bun', '🥗 Fresh Greens'].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/60 backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Notify CTA */}
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-black transition hover:scale-105"
              style={{ backgroundColor: '#FBBF24', boxShadow: '0 8px 30px rgba(251,191,36,0.3)' }}
            >
              <MessageCircle className="h-4 w-4" />
              Notify me on WhatsApp
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          </div>

          <hr className="border-white/10 relative z-10" />

          <div className="relative z-10 flex items-center justify-between">
            <p className="font-mono-accent text-[10px] uppercase tracking-widest text-white/20">
              Snackwize Kitchen · Mumbai
            </p>
            <p className="font-mono-accent text-[10px] uppercase tracking-widest text-yellow-500/50">
              Drop Date: TBA
            </p>
          </div>
        </FlowSection>


        {/* ══════════════════════════════════════
            SECTION 6 — Ready to Order + Footer
            ══════════════════════════════════════ */}
        <FlowSection
          aria-label="Ready to Order"
          style={{ backgroundColor: '#1C1917' }}
        >
          {/* Subtle grain overlay */}
          <div className="pointer-events-none absolute inset-0 grain opacity-[0.03]" />
          {/* Orange glow */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[60%] rounded-full bg-primary/10 blur-3xl" />

          {/* Big CTA */}
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 flex-1">
            <div>
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/30 mb-4">
                06 — Order Now
              </p>
              <h2 className="font-display text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.88] tracking-tight text-white">
                Ready<br />to<br />
                <span className="italic text-primary">Order?</span>
              </h2>
            </div>
            <div className="flex flex-col gap-4 md:text-right max-w-[40ch]">
              <p className="text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/60">
                Every order is packed with love by Nupur. Fresh made to order, shipped Pan India within 2–4 days.
              </p>
              <div className="flex flex-wrap md:justify-end gap-3">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-primary/30 transition hover:bg-primary-dark hover:scale-105"
                >
                  <MessageCircle className="h-4 w-4" />
                  Order on WhatsApp
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-primary hover:text-primary"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          <hr className="border-white/10 relative z-10" />

          {/* Mini Footer */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
            {/* Brand */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Logo className="h-8 w-8 text-primary" />
                <span className="font-display text-xl font-bold text-primary">Snackwize</span>
              </div>
              <p className="text-sm text-white/50 max-w-[26ch]">
                Let&apos;s Make India Healthy 🇮🇳<br />
                Homemade · Baked · Honest
              </p>
              <div className="flex items-center gap-3 mt-1">
                <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="text-white/30 hover:text-primary transition">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href={FACEBOOK} target="_blank" rel="noreferrer" className="text-white/30 hover:text-primary transition">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="text-white/30 hover:text-primary transition">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p className="font-mono-accent text-[10px] uppercase tracking-widest text-white/30 mb-4">Explore</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Testimonials', href: '/testimonials' },
                  { label: 'Contact', href: '/contact' },
                ].map(({ label, href }) => (
                  <Link key={href} href={href} className="text-sm text-white/45 hover:text-primary transition">
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="font-mono-accent text-[10px] uppercase tracking-widest text-white/30 mb-4">Reach Us</p>
              <div className="flex flex-col gap-3">
                <a href={`tel:${PHONE.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-sm text-white/45 hover:text-primary transition">
                  <Phone className="h-4 w-4 text-primary" /> {PHONE}
                </a>
                <a href={WHATSAPP} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-white/45 hover:text-primary transition">
                  <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp
                </a>
                <span className="flex items-center gap-2 text-sm text-white/45">
                  <MapPin className="h-4 w-4 text-primary" /> Mumbai, India
                </span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/[0.07]">
            <p className="text-xs text-white/25">
              © {new Date().getFullYear()} Snackwize. All rights reserved.
            </p>
            <p className="font-mono-accent text-[10px] uppercase tracking-widest text-white/20">
              Made with ❤️ in Mumbai
            </p>
          </div>
        </FlowSection>

      </FlowArt>
    </div>
  );
}