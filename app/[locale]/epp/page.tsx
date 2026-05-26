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
              src="/images/epp/epp-split.png"
              alt={t('split_alt')}
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
            <span className="absolute top-[42%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-sm sm:text-base font-mono text-[var(--text-muted)] text-center leading-tight">
              {t('split_caption')}
            </span>
            <span className="absolute top-[18%] right-[8%] text-right">
              <span className="block text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">{t('split_creator_pct')}</span>
              <span className="block text-xs sm:text-sm font-mono uppercase tracking-wider text-[var(--text-muted)]">{t('split_creator')}</span>
            </span>
            <span className="absolute top-[45%] left-[4%] sm:left-[6%]">
              <span className="block text-2xl sm:text-3xl font-bold text-[var(--accent)]">{t('split_epp_pct')}</span>
              <span className="block text-xs sm:text-sm font-mono uppercase tracking-wider text-[var(--accent)]">{t('split_epp')}</span>
            </span>
            <span className="absolute top-[2%] right-[38%]">
              <span className="block text-lg sm:text-xl font-bold text-[var(--text-muted)]">{t('split_platform_pct')}</span>
              <span className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">{t('split_platform')}</span>
            </span>
            <span className="absolute top-[2%] right-[18%]">
              <span className="block text-sm font-bold text-[var(--text-muted)]">{t('split_frangette_pct')}</span>
              <span className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{t('split_frangette')}</span>
            </span>
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
              src="/images/epp/epp-flow.png"
              alt={t('flow_alt')}
              width={1400}
              height={700}
              className="w-full h-auto"
            />
            <span className="absolute top-[34%] left-[2%] sm:left-[4%] text-xs sm:text-sm font-mono text-[var(--text-muted)]">
              {t('flow_buyer')}
            </span>
            <span className="absolute top-[34%] left-[28%] sm:left-[30%] text-xs sm:text-sm font-mono text-[var(--text-primary)] max-w-[20%] text-center leading-tight">
              {t('flow_psp')}
            </span>
            <span className="absolute top-[8%] right-[1%] sm:right-[2%] text-xs sm:text-sm font-mono text-[var(--text-muted)]">
              {t('flow_creator')}
            </span>
            <span className="absolute top-[28%] right-[1%] sm:right-[2%] text-xs sm:text-sm font-mono font-bold text-[var(--accent)]">
              {t('flow_epp')}
            </span>
            <span className="absolute top-[48%] right-[1%] sm:right-[2%] text-xs sm:text-sm font-mono text-[var(--text-muted)]">
              {t('flow_platform')}
            </span>
            <span className="absolute top-[66%] right-[1%] sm:right-[2%] text-xs sm:text-sm font-mono text-[var(--text-muted)]">
              {t('flow_frangette')}
            </span>
            <span className="absolute bottom-[22%] left-[50%] -translate-x-1/2 text-xs sm:text-sm text-[var(--text-primary)] font-medium text-center whitespace-nowrap">
              {t('flow_claim')}
            </span>
            <span className="absolute bottom-[6%] left-[50%] -translate-x-1/2 text-[10px] sm:text-xs text-[var(--text-muted)] text-center line-through decoration-[#8B4A4A]">
              {t('flow_traditional')}
            </span>
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
              src="/images/epp/epp-comparison.png"
              alt={t('not_alt')}
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <span className="absolute top-[28%] left-[12%] sm:left-[14%] text-center w-[20%]">
              <span className="block text-sm sm:text-base font-semibold text-[var(--text-primary)]">{t('not_nft_label')}</span>
              <span className="block text-[10px] sm:text-xs text-[var(--text-muted)] mt-1 leading-snug">{t('not_nft_desc')}</span>
            </span>
            <span className="absolute top-[28%] left-[40%] text-center w-[20%]">
              <span className="block text-sm sm:text-base font-semibold text-[var(--text-primary)]">{t('not_carbon_label')}</span>
              <span className="block text-[10px] sm:text-xs text-[var(--text-muted)] mt-1 leading-snug">{t('not_carbon_desc')}</span>
            </span>
            <span className="absolute top-[28%] right-[8%] sm:right-[10%] text-center w-[20%]">
              <span className="block text-sm sm:text-base font-semibold text-[var(--text-primary)]">{t('not_sponsor_label')}</span>
              <span className="block text-[10px] sm:text-xs text-[var(--text-muted)] mt-1 leading-snug">{t('not_sponsor_desc')}</span>
            </span>
            <span className="absolute bottom-[10%] left-[25%] right-[6%] text-xs sm:text-sm text-[var(--text-primary)] font-medium leading-snug">
              {t('not_yes_label')}
            </span>
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
              src="/images/epp/epp-guarantee.png"
              alt={t('guarantee_alt')}
              width={900}
              height={1100}
              className="w-full h-auto"
            />
            <span className="absolute top-[17%] left-[22%] right-[8%] sm:right-[10%]">
              <span className="block text-base sm:text-lg font-bold text-[#1C1C1C]">{t('guarantee_statutory_label')}</span>
              <span className="block text-[10px] sm:text-xs text-[#1C1C1C]/70 leading-snug mt-1">{t('guarantee_statutory_desc')}</span>
            </span>
            <span className="absolute top-[46%] left-[16%] right-[8%] sm:right-[10%]">
              <span className="block text-base sm:text-lg font-bold text-[var(--text-primary)]">{t('guarantee_corporate_label')}</span>
              <span className="block text-[10px] sm:text-xs text-[var(--text-muted)] leading-snug mt-1">{t('guarantee_corporate_desc')}</span>
            </span>
            <span className="absolute top-[72%] left-[16%] right-[4%] sm:right-[6%]">
              <span className="block text-base sm:text-lg font-bold text-[var(--text-primary)]">{t('guarantee_code_label')}</span>
              <span className="block text-[10px] sm:text-xs text-[var(--text-muted)] leading-snug mt-1">{t('guarantee_code_desc')}</span>
            </span>
            <span className="absolute top-[50%] left-[0%] -translate-y-1/2 -rotate-90 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[var(--text-muted)] whitespace-nowrap origin-center">
              {t('guarantee_line_label')}
            </span>
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
              src="/images/epp/epp-cycle.png"
              alt={t('cycle_alt')}
              width={1100}
              height={1100}
              className="w-full h-auto"
            />
            <span className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-3xl font-bold text-[var(--accent)]">
              {t('cycle_center')}
            </span>
            <span className="absolute top-[5%] left-[50%] -translate-x-1/2 text-[10px] sm:text-xs font-mono text-[var(--text-primary)] text-center whitespace-nowrap">
              {t('cycle_1')}
            </span>
            <span className="absolute top-[22%] right-[8%] sm:right-[10%] text-[10px] sm:text-xs font-mono text-[var(--text-primary)] text-right max-w-[25%] leading-snug">
              {t('cycle_2')}
            </span>
            <span className="absolute top-[52%] right-[8%] sm:right-[10%] text-[10px] sm:text-xs font-mono font-bold text-[#1C1C1C] text-right max-w-[25%] leading-snug">
              {t('cycle_3')}
            </span>
            <span className="absolute bottom-[8%] left-[50%] -translate-x-1/2 text-[10px] sm:text-xs font-mono text-[var(--text-primary)] text-center max-w-[30%] leading-snug">
              {t('cycle_4')}
            </span>
            <span className="absolute top-[52%] left-[8%] sm:left-[10%] text-[10px] sm:text-xs font-mono text-[var(--text-primary)] max-w-[25%] leading-snug">
              {t('cycle_5')}
            </span>
            <span className="absolute top-[22%] left-[8%] sm:left-[10%] text-[10px] sm:text-xs font-mono text-[var(--text-primary)] max-w-[25%] leading-snug">
              {t('cycle_6')}
            </span>
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
              src="/images/epp/epp-dashboard.png"
              alt={t('dashboard_alt')}
              width={1200}
              height={900}
              className="w-full h-auto"
            />
            <span className="absolute top-[10%] left-[8%]">
              <span className="block text-lg sm:text-2xl font-bold text-[var(--accent)]">{t('dashboard_org')}</span>
              <span className="block text-[10px] sm:text-xs text-[var(--text-muted)] mt-0.5">{t('dashboard_org_sub')}</span>
            </span>
            <span className="absolute top-[32%] left-[8%] max-w-[45%]">
              <span className="block text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">{t('dashboard_project_label')}</span>
              <span className="block text-sm sm:text-base font-semibold text-[var(--text-primary)]">{t('dashboard_project_name')}</span>
              <span className="block text-[10px] sm:text-xs text-[var(--text-muted)] mt-1">{t('dashboard_objective')}</span>
              <span className="block text-[10px] sm:text-xs text-[var(--text-muted)]">{t('dashboard_timeline')}</span>
            </span>
            <span className="absolute top-[48%] right-[12%] text-right">
              <span className="block text-lg sm:text-2xl font-bold text-[var(--accent)]">{t('dashboard_amount')}</span>
              <span className="block text-[10px] sm:text-xs text-[var(--text-muted)]">{t('dashboard_amount_label')}</span>
            </span>
            <span className="absolute top-[64%] left-[8%] right-[8%] flex text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              <span className="w-1/3">{t('dashboard_col_date')}</span>
              <span className="w-1/3">{t('dashboard_col_tx')}</span>
              <span className="w-1/3 text-right">{t('dashboard_col_amount')}</span>
            </span>
            {(['dashboard_row1', 'dashboard_row2', 'dashboard_row3'] as const).map((key, i) => (
              <span key={key} className="absolute left-[8%] right-[8%] flex text-[9px] sm:text-[11px] text-[var(--text-secondary)]" style={{ top: `${70 + i * 8}%` }}>
                <span className="w-1/3">{t(`${key}.0`)}</span>
                <span className="w-1/3">{t(`${key}.1`)}</span>
                <span className="w-1/3 text-right">{t(`${key}.2`)}</span>
              </span>
            ))}
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
