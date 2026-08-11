'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone, Instagram, Facebook, MapPin, ShoppingBag } from 'lucide-react';
import MenuFlow, { MenuSection } from '@/components/ui/menu-flow';
import { WHATSAPP, INSTAGRAM, FACEBOOK, PHONE, PRODUCTS } from '@/lib/data';
import { Logo } from '@/components/layout/Logo';
import { InstagramIcon } from '@/components/layout/SocialIcons';

// Bold "see the reel" CTA for the products that have a post behind them. Reads
// the same instagram_url the /order page uses, so there is one list to update.
function InstagramCTA({ productId, tone = 'dark' }: { productId: string; tone?: 'dark' | 'light' }) {
  const url = PRODUCTS.find((p) => p.id === productId)?.instagram_url;
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:scale-105 ${
        tone === 'dark'
          ? 'border border-white/20 bg-white/10 text-white'
          : 'border border-foreground/10 bg-white text-foreground shadow-sm'
      }`}
    >
      <span className="grid h-5 w-5 place-items-center rounded-md bg-white">
        <InstagramIcon size={15} />
      </span>
      View on Instagram
    </a>
  );
}

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-background">
      <MenuFlow aria-label="Snackwize Menu Story">

        {/* ══════════════════════════════════════
            SECTION 1 — Menu Cover (menupage.png)
            ══════════════════════════════════════ */}
        <MenuSection aria-label="The Menu" className="!p-0" style={{ backgroundColor: '#FAF5EE' }}>
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
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 2 — Thecha Curlies
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Thecha Curlies" className="!p-0" style={{ backgroundColor: '#0D1F0D' }}>
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
              <div className="flex flex-wrap items-center gap-3">
                <InstagramCTA productId="thecha-curlies" />
                <a
                  href="/order"
                  className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary"
                >
                  Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 3 — Jowar Jhatka Sticks
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Jowar Jhatka Sticks" className="!p-0" style={{ backgroundColor: '#1A1005' }}>
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
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/order"
                  className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition"
                  style={{ ['--hover-bg' as string]: '#F5A623' }}
                >
                  <ArrowRight className="h-4 w-4 rotate-180 transition group-hover:-translate-x-1" /> Order Now
                </a>
                <InstagramCTA productId="jowar-jhatka" />
              </div>
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">
                Made with Jowar · Zero Preservatives
              </p>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 4 — Meethi Mathri
            ══════════════════════════════════════ */}
        <MenuSection
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
                  ₹150 · 100g
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

            {/* Right — product photo */}
            <div className="flex-shrink-0 w-full max-w-[320px] md:max-w-[380px]">
              <div
                className="aspect-square rounded-3xl relative overflow-hidden"
                style={{ boxShadow: '0 20px 60px rgba(196,135,58,0.25)' }}
              >
                <Image
                  src="/Meethi Mathri.jpg"
                  alt="Meethi Mathri"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 380px"
                />
              </div>
            </div>
          </div>

          <hr style={{ borderColor: '#C4873A', opacity: 0.2 }} />

          <div className="flex items-end justify-between">
            <p className="font-mono-accent text-[10px] uppercase tracking-widest text-foreground/30">
              Homemade · Small Batch · Festive Edition
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <InstagramCTA productId="meethi-mathri" tone="light" />
              <a
                href="/order"
                className="group inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
              >
                Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </MenuSection>



        {/* ══════════════════════════════════════
            SECTION 5 — Swaad Fit Mathri
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Swaad Fit Mathri" className="!p-0" style={{ backgroundColor: '#1A0F05' }}>
          <div className="absolute inset-0">
            <Image src="/Swaad fit mathri.png" alt="Swaad Fit Mathri" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">05 — Classic Mathri</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight">
                <span style={{ color: '#D97706' }}>Swaad Fit</span><br />
                <span className="italic text-white">Mathri</span>
              </h2>
              <p className="mt-6 max-w-[40ch] text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Crispy, healthy, all-time favourite mathri — baked to perfection in 4 bold flavours. Black Pepper, Hot n Spicy, Classic, and Traditional Sweet.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🫓 4 Flavours</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🌿 Baked Not Fried</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#D97706', boxShadow: '0 4px 20px rgba(217,119,6,0.35)' }}>₹130 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">100% Homemade · No Preservatives · Pan India Delivery</p>
              <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 6 — Beet Drop Mathri
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Beet Drop Mathri" className="!p-0" style={{ backgroundColor: '#1A0510' }}>
          <div className="absolute inset-0">
            <Image src="/Beet drop mathri.png" alt="Beet Drop Mathri" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="ml-auto max-w-[55ch] text-right mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">06 — New Arrival</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight text-white">
                Beet Drop<br /><span className="italic" style={{ color: '#BE185D' }}>Mathri</span>
              </h2>
              <p className="mt-6 text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Beetroot mathri — baked, bold, beautiful. A vibrant twist on the classic with deep earthy sweetness and zero guilt.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🌸 Beetroot Goodness</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">✨ NEW</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#BE185D', boxShadow: '0 4px 20px rgba(190,24,93,0.35)' }}>₹130 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                <ArrowRight className="h-4 w-4 rotate-180 transition group-hover:-translate-x-1" /> Order Now
              </a>
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Baked · Colourful · Healthy</p>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 7 — Nachni Ninjas
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Nachni Ninjas" className="!p-0" style={{ backgroundColor: '#0D1505' }}>
          <div className="absolute inset-0">
            <Image src="/Nachni Ninjas.png" alt="Nachni Ninjas" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">07 — Ragi Crispies</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight">
                <span style={{ color: '#65A30D' }}>Nachni</span><br />
                <span className="italic text-white">Ninjas!</span>
              </h2>
              <p className="mt-6 max-w-[40ch] text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Guilt-free ragi bites — the crunch king. Packed with calcium, loaded with flavour. 4 bold variants: Garlic Sesame, Chilli Garlic, Peri Peri & Onion Sesame.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🌾 Ragi (Nachni) Base</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">💪 High Calcium</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#65A30D', boxShadow: '0 4px 20px rgba(101,163,13,0.35)' }}>₹130 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Ragi · Baked · 4 Flavours</p>
              <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 8 — The Wheat Fix
            ══════════════════════════════════════ */}
        <MenuSection aria-label="The Wheat Fix" className="!p-0" style={{ backgroundColor: '#1A1005' }}>
          <div className="absolute inset-0">
            <Image src="/The Wheat Fix.png" alt="The Wheat Fix" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="ml-auto max-w-[55ch] text-right mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">08 — Wheat Crispies</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight text-white">
                The Wheat<br /><span className="italic" style={{ color: '#FBBF24' }}>Fix</span>
              </h2>
              <p className="mt-6 text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Golden wheat crunch — your all-day snack companion. Light, satisfying, and baked to a perfect crisp in 3 irresistible flavours.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🌾 Whole Wheat</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🔥 Baked Not Fried</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-black" style={{ backgroundColor: '#FBBF24', boxShadow: '0 4px 20px rgba(251,191,36,0.35)' }}>₹130 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                <ArrowRight className="h-4 w-4 rotate-180 transition group-hover:-translate-x-1" /> Order Now
              </a>
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Wheat · 3 Flavours · Zero Guilt</p>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 9 — Beet it Crunch
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Beet it Crunch" className="!p-0" style={{ backgroundColor: '#1A0510' }}>
          <div className="absolute inset-0">
            <Image src="/Beet it crunch.png" alt="Beet it Crunch" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">09 — New Drop</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight">
                <span style={{ color: '#EC4899' }}>Beet it</span><br />
                <span className="italic text-white">Crunch</span>
              </h2>
              <p className="mt-6 max-w-[40ch] text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Baked, bold, beetroot goodness. The vibrant crispie that's as beautiful as it is delicious — earthy, wholesome, satisfyingly crunchy.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🌸 Beetroot Powered</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">✨ NEW</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#EC4899', boxShadow: '0 4px 20px rgba(236,72,153,0.35)' }}>₹150 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Baked · Bold · Beautiful</p>
              <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 10 — Oats Bhel Blast
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Oats Bhel Blast" className="!p-0" style={{ backgroundColor: '#051A0D' }}>
          <div className="absolute inset-0">
            <Image src="/OATS BHEL BLAST.jpg" alt="Oats Bhel Blast" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="ml-auto max-w-[55ch] text-right mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">10 — Bhel & Mixes</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight text-white">
                Oats Bhel<br /><span className="italic" style={{ color: '#22C55E' }}>Blast</span>
              </h2>
              <p className="mt-6 text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                All healthy grains, masala-packed. The bhel that punches above its weight — oats, spice, and everything nice in one satisfying bowl.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🌾 Whole Oats</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🌶 Masala-Packed</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#22C55E', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}>₹130 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                <ArrowRight className="h-4 w-4 rotate-180 transition group-hover:-translate-x-1" /> Order Now
              </a>
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Oats · Healthy · Bhel</p>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 11 — Roasty Bhel
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Roasty Bhel" className="!p-0" style={{ backgroundColor: '#1A0D05' }}>
          <div className="absolute inset-0">
            <Image src="/ROASTY BHEL.webp" alt="Roasty Bhel" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">11 — Family Pack</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight">
                <span style={{ color: '#F97316' }}>Roasty</span><br />
                <span className="italic text-white">Bhel</span>
              </h2>
              <p className="mt-6 max-w-[40ch] text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                The craving queen. The snack for every occasion — a generous 1kg pack for the whole family. Easy snacking, maximum flavour, zero regrets.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🎉 Family Pack 1kg</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🌿 Roasted Grains</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30">₹550 · 1kg</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Family Size · Roasted · Homemade</p>
              <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 12 — Makhana Madness
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Makhana Madness" className="!p-0" style={{ backgroundColor: '#0D0D1A' }}>
          <div className="absolute inset-0">
            <Image src="/Makhana madness.jpg" alt="Makhana Madness" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="ml-auto max-w-[55ch] text-right mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">12 — Premium Makhana</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight text-white">
                Makhana<br /><span className="italic" style={{ color: '#A78BFA' }}>Madness</span>
              </h2>
              <p className="mt-6 text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Fluffy foxnut bhel mix — premium grade makhana, roasted and seasoned in a generous 1kg pack. Light, protein-rich, utterly addictive.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">⭐ Foxnut (Makhana)</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">💎 Premium 1kg</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#7C3AED', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>₹1800 · 1kg</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                <ArrowRight className="h-4 w-4 rotate-180 transition group-hover:-translate-x-1" /> Order Now
              </a>
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Makhana · Premium · 1kg Pack</p>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 13 — Almond Cranberry Oat Cake
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Almond Cranberry Oat Cake" className="!p-0" style={{ backgroundColor: '#1A0A05' }}>
          <div className="absolute inset-0">
            <Image src="/ALMOND CRANBERRY OAT CAKE.jpg" alt="Almond Cranberry Oat Cake" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">13 — Bakes · New</p>
              <h2 className="font-display text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[0.88] tracking-tight">
                <span style={{ color: '#F59E0B' }}>Almond Cranberry</span><br />
                <span className="italic text-white">Oat Cake</span>
              </h2>
              <p className="mt-6 max-w-[40ch] text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                No sugar, no butter, no maida — and absolutely no compromise on taste. A wholesome, celebration-worthy bake from Nupur's kitchen.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🌰 Almond & Cranberry</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🍰 No Sugar · No Maida</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-black" style={{ backgroundColor: '#F59E0B', boxShadow: '0 4px 20px rgba(245,158,11,0.35)' }}>₹650 · 250g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">No Sugar · No Butter · No Maida</p>
              <div className="flex flex-wrap items-center gap-3">
                <InstagramCTA productId="almond-cranberry-oat-cake" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                  Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </MenuSection>




        {/* ══════════════════════════════════════
            SECTION 6 — Ready to Order + Footer
            ══════════════════════════════════════ */}
        <MenuSection
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
                  href="/order"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-2xl shadow-primary/30 transition hover:bg-primary-dark hover:scale-105"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Start your order
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
        </MenuSection>

      </MenuFlow>
    </div>
  );
}