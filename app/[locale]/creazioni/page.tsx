/**
 * @package fabiocherici.com — Creazioni Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-20
 * @purpose Creazioni page — narrative arc from Magicsoft to FlorenceEGI, full portfolio.
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('creazioni_title'),
    openGraph: { title: t('creazioni_title'), type: 'website', locale },
  };
}

const MARKET_PRODUCTS = [
  { key: 'art', name: 'Florence EGI / ArtFlorenceEGI' },
  { key: 'sigillo', name: 'Sigillo' },
  { key: 'credential', name: 'EGI-Credential' },
  { key: 'natan', name: 'NATAN_LOC' },
  { key: 'staging', name: 'Creator-Staging' },
] as const;

const INFRA = [
  { key: 'ultra', name: 'Famiglia Ultra' },
  { key: 'council', name: 'The Council (NPE)' },
  { key: 'hub', name: 'EGI-HUB' },
] as const;

const SHOWCASE = [
  { key: 'hub_home', name: 'EGI-HUB-HOME' },
  { key: 'info', name: 'EGI-INFO' },
] as const;

const rich = {
  b: (chunks: ReactNode) => <strong className="font-semibold text-[var(--text-primary)]">{chunks}</strong>,
  i: (chunks: ReactNode) => <em className="italic text-[var(--text-secondary)]">{chunks}</em>,
};

export default async function CreazioniPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('creazioni');

  return (
    <div className="pt-24">
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)] mb-6">
            {t('title')}
          </h1>
          <p className="reveal text-xl sm:text-2xl text-[var(--accent)] leading-relaxed font-medium mb-8">
            {t('subtitle')}
          </p>
          <p className="reveal text-lg text-[var(--text-secondary)] italic">
            {t('intro')}
          </p>
        </div>
      </section>

      <section className="py-20 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6 space-y-8">
          {(['p1', 'p2', 'p3', 'p4', 'p5', 'p6'] as const).map((key) => (
            <p key={key} className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t.rich(key, rich)}
            </p>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-16">
            {t('section_title')}
          </h2>

          <div className="reveal mb-16">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              {t('magicsoft_label')}
            </h3>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed border-l-2 border-[var(--accent-muted)] pl-6">
              {t('magicsoft_desc')}
            </p>
          </div>

          <div className="reveal mb-12">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">
              {t('egi_label')}
            </h3>
            <p className="text-base text-[var(--text-secondary)] mb-8 border-l-2 border-[var(--accent-muted)] pl-6">
              {t('egi_desc')}
            </p>

            <div className="space-y-10">
              <div>
                <h4 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--accent)] mb-6">
                  {t('market_title')}
                </h4>
                <ul className="space-y-4">
                  {MARKET_PRODUCTS.map(({ key, name }) => (
                    <li key={key} className="reveal flex gap-3 text-base text-[var(--text-secondary)]">
                      <span className="text-[var(--accent)] flex-shrink-0">—</span>
                      <span><strong className="text-[var(--text-primary)] font-medium">{name}</strong> — {t(`prod_${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--accent)] mb-6">
                  {t('infra_title')}
                </h4>
                <ul className="space-y-4">
                  {INFRA.map(({ key, name }) => (
                    <li key={key} className="reveal flex gap-3 text-base text-[var(--text-secondary)]">
                      <span className="text-[var(--accent)] flex-shrink-0">—</span>
                      <span><strong className="text-[var(--text-primary)] font-medium">{name}</strong> — {t(`infra_${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--accent)] mb-6">
                  {t('showcase_title')}
                </h4>
                <ul className="space-y-4">
                  {SHOWCASE.map(({ key, name }) => (
                    <li key={key} className="reveal flex gap-3 text-base text-[var(--text-secondary)]">
                      <span className="text-[var(--accent)] flex-shrink-0">—</span>
                      <span><strong className="text-[var(--text-primary)] font-medium">{name}</strong> — {t(`showcase_${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="reveal mt-16 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-8">
            <h4 className="text-lg font-medium text-[var(--text-primary)] mb-3">
              {t('perf_label')}
            </h4>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              {t('perf_desc')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="reveal text-xl text-[var(--text-secondary)]">
            {t('cta')}{' '}
            <Link
              href={`/${locale}/oracode`}
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors"
            >
              {t('cta_link')}
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
