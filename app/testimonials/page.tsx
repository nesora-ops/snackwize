import { Star } from "lucide-react";
import { TESTIMONIALS, WHATSAPP } from "@/lib/data";



export default function Testimonials() {
  return (
    <>
      <section className="relative overflow-hidden bg-surface">
        <div className="pointer-events-none absolute inset-0 grain opacity-40" />
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="font-mono-accent text-xs uppercase tracking-[0.3em] text-primary">Reviews</p>
          <h1 className="mt-3 font-display text-5xl font-bold sm:text-6xl">Love, served fresh.</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">A snack is only as good as the people who keep coming back for more. Thank you, India.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 rounded-3xl bg-primary p-10 text-primary-foreground md:p-14">
          <p className="font-mono-accent text-xs uppercase tracking-[0.3em] opacity-90">Customer of the Month</p>
          <p className="mt-4 font-display text-3xl font-bold leading-snug sm:text-4xl">
            "Snackwize isn't a brand — it's the friend in my pantry who always shows up with the right thing. I trust them with my kids, my parents, and my 4pm cravings."
          </p>
          <p className="mt-4 font-mono-accent text-sm uppercase tracking-wider opacity-90">— Aarti S., Mumbai</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-lg">
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
              <p className="mt-4 text-sm text-foreground/85">"{t.text}"</p>
              <p className="mt-5 font-mono-accent text-xs uppercase tracking-wider text-muted-foreground">{t.name} · {t.city}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">Had a Snackwize moment?</p>
          <a href={WHATSAPP} target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-dark">
            Share Your Experience
          </a>
        </div>
      </section>
    </>
  );
}