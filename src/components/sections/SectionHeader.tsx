export function SectionHeader({ eyebrow, title, sub, center = false }: { eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className="font-mono-accent text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-base text-muted-foreground">{sub}</p>}
    </div>
  );
}