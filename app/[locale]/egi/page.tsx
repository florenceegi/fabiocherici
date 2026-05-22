/**
 * @package fabiocherici.com — EGI Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-22
 * @purpose EGI page — Florence EGI narrative in first person, 8 sections, TU al centro, 7 languages.
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
    title: t('egi_title'),
    description: t('egi_description'),
    alternates: buildAlternates(locale, '/egi'),
    openGraph: { title: t('egi_title'), description: t('egi_description'), type: 'website', locale },
    twitter: { card: 'summary', title: t('egi_title'), description: t('egi_description') },
  };
}

const BENEFITS = ['b1', 'b2', 'b3', 'b4'] as const;

const linkClass = 'text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors';

export default async function EgiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('egi');
  const meta = await getTranslations({ locale, namespace: 'meta' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: meta('egi_title'),
    description: meta('egi_description'),
    url: `https://fabiocherici.com/${locale}/egi`,
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', url: 'https://fabiocherici.com' },
    about: {
      '@type': 'Organization',
      name: 'FlorenceEGI S.R.L.',
      url: 'https://florenceegi.com',
      founder: { '@type': 'Person', name: 'Fabio Cherici', url: 'https://fabiocherici.com' },
      foundingDate: '2024',
      knowsAbout: ['Blockchain', 'Digital Art Certification', 'Market Maker', 'Environmental Impact'],
      sameAs: ['https://art.florenceegi.com', 'https://github.com/florenceegi'],
    },
  };

  const rich = {
    b: (chunks: ReactNode) => <strong className="font-semibold text-[var(--text-primary)]">{chunks}</strong>,
    epplink: (chunks: ReactNode) => (
      <Link href={`/${locale}/epp`} className={linkClass}>{chunks}</Link>
    ),
    platformlink: (chunks: ReactNode) => (
      <a href="https://art.florenceegi.com" target="_blank" rel="noopener noreferrer" className={linkClass}>{chunks}</a>
    ),
    contactlink: (chunks: ReactNode) => (
      <Link href={`/${locale}/contatti`} className={linkClass}>{chunks}</Link>
    ),
  };

  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── 1. Apertura (hero) ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)] mb-6">
            {t('title')}
          </h1>
          <p className="reveal text-xl sm:text-2xl text-[var(--text-secondary)] leading-relaxed italic mb-10">
            {t('hero_question')}
          </p>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
            {t('hero_p1')}
          </p>
          <p className="reveal text-base sm:text-lg text-[var(--text-primary)] leading-relaxed font-medium">
            {t('hero_claim')}
          </p>
        </div>
      </section>

      {/* ── 2. Cos'è in una frase ── */}
      <section className="py-20 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('what_title')}
          </h2>
          <blockquote className="reveal border-l-2 border-[var(--accent)] pl-6 mb-8">
            <p className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] leading-snug">
              {t('what_claim')}
            </p>
          </blockquote>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
            {t('what_p1')}
          </p>
          <p className="reveal text-base sm:text-lg text-[var(--accent)] font-medium">
            {t('what_p2')}
          </p>
        </div>
      </section>

      {/* ── 3. L'acronimo ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('acronym_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
            {t.rich('acronym_p1', rich)}
          </p>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {t('acronym_p2')}
          </p>
        </div>
      </section>

      {/* ── 4. Se crei (Creator) ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('creator_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-10">
            {t('creator_intro')}
          </p>
          <ul className="space-y-6">
            {BENEFITS.map((id) => (
              <li key={id} className="reveal flex gap-4 items-start">
                <span className="text-[var(--accent)] flex-shrink-0 mt-1">—</span>
                <div>
                  <p className="font-medium text-[var(--text-primary)] mb-1">
                    {t(`creator_${id}_label`)}
                  </p>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                    {t(`creator_${id}_desc`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5. Se compri (Co-Creatore + Collector) ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('collector_title')}
          </h2>
          <p className="reveal text-xl sm:text-2xl text-[var(--text-secondary)] leading-relaxed italic mb-10">
            {t('collector_intro')}
          </p>
          <div className="space-y-8">
            <div className="reveal">
              <p className="font-medium text-[var(--text-primary)] mb-2">
                {t('collector_cocreator_title')}
              </p>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed border-l-2 border-[var(--accent-muted)] pl-6">
                {t.rich('collector_cocreator_desc', rich)}
              </p>
            </div>
            <div className="reveal">
              <p className="font-medium text-[var(--text-primary)] mb-2">
                {t('collector_collector_title')}
              </p>
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed border-l-2 border-[var(--accent-muted)] pl-6">
                {t('collector_collector_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Se hai un'azienda o un ente ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('business_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
            {t('business_intro')}
          </p>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {t('business_examples')}
          </p>
        </div>
      </section>

      {/* ── 7. L'ambiente nel cuore del sistema ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('environment_title')}
          </h2>
          <div className="space-y-6">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('environment_p1')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('environment_p2')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('environment_p3')}
            </p>
          </div>
          <p className="reveal mt-10 text-base text-[var(--text-secondary)] leading-relaxed">
            {t.rich('environment_epp_link', rich)}
          </p>
        </div>
      </section>

      {/* ── 8. Da qui in poi (CTA) ── */}
      <section className="py-20 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('outro_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
            {t.rich('outro_p1', rich)}
          </p>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12">
            {t.rich('outro_p2', rich)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://art.florenceegi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors font-medium"
            >
              {t('cta_platform')}
            </a>
            <Link
              href={`/${locale}/contatti`}
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors font-medium"
            >
              {t('cta_contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
