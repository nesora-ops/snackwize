import Image from 'next/image'
import type { ReactNode } from 'react'

/**
 * Nupur's photo and her own words, in the orange panel. Shared by the home page
 * and /about so the two can't drift; `children` is the slot below — stats on
 * /about, the Order / Read-the-story buttons on the home page.
 *
 * The copy is hers verbatim, casual spelling and all. Don't tidy it.
 */
export function FounderSection({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-3xl bg-primary p-8 text-primary-foreground md:p-16">
      {/* CSS grid tracks are space-separated — a comma here silently invalidates
          the template and the photo blows out to full width. */}
      <div className="grid gap-10 md:grid-cols-[20rem_1fr] md:items-center md:gap-14">
        <Image
          width={485}
          height={596}
          src="/founder_image.png"
          alt="Nupur, founder of Snackwize, piping icing onto a cake in her kitchen"
          sizes="(min-width: 768px) 20rem, 24rem"
          className="mx-auto w-full max-w-sm rounded-3xl object-cover shadow-2xl md:mx-0"
        />
        <div>
          <p className="font-mono-accent text-xs uppercase tracking-[0.3em] opacity-90">Founder</p>
          <h2 className="mt-3 font-display text-4xl font-bold">Nupur</h2>
          <blockquote className="mt-5 border-l-2 border-primary-foreground/40 pl-5 text-lg leading-relaxed">
            Hi! Thats Me! Nupur and I am so glad you all LOVEE SNACKWIZE✨💕 All your love
            motivates me to create so many new, healthy recipes and thats my biggest strength💪
            New additions are coming up to the menu and I hope you all are as excited as I am ✨
          </blockquote>
        </div>
      </div>

      {children ? <div className="mt-12">{children}</div> : null}
    </div>
  )
}
