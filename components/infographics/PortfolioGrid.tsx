/**
 * @package fabiocherici.com — PortfolioGrid
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-27
 * @purpose Grid portfolio con sotto-gruppi labeled (es. "PRODOTTI / INFRASTRUTTURA / SITI").
 *          Wrapping responsive 4col → 2col → 1col.
 */

import type { ReactNode } from 'react';

export interface PortfolioGroup {
  /** Etichetta gruppo (es. "PRODOTTI RIVOLTI AL MERCATO") */
  label: string;
  /** Card del gruppo (PortfolioCard nodes) */
  children: ReactNode;
}

export interface PortfolioGridProps {
  groups: PortfolioGroup[];
  ariaLabel?: string;
}

export default function PortfolioGrid({
  groups,
  ariaLabel,
}: PortfolioGridProps) {
  return (
    <div aria-label={ariaLabel} className="reveal flex flex-col gap-12">
      {groups.map((group, i) => (
        <section key={i} className="flex flex-col gap-5">
          <h3 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[var(--accent)]">
            {group.label}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {group.children}
          </div>
        </section>
      ))}
    </div>
  );
}
