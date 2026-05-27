/**
 * @package fabiocherici.com — PricingTiers
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-27
 * @purpose N card pricing affiancate. Range prezzo + tempi + manutenzione + caparra MVP.
 *          Responsive Ncol desktop → 2col tablet → 1col mobile.
 *          Semantic <ul><li> + aria-label per ogni card.
 */

import type { ReactNode } from 'react';

export type PricingTier = {
  /** Nome fascia (es. "Verticale singolo") */
  name: string;
  /** Range prezzo (es. "€8.000–€15.000") */
  priceRange: string;
  /** Tempi consegna (es. "4-6 settimane") */
  timeline: string;
  /** Manutenzione mensile (es. "€200/mese") */
  maintenance: string;
  /** Caparra MVP (es. "30%") */
  depositMvp: string;
  /** Opzionale: descrizione breve sotto il nome */
  description?: string;
};

export interface PricingTiersProps {
  tiers: PricingTier[];
  labels: {
    timeline: string;
    maintenance: string;
    depositMvp: string;
  };
  ariaLabel?: string;
}

export default function PricingTiers({
  tiers,
  labels,
  ariaLabel,
}: PricingTiersProps) {
  return (
    <ul
      aria-label={ariaLabel}
      className="reveal grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-5"
    >
      {tiers.map((tier, i) => (
        <li
          key={i}
          aria-label={`${tier.name} ${tier.priceRange}`}
          className="flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-colors hover:border-[var(--accent)]"
        >
          <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] leading-tight">
            {tier.name}
          </h3>
          {tier.description && (
            <p className="text-xs text-[var(--text-muted)] leading-snug">
              {tier.description}
            </p>
          )}
          <p className="text-lg sm:text-xl font-bold text-[var(--accent)]">
            {tier.priceRange}
          </p>
          <dl className="mt-2 grid gap-2 text-xs sm:text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--text-muted)] font-mono uppercase tracking-wider text-[10px] sm:text-xs">
                {labels.timeline}
              </dt>
              <dd className="text-[var(--text-secondary)] text-right">
                {tier.timeline}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--text-muted)] font-mono uppercase tracking-wider text-[10px] sm:text-xs">
                {labels.maintenance}
              </dt>
              <dd className="text-[var(--text-secondary)] text-right">
                {tier.maintenance}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--text-muted)] font-mono uppercase tracking-wider text-[10px] sm:text-xs">
                {labels.depositMvp}
              </dt>
              <dd className="text-[var(--text-secondary)] text-right">
                {tier.depositMvp}
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
