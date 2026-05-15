/**
 * @package fabiocherici.com — What Oracode Produces
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Blocco 2 — Oracode constraints produce quality by design
 */

'use client';

import { useTranslations } from 'next-intl';

export function WhatOracodeProduces() {
  const t = useTranslations('home.produces');

  const results = [
    { key: 'result_gdpr', icon: '🛡' },
    { key: 'result_i18n', icon: '🌍' },
    { key: 'result_errors', icon: '⚡' },
    { key: 'result_trace', icon: '📋' },
  ] as const;

  return (
    <section className="py-32 bg-[var(--bg-elevated)]">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="reveal font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-8">
          {t('title')}
        </h2>

        <p className="reveal text-xl text-[var(--accent)] font-medium mb-6">
          {t('intro')}
        </p>

        <p className="reveal text-base text-[var(--text-secondary)] leading-relaxed mb-12">
          {t('stats')}
        </p>

        <h3 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-6">
          {t('result_title')}
        </h3>

        <ul className="space-y-4 mb-12">
          {results.map(({ key, icon }) => (
            <li
              key={key}
              className="reveal flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-6 py-4"
            >
              <span className="text-xl flex-shrink-0 mt-0.5" aria-hidden="true">{icon}</span>
              <span className="text-base text-[var(--text-secondary)] leading-relaxed">
                {t(key)}
              </span>
            </li>
          ))}
        </ul>

        <p className="reveal text-lg text-[var(--text-primary)] font-medium border-l-2 border-[var(--accent)] pl-6">
          {t('closing')}
        </p>
      </div>
    </section>
  );
}
