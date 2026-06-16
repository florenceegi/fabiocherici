/**
 * @package fabiocherici.com — FactCard
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 1.0.0
 * @date 2026-06-16
 * @purpose Card-fatto breve (titolo + 1-2 righe) per i bento "Chi siamo" e
 *          "La prova": il paragrafone di autorità diventa moduli scansionabili
 *          (uno per fatto verificabile). Opzionale: una eyebrow/kicker bronzo in
 *          alto. Server component, zero JS, testo nell'HTML (P0-FC-2). Decorativo:
 *          nessun controllo interattivo. Hover = micro-feedback (bordo), solo
 *          enhancement.
 */

import type { ReactNode } from 'react';

export interface FactCardProps {
  /** Kicker breve opzionale in alto (es. "DAL 1995"). */
  kicker?: string;
  /** Titolo corto. */
  title: string;
  /** Una/due righe di dettaglio. */
  detail: string;
  /** Slot opzionale a piè card (es. un link reale). */
  footer?: ReactNode;
}

export default function FactCard({ kicker, title, detail, footer }: FactCardProps) {
  return (
    <article className="reveal flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 transition-colors hover:border-[var(--accent-muted)] sm:p-7">
      {kicker ? (
        <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">{kicker}</p>
      ) : null}
      <h3 className="text-lg font-semibold leading-tight text-[var(--text-primary)]">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{detail}</p>
      {footer ? <div className="mt-2">{footer}</div> : null}
    </article>
  );
}
