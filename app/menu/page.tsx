'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone, Instagram, Facebook, MapPin, ShoppingBag } from 'lucide-react';
import MenuFlow, { MenuSection } from '@/components/ui/menu-flow';
import { WHATSAPP, INSTAGRAM, FACEBOOK, PHONE, PRODUCTS } from '@/lib/data';
import { Logo } from '@/components/layout/Logo';
import { MenuAddToCart } from '@/components/menu/MenuAddToCart';
import { MenuCartBar } from '@/components/menu/MenuCartBar';
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
            SECTION 2 — Cheese Tease Stix
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Cheese Tease Stix" className="!p-0" style={{ backgroundColor: '#1A1205' }}>
          <div className="absolute inset-0">
            <Image src="/cheese_tease_menu_flow.png" alt="Cheese Tease Stix" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">02 — Crispies · New</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight">
                <span style={{ color: '#FBBF24' }}>Cheese Tease</span><br />
                <span className="italic text-white">Stix</span>
              </h2>
              <p className="mt-6 max-w-[40ch] text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Real cheese, baked into a stick you cannot put down. Four ways to tease — Pepper, Peri Peri, Paprika and Classic Cheese.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🧀 4 Flavours</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🌿 Baked Not Fried</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-black" style={{ backgroundColor: '#FBBF24', boxShadow: '0 4px 20px rgba(251,191,36,0.35)' }}>₹220 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Cheesy · Crunchy · Guilt-Free</p>
              <div className="flex flex-wrap items-center gap-3">
                <MenuAddToCart productId="cheese-tease-stix" />
                <InstagramCTA productId="cheese-tease-stix" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
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
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#F5A623', boxShadow: '0 4px 20px rgba(245,166,35,0.35)' }}>
                  ₹145 · 100g
                </span>
              </div>
            </div>

            <hr className="border-white/20" />

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <MenuAddToCart productId="jowar-jhatka" />
                <a href="/order"
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
            SECTION 4 — Swaad Fit Mathri
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Swaad Fit Mathri" className="!p-0" style={{ backgroundColor: '#1A0F05' }}>
          <div className="absolute inset-0">
            <Image src="/Swaad fit mathri.png" alt="Swaad Fit Mathri" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">04 — Classic Mathri</p>
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
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#D97706', boxShadow: '0 4px 20px rgba(217,119,6,0.35)' }}>₹145 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">100% Homemade · No Preservatives · Pan India Delivery</p>
              <MenuAddToCart productId="swaad-fit-mathri" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 5 — Nachni Ninjas
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Nachni Ninjas" className="!p-0" style={{ backgroundColor: '#0D1505' }}>
          <div className="absolute inset-0">
            <Image src="/Nachni Ninjas.png" alt="Nachni Ninjas" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">05 — Ragi Crispies</p>
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
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#65A30D', boxShadow: '0 4px 20px rgba(101,163,13,0.35)' }}>₹190 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Ragi · Baked · 4 Flavours</p>
              <MenuAddToCart productId="nachni-ninjas" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 6 — Beet it Crunch
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Beet it Crunch" className="!p-0" style={{ backgroundColor: '#1A0510' }}>
          <div className="absolute inset-0">
            <Image src="/Beet it crunch.png" alt="Beet it Crunch" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">06 — New Drop</p>
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
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#EC4899', boxShadow: '0 4px 20px rgba(236,72,153,0.35)' }}>₹180 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Baked · Bold · Beautiful</p>
              <MenuAddToCart productId="beet-it-crunch" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 7 — Oats Bhel Blast
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Oats Bhel Blast" className="!p-0" style={{ backgroundColor: '#051A0D' }}>
          <div className="absolute inset-0">
            <Image src="/OATS BHEL BLAST.jpg" alt="Oats Bhel Blast" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="ml-auto max-w-[55ch] text-right mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">07 — Bhel & Mixes</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight text-white">
                Oats Bhel<br /><span className="italic" style={{ color: '#22C55E' }}>Blast</span>
              </h2>
              <p className="mt-6 text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                All healthy grains, masala-packed. The bhel that punches above its weight — oats, spice, and everything nice in one satisfying bowl.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🌾 Whole Oats</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">🌶 Masala-Packed</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#22C55E', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}>₹145 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <MenuAddToCart productId="oats-bhel-blast" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                <ArrowRight className="h-4 w-4 rotate-180 transition group-hover:-translate-x-1" /> Order Now
              </a>
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Oats · Healthy · Bhel</p>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 8 — Roasty Bhel
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Roasty Bhel" className="!p-0" style={{ backgroundColor: '#1A0D05' }}>
          <div className="absolute inset-0">
            <Image src="/roasty-bhel.webp" alt="Roasty Bhel" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">08 — Family Pack</p>
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
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30">₹600 · 1kg</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Family Size · Roasted · Homemade</p>
              <MenuAddToCart productId="roasty-bhel" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 9 — Almond Cranberry Oat Cake
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Almond Cranberry Oat Cake" className="!p-0" style={{ backgroundColor: '#1A0A05' }}>
          <div className="absolute inset-0">
            <Image src="/ALMOND CRANBERRY OAT CAKE.jpg" alt="Almond Cranberry Oat Cake" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">09 — Bakes · New</p>
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
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-black" style={{ backgroundColor: '#F59E0B', boxShadow: '0 4px 20px rgba(245,158,11,0.35)' }}>₹715 · 250g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">No Sugar · No Butter · No Maida</p>
              <div className="flex flex-wrap items-center gap-3">
                <MenuAddToCart productId="almond-cranberry-oat-cake" />
                <InstagramCTA productId="almond-cranberry-oat-cake" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                  Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 10 — Thecha Curlies
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
                10 — Featured Product
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
                  ₹190 · 100g
                </span>
              </div>
            </div>

            <hr className="border-white/20" />

            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">
                100% Homemade · No Preservatives · Pan India Delivery
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <MenuAddToCart productId="thecha-curlies" />
                <InstagramCTA productId="thecha-curlies" />
                <a href="/order"
                  className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary"
                >
                  Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 11 — Sattu Power Bites
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Sattu Power Bites" className="!p-0" style={{ backgroundColor: '#1A1405' }}>
          <div className="absolute inset-0">
            <Image src="/sattu-power-bites.webp" alt="Sattu Power Bites" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="ml-auto max-w-[55ch] text-right mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">11 — New Drop</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight text-white">
                Sattu Power<br /><span className="italic" style={{ color: '#CA8A04' }}>Bites</span>
              </h2>
              <p className="mt-6 text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Roasted sattu goodness in every bite. A fresh drop from Nupur's kitchen.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">✨ NEW</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#CA8A04' }}>₹225 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <MenuAddToCart productId="sattu-power-bites" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                  <ArrowRight className="h-4 w-4 rotate-180 transition group-hover:-translate-x-1" /> Order Now
                </a>
              </div>
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Sattu · Baked · New Drop</p>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 12 — Oats Berry Blast
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Oats Berry Blast" className="!p-0" style={{ backgroundColor: '#1A0510' }}>
          <div className="absolute inset-0">
            <Image src="/oats-berry-blast.webp" alt="Oats Berry Blast" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">12 — New Drop</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight">
                <span style={{ color: '#E11D48' }}>Oats Berry</span><br />
                <span className="italic text-white">Blast</span>
              </h2>
              <p className="mt-6 max-w-[40ch] text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Wholesome oats with a burst of berry. Grab a 100g pack, or go big with 1kg.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">✨ NEW</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#E11D48' }}>₹225 · 100g</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#E11D48' }}>₹2000 · 1kg</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Oats · Berry · New Drop</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono-accent text-[11px] uppercase tracking-widest text-white/50">100g</span>
                <MenuAddToCart productId="oats-berry-blast" />
                <span className="font-mono-accent text-[11px] uppercase tracking-widest text-white/50">1kg</span>
                <MenuAddToCart productId="oats-berry-blast-1kg" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                  Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 13 — Rosemary Rockers
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Rosemary Rockers" className="!p-0" style={{ backgroundColor: '#0D1A0D' }}>
          <div className="absolute inset-0">
            <Image src="/rosemary-rockers.webp" alt="Rosemary Rockers" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="ml-auto max-w-[55ch] text-right mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">13 — New Drop</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight text-white">
                Rosemary<br /><span className="italic" style={{ color: '#65A30D' }}>Rockers</span>
              </h2>
              <p className="mt-6 text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Herby rosemary crunch, freshly baked.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">✨ NEW</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#65A30D' }}>₹190 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <MenuAddToCart productId="rosemary-rockers" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                  <ArrowRight className="h-4 w-4 rotate-180 transition group-hover:-translate-x-1" /> Order Now
                </a>
              </div>
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Rosemary · Baked · New Drop</p>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 14 — Rosemary Cheese Rockers
            ══════════════════════════════════════ */}
        <MenuSection aria-label="Rosemary Cheese Rockers" className="!p-0" style={{ backgroundColor: '#141A05' }}>
          <div className="absolute inset-0">
            <Image src="/rosemary-cheese-rockers.webp" alt="Rosemary Cheese Rockers" fill className="object-cover object-center" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">14 — New Drop</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight">
                <span style={{ color: '#CA8A04' }}>Rosemary Cheese</span><br />
                <span className="italic text-white">Rockers</span>
              </h2>
              <p className="mt-6 max-w-[40ch] text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Rosemary and cheese in one baked crunch.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">✨ NEW</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#CA8A04' }}>₹210 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Rosemary · Cheese · New Drop</p>
              <div className="flex flex-wrap items-center gap-3">
                <MenuAddToCart productId="rosemary-cheese-rockers" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                  Order Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 15 — Roasty Oats Bhel
            ══════════════════════════════════════ */}
        {/* Photo coming: swap the glow layer for an <Image> like the sections above. */}
        <MenuSection aria-label="Roasty Oats Bhel" className="!p-0" style={{ backgroundColor: '#1A0D05' }}>
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 45%, #F9731655, transparent 60%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
          <div className="relative z-10 flex h-full min-h-screen flex-col justify-between px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]">
            <div className="ml-auto max-w-[55ch] text-right mt-[20vh]">
              <p className="font-mono-accent text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">15 — New Drop</p>
              <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-tight text-white">
                Roasty Oats<br /><span className="italic" style={{ color: '#F97316' }}>Bhel</span>
              </h2>
              <p className="mt-6 text-[clamp(1rem,1.8vw,1.3rem)] font-normal leading-relaxed text-white/70">
                Roasted oats bhel, light and masala-packed.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">✨ NEW</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur-sm">📸 Photo coming soon</span>
                <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ backgroundColor: '#F97316' }}>₹180 · 100g</span>
              </div>
            </div>
            <hr className="border-white/20" />
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <MenuAddToCart productId="roasty-oats-bhel" />
                <a href="/order" className="group inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-primary hover:border-primary">
                  <ArrowRight className="h-4 w-4 rotate-180 transition group-hover:-translate-x-1" /> Order Now
                </a>
              </div>
              <p className="font-mono-accent text-[11px] uppercase tracking-widest text-white/35">Oats · Roasted · New Drop</p>
            </div>
          </div>
        </MenuSection>


        {/* ══════════════════════════════════════
            SECTION 16 — Ready to Order + Footer
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
                16 — Order Now
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
      <MenuCartBar />
    </div>
  );
}