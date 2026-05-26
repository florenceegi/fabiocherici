/**
 * @package fabiocherici.com — EPP Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-26
 * @purpose EPP page — Environment Protection Programs, 6 infographic sections with i18n overlay, narrative first-person tone.
 * @mission M-212
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildAlternates, buildOgImage, buildPageSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('epp_title'),
    description: t('epp_description'),
    alternates: buildAlternates(locale, '/epp'),
    openGraph: { title: t('epp_title'), description: t('epp_description'), type: 'website', locale, images: [buildOgImage(locale, 'epp')] },
    twitter: { card: 'summary_large_image', title: t('epp_title'), description: t('epp_description') },
  };
}

const linkClass = 'text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors';

export default async function EppPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('epp');
  const tm = await getTranslations({ locale, namespace: 'meta' });
  const pageSchema = buildPageSchema({
    locale, path: '/epp', title: tm('epp_title'), description: tm('epp_description'),
    type: 'WebPage',
    breadcrumbItems: [
      { name: tm('home_title'), url: `https://fabiocherici.com/${locale}` },
      { name: tm('epp_title'), url: `https://fabiocherici.com/${locale}/epp` },
    ],
  });

  const rich = {
    b: (chunks: ReactNode) => <strong className="font-semibold text-[var(--text-primary)]">{chunks}</strong>,
    contactlink: (chunks: ReactNode) => (
      <Link href={`/${locale}/contatti`} className={linkClass}>{chunks}</Link>
    ),
    platformlink: (chunks: ReactNode) => (
      <a href="https://art.florenceegi.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
        {chunks}<span className="sr-only">, opens in new tab</span>
      </a>
    ),
  };

  return (
    <div className="pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': pageSchema }) }} />

      {/* ── 1. Hero ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <p className="reveal text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            {t('subtitle')}
          </p>
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)] mb-8">
            {t('title')}
          </h1>
          <p className="reveal text-xl sm:text-2xl text-[var(--text-primary)] leading-relaxed font-medium mb-8">
            {t('hero_claim')}
          </p>
          <div className="space-y-6">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('hero_p1')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('hero_p2')}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Split — Donut Chart ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-16">
            {t('split_title')}
          </h2>
          <div className="reveal relative mx-auto max-w-2xl">
            <Image
              src={`/images/epp/${locale}/01.png`}
              alt={t('split_alt')}
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── 3. Flow — Non-Custodial ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('flow_title')}
          </h2>
          <div className="space-y-6 mb-16">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('flow_p1')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('flow_p2')}
            </p>
          </div>
          <div className="reveal relative mx-auto max-w-3xl">
            <Image
              src={`/images/epp/${locale}/02.png`}
              alt={t('flow_alt')}
              width={1400}
              height={700}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ── 4. What EPP is NOT ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('not_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            {t('not_intro')}
          </p>
          <div className="reveal relative mx-auto max-w-3xl">
            <Image
              src={`/images/epp/${locale}/04.png`}
              alt={t('not_alt')}
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ── 5. Triple Guarantee ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('guarantee_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            {t('guarantee_intro')}
          </p>
          <div className="reveal relative mx-auto max-w-sm sm:max-w-md">
            <Image
              src={`/images/epp/${locale}/03.png`}
              alt={t('guarantee_alt')}
              width={900}
              height={1100}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ── 6. Virtuous Cycle ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-16">
            {t('cycle_title')}
          </h2>
          <div className="reveal relative mx-auto max-w-lg sm:max-w-xl">
            <Image
              src={`/images/epp/${locale}/05.png`}
              alt={t('cycle_alt')}
              width={1100}
              height={1100}
              className="w-full h-auto"
            />
          </div>
          <p className="reveal mt-8 text-center text-base sm:text-lg text-[var(--text-secondary)] italic">
            {t('cycle_caption')}
          </p>
        </div>
      </section>

      {/* ── 7. Partner Dashboard ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('dashboard_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            {t('dashboard_intro')}
          </p>
          <div className="reveal relative mx-auto max-w-3xl">
            <Image
              src={`/images/epp/${locale}/06.png`}
              alt={t('dashboard_alt')}
              width={1200}
              height={900}
              className="w-full h-auto"
            />
          </div>
          <p className="reveal mt-8 text-center">
            <a
              href="https://art.florenceegi.com/epp-projects"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {t('dashboard_link')}<span className="sr-only">, opens in new tab</span>
            </a>
          </p>
        </div>
      </section>

      {/* ── 8. CTA ── */}
      <section className="py-20 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('cta_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
            {t('cta_p1')}
          </p>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12">
            {t.rich('cta_p2', rich)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://art.florenceegi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors font-medium"
            >
              {t('cta_platform')}<span className="sr-only">, opens in new tab</span>
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
