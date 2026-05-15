/**
 * @package fabiocherici.com — Problem Section
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Blocco 1 — The problem with AI-generated code (vibe coding)
 */

'use client';

import { useTranslations } from 'next-intl';

export function ProblemSection() {
  const t = useTranslations('home.problem');

  return (
    <section className="py-32 bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="reveal font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-12">
          {t('title')}
        </h2>

        <div className="space-y-8 text-lg leading-relaxed text-[var(--text-secondary)]">
          <p className="reveal">{t('p1')}</p>
          <p className="reveal">{t('p2')}</p>
          <p className="reveal text-[var(--text-primary)] font-medium italic">
            {t('p3')}
          </p>
        </div>
      </div>
    </section>
  );
}
