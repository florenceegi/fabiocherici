/**
 * @package fabiocherici.com — Organism Section
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Blocco 3 — LSO frontier: software that knows itself
 */

'use client';

import { useTranslations } from 'next-intl';

export function OrganismSection() {
  const t = useTranslations('home.organism');

  return (
    <section className="py-32 bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="reveal font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-12">
          {t('title')}
        </h2>

        <div className="space-y-8 text-lg leading-relaxed text-[var(--text-secondary)]">
          <p className="reveal">{t('p1')}</p>
          <p className="reveal">{t('p2')}</p>
          <p className="reveal">{t('p3')}</p>
        </div>

        <blockquote className="reveal mt-12 rounded-xl border border-[var(--accent-muted)] bg-[var(--accent-glow)] px-8 py-6">
          <p className="text-base italic text-[var(--accent)] leading-relaxed font-[family-name:var(--font-display)]">
            {t('quote')}
          </p>
        </blockquote>

        <p className="reveal mt-10 text-sm font-mono text-[var(--text-muted)] tracking-wide">
          {t('stats')}
        </p>
      </div>
    </section>
  );
}
