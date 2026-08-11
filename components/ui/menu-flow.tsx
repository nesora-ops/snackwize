'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Drop-in replacement for FlowArt/FlowSection with the same props, minus the
 * scroll hijacking.
 *
 * FlowArt pinned every section and scrub-rotated the incoming one 30°→0°, which
 * fights the browser's own scrolling: momentum, the scrollbar and Android's
 * swipe-back all stop behaving. Here sections simply stack and scroll natively,
 * with a short fade-and-rise as each comes into view. Honours
 * prefers-reduced-motion for free — Framer Motion skips the animation.
 */

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

export interface MenuSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  className,
  style = {},
  children,
  'aria-label': ariaLabel,
}) => (
  <section
    aria-label={ariaLabel}
    className={cx('relative min-h-screen w-full overflow-hidden', className)}
  >
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative flex min-h-screen w-full flex-col justify-between gap-6 px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw]"
      style={style}
    >
      {children}
    </motion.div>
  </section>
);

export interface MenuFlowProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const MenuFlow: React.FC<MenuFlowProps> = ({
  children,
  className,
  'aria-label': ariaLabel = 'Menu',
}) => (
  <main aria-label={ariaLabel} className={cx('w-full overflow-x-hidden', className)}>
    {children}
  </main>
);

export default MenuFlow;
