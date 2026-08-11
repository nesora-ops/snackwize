import Image from 'next/image'
import { SectionHeader } from "@/components/sections/SectionHeader";
import { Heart, Leaf, Truck, Sparkles, ChefHat, Package, Search } from "lucide-react";
import { PRODUCTS, CLIENT_STORIES } from "@/lib/data";
import { InstagramIcon } from "@/components/layout/SocialIcons";



export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-surface">
        <div className="pointer-events-none absolute inset-0 grain opacity-40" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="font-mono-accent text-xs uppercase tracking-[0.3em] text-primary">Our Story</p>
          <h1 className="mt-3 font-display text-5xl font-bold sm:text-6xl">Hi! I'm Nupur.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Snackwize began in my Mumbai kitchen with one rule — every snack we sell is one I'd happily feed my own family. No shortcuts, no nasties, no compromises.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Image width={800} height={600} src={PRODUCTS.find(p => p.id === "roasty-bhel")!.image} alt="Snackwize kitchen" className="aspect-[4/5] w-full rounded-3xl object-cover" />
          <div>
            <SectionHeader eyebrow="Our Mission" title="Let's Make India Healthy 🇮🇳" sub="We believe Indian snacking deserves better — rooted in real ingredients, traditional flavors, and a modern, honest standard of care." />
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: Heart, label: "Homemade", note: "Every batch, by hand." },
                { icon: Leaf, label: "Clean Ingredients", note: "Whole grains, jaggery, ghee." },
                { icon: Sparkles, label: "Love in Every Bite", note: "Small batches only." },
                { icon: Truck, label: "Pan India Pride", note: "Mumbai to your door." },
              ].map(v => (
                <div key={v.label} className="rounded-2xl border border-border bg-card p-5">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-light text-primary-dark"><v.icon className="h-4 w-4" /></div>
                  <p className="mt-3 font-display text-base font-bold">{v.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{v.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <SectionHeader eyebrow="Our Process" title="From source to your shelf" center />
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {[
              { icon: Search, t: "We Source", d: "Whole-grain flours, raw nuts, jaggery — directly from trusted suppliers." },
              { icon: ChefHat, t: "We Bake", d: "Small batches, baked the same day for unmatched freshness." },
              { icon: Package, t: "We Pack", d: "Resealable, food-safe packaging that keeps every bite crisp." },
              { icon: Truck, t: "We Deliver", d: "Pan India shipping, tracked end-to-end with care." },
            ].map((s, i) => (
              <div key={s.t} className="relative rounded-2xl border border-border bg-card p-6">
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 font-mono-accent text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Step {i + 1}</span>
                <s.icon className="h-7 w-7 text-primary" />
                <p className="mt-4 font-display text-lg font-bold">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 rounded-3xl bg-primary p-10 text-primary-foreground md:grid-cols-2 md:items-center md:p-16">
          <div>
            <p className="font-mono-accent text-xs uppercase tracking-[0.3em] opacity-90">Founder</p>
            <h3 className="mt-3 font-display text-4xl font-bold">Nupur</h3>
            <blockquote className="mt-5 border-l-2 border-primary-foreground/40 pl-5 text-lg italic">
              "Healthy doesn't have to mean boring. With Snackwize, I want every Indian household to have one shelf they don't have to think twice about."
            </blockquote>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: "500+", l: "Happy Customers" },
              { n: "20+", l: "Snack Varieties" },
              { n: "Pan India", l: "Delivery" },
              { n: "0", l: "Preservatives" },
            ].map(s => (
              <div key={s.l} className="rounded-2xl bg-primary-foreground/10 p-5 text-center backdrop-blur">
                <p className="font-display text-3xl font-bold">{s.n}</p>
                <p className="mt-1 font-mono-accent text-[10px] uppercase tracking-wider opacity-90">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-border bg-card p-10 text-center md:p-14">
          <p className="font-mono-accent text-xs uppercase tracking-[0.3em] text-primary">Client Stories</p>
          <h3 className="mt-3 font-display text-3xl font-bold text-foreground">Straight from our customers</h3>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Real messages, unboxings and repeat orders — saved to our Instagram highlights.
          </p>
          <a
            href={CLIENT_STORIES}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-border bg-background px-7 py-3.5 text-sm font-semibold text-foreground shadow-sm transition hover:scale-105 hover:border-primary"
          >
            <InstagramIcon size={20} />
            View on Instagram
          </a>
        </div>
      </section>
    </>
  );
}