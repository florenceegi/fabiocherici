/**
 * @package fabiocherici.com — Why Protocol Section
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Blocco 5 — Why Oracode is becoming an open protocol
 */

'use client';

import { useTranslations } from 'next-intl';

export function WhyProtocol() {
  const t = useTranslations('home.protocol');

  return (
    <section className="py-32 bg-[var(--bg)]">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="reveal font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-12">
          {t('title')}
        </h2>

        <p className="reveal text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
          {t('p1')}
        </p>

        <div className="reveal mb-8">
          <p className="text-base text-[var(--text-secondary)] mb-4">{t('p2_intro')}</p>
          <ol className="list-none space-y-3 ml-6">
            <li className="flex items-start gap-3">
              <span className="text-[var(--accent)] font-mono text-sm mt-1">(1)</span>
              <span className="text-base text-[var(--text-secondary)]">{t('p2_point1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--accent)] font-mono text-sm mt-1">(2)</span>
              <span className="text-base text-[var(--text-secondary)]">{t('p2_point2')}</span>
            </li>
          </ol>
        </div>

        <p className="reveal text-lg text-[var(--text-primary)] font-medium leading-relaxed">
          {t('p3')}
        </p>
      </div>
    </section>
  );
}
