/**
 * @package fabiocherici.com — IconGrid
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-27
 * @purpose Grid N elementi con icona SVG inline + titolo + descrizione 1 riga.
 *          Responsive 4col → 2col → 1col. Icone SVG inline minimal, no raster.
 */

import type { ReactNode } from 'react';

export type IconGridItem = {
  icon: ReactNode;
  title: string;
  description: ReactNode;
};

export interface IconGridProps {
  items: IconGridItem[];
  ariaLabel?: string;
  columns?: 2 | 3 | 4;
}

const colsClass = (cols: 2 | 3 | 4 = 4) => {
  switch (cols) {
    case 2:
      return 'grid-cols-1 sm:grid-cols-2';
    case 3:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    case 4:
    default:
      return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
  }
};

export default function IconGrid({
  items,
  ariaLabel,
  columns = 4,
}: IconGridProps) {
  return (
    <ul
      aria-label={ariaLabel}
      className={`reveal grid gap-6 sm:gap-8 ${colsClass(columns)}`}
    >
      {items.map((item, i) => (
        <li
          key={i}
          className="flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5 sm:p-6 transition-colors hover:border-[var(--border-accent)]"
        >
          <span
            aria-hidden="true"
            className="text-[var(--accent)] w-8 h-8 flex items-center justify-center"
          >
            {item.icon}
          </span>
          <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] leading-tight">
            {item.title}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {item.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
