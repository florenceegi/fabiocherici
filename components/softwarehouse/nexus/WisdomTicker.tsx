/**
 * @package fabiocherici.com — WisdomTicker
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Ticker di pillole Oracode/LSO — frasi REALI dal paradigma (SSOT
 *          LSO §Cos'è LSO / 5 Principi, P0-FC-6), curate in i18n nelle 7 lingue
 *          (P0-FC-4). Crossfade CSS-only riusando il pattern quote-crossfade
 *          (globals.css §577); sotto prefers-reduced-motion mostra solo la prima
 *          (no animazione, design M-017 §2.4). Decorativo → aria-hidden.
 *          Nessun GSAP necessario (P0-FC-1 non si applica).
 * @mission M-017
 */

'use client';

import { useTranslations } from 'next-intl';

/** Numero di pillole curate nel namespace i18n (nexus.wisdom_1..N). */
const WISDOM_COUNT = 7;

export default function WisdomTicker() {
  const t = useTranslations('nexus');
  const pills = Array.from({ length: WISDOM_COUNT }, (_, i) => t(`wisdom_${i + 1}`));
  // Ciclo totale: ~6.5s per pillola così l'intero giro resta leggibile.
  const cycle = `${WISDOM_COUNT * 6.5}s`;

  return (
    <div
      className="nexus-ticker relative overflow-hidden rounded-xl border px-4 py-3"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)', minHeight: '4.5rem', ['--cycle' as string]: cycle }}
    >
      <p className="mb-1 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--text-muted)]">
        {t('wisdom_label')}
      </p>
      <div className="relative h-12">
        {pills.map((text, i) => (
          <span
            key={i}
            className="nexus-ticker__item absolute inset-0 flex items-center text-sm italic leading-snug text-[var(--text-secondary)]"
            style={{ ['--qd' as string]: `${(i / WISDOM_COUNT) * (WISDOM_COUNT * 6.5)}s` }}
            aria-hidden={i === 0 ? undefined : 'true'}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
