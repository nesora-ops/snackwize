'use client'

import Image from 'next/image'

// True for products that have no real photo yet — either an empty column or one
// of the grey placehold.co URLs seeded before photography existed.
export function hasPhoto(src?: string | null): boolean {
  return !!src && !src.includes('placehold.co')
}

/**
 * A product photo, or an on-brand tile when there isn't one yet.
 *
 * The fallback is drawn in CSS rather than fetched, so a product awaiting
 * photography costs no network request and never renders as a broken image.
 * It disappears on its own the moment a real `src` is set.
 */
export function ProductImage({
  src,
  alt,
  sizes,
  className,
  compact,
}: {
  src?: string | null
  alt: string
  sizes: string
  className?: string
  compact?: boolean
}) {
  if (hasPhoto(src)) {
    return <Image src={src!} alt={alt} fill sizes={sizes} className={className} style={{ objectFit: 'cover' }} />
  }

  return (
    <div
      aria-label={`${alt} — photo coming soon`}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? '2px' : '6px',
        textAlign: 'center',
        padding: compact ? '6px' : '14px',
        background: 'linear-gradient(135deg, #F5EFE6 0%, #EFE4D6 55%, #F7E8D6 100%)',
      }}
    >
      <span style={{ fontSize: compact ? '20px' : '34px', lineHeight: 1 }}>🧡</span>
      <span
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          color: '#8C6A4E',
          fontSize: compact ? '10px' : '14px',
          lineHeight: 1.2,
        }}
      >
        {alt}
      </span>
      <span
        style={{
          fontSize: compact ? '8px' : '10px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#B59B80',
          fontWeight: 600,
        }}
      >
        Photo coming soon
      </span>
    </div>
  )
}
