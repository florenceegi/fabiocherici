/**
 * @package fabiocherici.com — Oracode Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Oracode paradigm deep-dive — pillars, P0 levels, 4 application tiers. All content via i18n.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('oracode_title'),
    description: t('home_description'),
    openGraph: { title: t('oracode_title'), type: 'website', locale },
  };
}

const PILLAR_IDS = ['1', '2', '3', '4', '5', '6'] as const;
const LEVEL_IDS = ['1', '2', '3', '4'] as const;

export default async function OracodePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('oracode');

  return (
    <div className="pt-24">
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            {t('subtitle')}
          </p>
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)] mb-8">
            {t('title')}
          </h1>
          <p className="reveal text-xl text-[var(--text-secondary)] leading-relaxed">
            {t('intro')}
          </p>
        </div>
      </section>

      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('pillars_title')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {PILLAR_IDS.map((n) => (
              <div key={n} className="reveal rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--accent)] text-sm font-mono text-[var(--accent)]">
                    {n}
                  </span>
                  <h3 className="text-base font-medium text-[var(--text-primary)]">{t(`pillar_${n}_name`)}</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{t(`pillar_${n}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('levels_title')}
          </h2>
          <div className="space-y-6">
            {LEVEL_IDS.map((n) => (
              <div key={n} className="reveal flex items-start gap-6 border-l-2 border-[var(--accent-muted)] pl-6 py-2">
                <span className="text-3xl font-light font-mono text-[var(--accent)] flex-shrink-0">
                  {n}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">{t(`level_${n}_name`)}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{t(`level_${n}_desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('zero_rule_title')}
          </h2>
          <p className="reveal font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-[var(--accent)] leading-relaxed">
            {t('zero_rule_quote')}
          </p>
          <p className="reveal mt-6 text-base text-[var(--text-secondary)]">
            {t('zero_rule_detail')}
          </p>
        </div>
      </section>
    </div>
  );
}
