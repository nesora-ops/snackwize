export function SectionHeader({
  eyebrow,
  title,
  sub,
  center = false,
  // A page needs exactly one h1. Pages whose opening section is a SectionHeader
  // (rather than a hero) pass as="h1" here so the heading order stays sane.
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className="font-mono-accent text-xs uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
      <Heading className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">{title}</Heading>
      {sub && <p className="mt-3 text-base text-muted-foreground">{sub}</p>}
    </div>
  );
}
