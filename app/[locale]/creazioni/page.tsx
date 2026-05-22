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
import { buildAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('creazioni_title'),
    description: t('creazioni_description'),
    alternates: buildAlternates(locale, '/creazioni'),
    openGraph: { title: t('creazioni_title'), description: t('creazioni_description'), type: 'website', locale },
  };
}

const MARKET_PRODUCTS = [
  { key: 'art', name: 'Florence EGI / ArtFlorenceEGI', url: 'https://art.florenceegi.com' },
  { key: 'sigillo', name: 'Sigillo', url: 'https://egi-sigillo.florenceegi.com' },
  { key: 'credential', name: 'EGI-Credential', url: 'https://egi-credential.florenceegi.com' },
  { key: 'natan', name: 'NATAN_LOC', url: 'https://natan-loc.florenceegi.com' },
  { key: 'staging', name: 'Creator-Staging', url: 'https://creator-staging.florenceegi.com' },
] as const;

const INFRA = [
  { key: 'ultra', name: 'Famiglia Ultra', url: '' },
  { key: 'council', name: 'The Council (NPE)', url: '' },
  { key: 'hub', name: 'EGI-HUB', url: 'https://hub.florenceegi.com' },
] as const;

const SHOWCASE = [
  { key: 'hub_home', name: 'EGI-HUB-HOME', url: 'https://florenceegi.com' },
  { key: 'info', name: 'EGI-INFO', url: 'https://info.florenceegi.com' },
] as const;

const linkClass = 'text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors';

export default async function CreazioniPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('creazioni');

  const rich = {
    b: (chunks: ReactNode) => <strong className="font-semibold text-[var(--text-primary)]">{chunks}</strong>,
    i: (chunks: ReactNode) => <em className="italic text-[var(--text-secondary)]">{chunks}</em>,
    oralink: (chunks: ReactNode) => <Link href={`/${locale}/oracode`} className={linkClass}>{chunks}</Link>,
    egilink: (chunks: ReactNode) => <a href="https://florenceegi.com" target="_blank" rel="noopener noreferrer" className={linkClass}>{chunks}</a>,
    sitelink: (chunks: ReactNode) => <a href="https://preview.florenceegi.com/" target="_blank" rel="noopener noreferrer" className={linkClass}>{chunks}</a>,
    repolink: (chunks: ReactNode) => <a href="https://github.com/florenceegi/IDEALORO-PREVIEW" target="_blank" rel="noopener noreferrer" className={linkClass}>{chunks}</a>,
  };

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
                  {MARKET_PRODUCTS.map(({ key, name, url }) => (
                    <li key={key} className="reveal flex gap-3 text-base text-[var(--text-secondary)]">
                      <span className="text-[var(--accent)] flex-shrink-0">—</span>
                      <span>
                        <a href={url} target="_blank" rel="noopener noreferrer" className={`font-medium ${linkClass}`}>{name}</a>
                        {' — '}{t(`prod_${key}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--accent)] mb-6">
                  {t('infra_title')}
                </h4>
                <ul className="space-y-4">
                  {INFRA.map(({ key, name, url }) => (
                    <li key={key} className="reveal flex gap-3 text-base text-[var(--text-secondary)]">
                      <span className="text-[var(--accent)] flex-shrink-0">—</span>
                      <span>
                        {url ? (
                          <a href={url} target="_blank" rel="noopener noreferrer" className={`font-medium ${linkClass}`}>{name}</a>
                        ) : (
                          <strong className="text-[var(--text-primary)] font-medium">{name}</strong>
                        )}
                        {' — '}{t(`infra_${key}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--accent)] mb-6">
                  {t('showcase_title')}
                </h4>
                <ul className="space-y-4">
                  {SHOWCASE.map(({ key, name, url }) => (
                    <li key={key} className="reveal flex gap-3 text-base text-[var(--text-secondary)]">
                      <span className="text-[var(--accent)] flex-shrink-0">—</span>
                      <span>
                        <a href={url} target="_blank" rel="noopener noreferrer" className={`font-medium ${linkClass}`}>{name}</a>
                        {' — '}{t(`showcase_${key}`)}
                      </span>
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
              {t.rich('perf_desc', rich)}
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
