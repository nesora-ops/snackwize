'use client'

import Image from 'next/image'
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Cookie, Leaf, Truck, Flame, Instagram, Star } from "lucide-react";
import { ProductCard } from "@/components/sections/ProductCard";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { PRODUCTS, TESTIMONIALS, WHATSAPP, INSTAGRAM } from "@/lib/data";



export default function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface">
        <div className="pointer-events-none absolute inset-0 grain opacity-40" />
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary-light blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:py-28 md:gap-6">
          <div className="flex flex-col justify-center">
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-mono-accent text-xs uppercase tracking-[0.25em] text-primary">
              Homemade · Baked · Honest
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 font-display text-5xl font-bold leading-[1.05] text-foreground sm:text-6xl">
              Guilt-Free <span className="text-primary">Snacking</span>, Delivered to Your Door.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              Small-batch baked snacks from Nupur's Mumbai kitchen — real ingredients, zero preservatives, shipped Pan India with love.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8 flex flex-wrap gap-3">
              <Link href="/menu" className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary-dark">
                Explore Menu <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
                Order on WhatsApp
              </a>
            </motion.div>
            <p className="mt-6 font-mono-accent text-xs text-muted-foreground">🇮🇳 Let's Make India Healthy</p>
          </div>

          <div className="relative h-[420px] md:h-[520px]">
            {[
              { src: PRODUCTS[0].image, c: "top-0 left-6 w-56 rotate-[-6deg]", d: 0 },
              { src: PRODUCTS[3].image, c: "top-24 right-0 w-52 rotate-[8deg]", d: 0.15 },
              { src: PRODUCTS[4].image, c: "bottom-0 left-0 w-48 rotate-[5deg]", d: 0.3 },
              { src: PRODUCTS[7].image, c: "bottom-8 right-8 w-44 rotate-[-9deg]", d: 0.45 },
            ].map((it, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{ delay: it.d, y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" } }}
                className={`absolute overflow-hidden rounded-3xl border-4 border-background shadow-xl ${it.c}`}
              >
                <Image width={800} height={600} src={it.src} alt="" className="aspect-square w-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 md:grid-cols-4">
          {[
            { icon: Cookie, label: "100% Homemade" },
            { icon: Truck, label: "Pan India Delivery" },
            { icon: Leaf, label: "No Preservatives" },
            { icon: Flame, label: "Baked Not Fried" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-light text-primary-dark">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <SectionHeader eyebrow="Bestsellers" title="Our most-loved snacks" sub="Hand-baked in small batches. Limited daily quantities." />
          <Link href="/menu" className="hidden text-sm font-semibold text-primary hover:text-primary-dark md:inline-flex">View full menu →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.slice(0, 9).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Story teaser */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div className="relative">
            <Image width={800} height={600} src={PRODUCTS[2].image} alt="Snacks" className="aspect-[4/5] w-full rounded-3xl object-cover" />
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-background px-5 py-4 shadow-xl md:block">
              <p className="font-mono-accent text-xs uppercase tracking-wider text-primary">Since 2023</p>
              <p className="mt-1 font-display text-xl font-bold">500+ happy bellies</p>
            </div>
          </div>
          <div>
            <p className="font-mono-accent text-xs uppercase tracking-[0.25em] text-primary">Our Story</p>
            <h2 className="mt-3 font-display text-4xl font-bold">A kitchen, a craving, and a mission.</h2>
            <blockquote className="mt-6 border-l-4 border-primary pl-5 text-lg italic text-foreground/80">
              "I started Snackwize because I wanted snacks that I could feed my family without thinking twice. Today, we ship that same care across India."
            </blockquote>
            <p className="mt-3 text-sm font-semibold text-primary-dark">— Nupur, Founder</p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary">
              Read our story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="Word of mouth" title="Loved across India" center />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="mt-4 text-sm text-foreground/85">"{t.text}"</p>
              <p className="mt-4 font-mono-accent text-xs uppercase tracking-wider text-muted-foreground">{t.name} · {t.city}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram strip */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-mono-accent text-xs uppercase tracking-[0.25em] text-primary">@snackwize</p>
              <h3 className="mt-2 font-display text-2xl font-bold">From our kitchen to your feed</h3>
            </div>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] px-5 py-2.5 text-sm font-semibold text-white">
              <Instagram className="h-4 w-4" /> Follow
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
            {PRODUCTS.slice(0, 9).map((p) => (
              <a key={p.id} href={INSTAGRAM} target="_blank" rel="noreferrer" className="group relative aspect-square overflow-hidden rounded-xl">
                <Image width={800} height={600} src={p.image} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433]/0 via-[#dc2743]/0 to-[#bc1888]/0 opacity-0 transition group-hover:from-[#f09433]/60 group-hover:via-[#dc2743]/60 group-hover:to-[#bc1888]/60 group-hover:opacity-100" />
                <Instagram className="absolute inset-0 m-auto h-6 w-6 text-white opacity-0 transition group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
