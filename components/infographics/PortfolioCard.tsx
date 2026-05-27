/**
 * @package fabiocherici.com — PortfolioCard
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-27
 * @purpose Card singola progetto portfolio. Nome + descrizione + LOC + ore audit + badge + live link.
 *          Hover state, semantic article + aria-label. Zero immagini raster.
 */

import type { ReactNode } from 'react';

export interface PortfolioCardProps {
  /** Nome progetto (es. "EGI / ArtFlorenceEGI") */
  name: string;
  /** Descrizione 1 riga concreta */
  description: string;
  /** LOC formattato (es. "503.909 LOC") */
  loc?: string;
  /** Ore audit (es. "16h") */
  hours?: string;
  /** Badge "audit disponibile" */
  auditBadge?: ReactNode;
  /** URL live progetto (opzionale) */
  liveUrl?: string;
  /** Label link live ("vedi live") */
  liveLabel?: string;
}

export default function PortfolioCard({
  name,
  description,
  loc,
  hours,
  auditBadge,
  liveUrl,
  liveLabel,
}: PortfolioCardProps) {
  return (
    <article
      aria-label={name}
      className="flex h-full flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-colors hover:border-[var(--border-accent)]"
    >
      <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] leading-tight">
        {name}
      </h3>
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
        {description}
      </p>
      {(loc || hours) && (
        <dl className="mt-auto flex flex-wrap gap-x-4 gap-y-1 text-[10px] sm:text-xs font-mono">
          {loc && (
            <div className="flex gap-1">
              <dt className="text-[var(--text-muted)]">LOC</dt>
              <dd className="text-[var(--text-primary)]">{loc}</dd>
            </div>
          )}
          {hours && (
            <div className="flex gap-1">
              <dt className="text-[var(--text-muted)]">ore</dt>
              <dd className="text-[var(--text-primary)]">{hours}</dd>
            </div>
          )}
        </dl>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {auditBadge && (
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/40 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[var(--accent)]">
            {auditBadge}
          </span>
        )}
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-2"
          >
            {liveLabel || 'live →'}
            <span className="sr-only">, opens in new tab</span>
          </a>
        )}
      </div>
    </article>
  );
}
