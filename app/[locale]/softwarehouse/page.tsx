/**
 * @package fabiocherici.com — Softwarehouse Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-27
 * @purpose Softwarehouse page — 9 sezioni con 7 componenti infografici riusabili.
 *          Sostituisce /creazioni come pagina commerciale dedicata PMI italiane.
 *          Postura TU al centro, tono asciutto-fattuale, no vendita.
 * @mission M-008
 */

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildAlternates, buildOgImage, buildPageSchema } from '@/lib/seo';
import ComparisonTable from '@/components/infographics/ComparisonTable';
import FormulaBlock from '@/components/infographics/FormulaBlock';
import IconGrid from '@/components/infographics/IconGrid';
import FlowDiagram from '@/components/infographics/FlowDiagram';
import PricingTiers from '@/components/infographics/PricingTiers';
import PortfolioCard from '@/components/infographics/PortfolioCard';
import PortfolioGrid from '@/components/infographics/PortfolioGrid';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('softwarehouse_title'),
    description: t('softwarehouse_description'),
    alternates: buildAlternates(locale, '/softwarehouse'),
    openGraph: {
      title: t('softwarehouse_title'),
      description: t('softwarehouse_description'),
      type: 'website',
      locale,
      images: [buildOgImage(locale, 'softwarehouse')],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('softwarehouse_title'),
      description: t('softwarehouse_description'),
    },
  };
}

const linkClass =
  'text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors';

const PORTFOLIO_MARKET = [
  { key: 'market_1', loc: '504.304 LOC', live: 'https://art.florenceegi.com' },
  { key: 'market_2', loc: '110.479 LOC', live: 'https://natan-loc.florenceegi.com' },
  { key: 'market_3', loc: '36.537 LOC', live: 'https://egi-credential.florenceegi.com', hours: '~78h' },
  { key: 'market_4', loc: '10.013 LOC', live: 'https://egi-sigillo.florenceegi.com', hours: '38-44h' },
  { key: 'market_5', loc: '16.285 LOC', live: 'https://creator-staging.florenceegi.com', hours: '~30h' },
  { key: 'market_6', loc: '13.111 LOC' },
  { key: 'market_7', loc: '1.426 LOC', live: 'https://preview.florenceegi.com', hours: '16h' },
] as const;

const PORTFOLIO_INFRA = [
  { key: 'infra_1', loc: '57.365 LOC', live: 'https://hub.florenceegi.com' },
  { key: 'infra_2', loc: '21.939 LOC', live: 'https://florenceegi.com' },
  { key: 'infra_3', loc: '35.869 LOC', live: 'https://info.florenceegi.com' },
  { key: 'infra_4', loc: '3.860 LOC' },
  { key: 'infra_5' },
  { key: 'infra_6' },
  { key: 'infra_7', loc: '3.408 LOC' },
  { key: 'infra_8', loc: '2.009 LOC' },
  { key: 'infra_9', loc: '1.995 LOC' },
  { key: 'infra_10', loc: '1.181 LOC' },
] as const;

const PORTFOLIO_SITES = [
  { key: 'site_1', loc: '3.489 LOC', live: 'https://fabiocherici.com' },
  { key: 'site_2', loc: '4.505 LOC', hours: '16h' },
  { key: 'site_3' },
] as const;

const RECEIVE_ICONS = [
  // 1. Assistenza diretta — chat bubble
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>,
  // 2. Codice / lock-in — code brackets
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  // 3. Documentazione viva — book
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
  // 4. Infrastruttura — server
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
  // 5. Velocità — zap
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  // 6. Prezzo — euro
  <svg key="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14 21V3" /><path d="M18 8H8c-3.3 0-6 2.7-6 6s2.7 6 6 6h10" /><path d="M2 14h10" /></svg>,
  // 7. Numeri — check
  <svg key="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
];

const WHATSAPP_URL = 'https://wa.me/393388350412';
const EMAIL_HREF = 'mailto:fabio@florenceegi.com?subject=Softwarehouse';

export default async function SoftwarehousePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('softwarehouse');
  const tm = await getTranslations({ locale, namespace: 'meta' });

  const pageSchema = buildPageSchema({
    locale,
    path: '/softwarehouse',
    title: tm('softwarehouse_title'),
    description: tm('softwarehouse_description'),
    type: 'WebPage',
    breadcrumbItems: [
      { name: tm('home_title'), url: `https://fabiocherici.com/${locale}` },
      { name: tm('softwarehouse_title'), url: `https://fabiocherici.com/${locale}/softwarehouse` },
    ],
  });

  const serviceSchema = {
    '@type': 'Service',
    '@id': `https://fabiocherici.com/${locale}/softwarehouse#service`,
    name: 'Softwarehouse',
    serviceType: 'Custom software development',
    provider: {
      '@type': 'Person',
      name: 'Fabio Cherici',
      url: 'https://fabiocherici.com',
    },
    areaServed: { '@type': 'Country', name: 'Italy' },
    description: tm('softwarehouse_description'),
    offers: [
      { '@type': 'Offer', name: 'Micro', priceRange: '€2.000–€5.000', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Mini', priceRange: '€5.000–€8.000', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Verticale singolo', priceRange: '€8.000–€15.000', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Custom modulare', priceRange: '€15.000–€30.000', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Sistema integrato', priceRange: '€30.000–€60.000', priceCurrency: 'EUR' },
    ],
  };

  const comparisonRows = [1, 2, 3, 4, 5, 6].map((n) => ({
    promise: t(`pain_row_${n}_promise`),
    reality: t(`pain_row_${n}_reality`),
  }));

  const formulaTerms = [
    { label: t('how_formula_term_1'), emphasis: 'primary' as const },
    { label: t('how_formula_term_2'), emphasis: 'accent' as const },
    { label: t('how_formula_term_3'), emphasis: 'accent' as const },
  ];

  const iconGridItems = [1, 2, 3, 4, 5, 6, 7].map((n, i) => ({
    icon: RECEIVE_ICONS[i],
    title: t(`receive_lever_${n}_title`),
    description: t(`receive_lever_${n}_desc`),
  }));

  const pricingTiers = [1, 2, 3, 4, 5].map((n) => ({
    name: t(`pricing_tier_${n}_name`),
    priceRange: t(`pricing_tier_${n}_price`),
    timeline: t(`pricing_tier_${n}_timeline`),
    maintenance: t(`pricing_tier_${n}_maintenance`),
    depositMvp: t(`pricing_tier_${n}_deposit`),
  }));

  const flowPhases = [
    { label: t('process_phase_1_label'), steps: [1, 2, 3] },
    { label: t('process_phase_2_label'), steps: [4, 5] },
    { label: t('process_phase_3_label'), steps: [6] },
    { label: t('process_phase_4_label'), steps: [7, 8, 9] },
    { label: t('process_phase_5_label'), steps: [10, 11] },
  ].map((phase) => ({
    label: phase.label,
    steps: phase.steps.map((n) => ({ number: n, text: t(`process_step_${n}`) })),
  }));

  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [...pageSchema, serviceSchema] }),
        }}
      />

      {/* ── 1. Hero ── */}
      <section className="py-24 bg-[var(--bg)]" aria-labelledby="softwarehouse-heading">
        <div className="mx-auto max-w-3xl px-6">
          <p className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('hero_label')}
          </p>
          <h1
            id="softwarehouse-heading"
            className="reveal font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-[var(--text-primary)] mb-6"
          >
            {t('hero_title')}
          </h1>
          <p className="reveal text-xl sm:text-2xl text-[var(--accent)] leading-relaxed font-medium mb-2">
            {t('hero_subtitle_1')}
          </p>
          <p className="reveal text-xl sm:text-2xl text-[var(--accent)] leading-relaxed font-medium mb-12">
            {t('hero_subtitle_2')}
          </p>
          <div className="space-y-6">
            {(['hero_p1', 'hero_p2', 'hero_p3'] as const).map((key) => (
              <p key={key} className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                {t(key)}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Pain — ComparisonTable ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('pain_label')}
          </h2>
          <div className="space-y-6 mb-12">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('pain_p1')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('pain_p2')}
            </p>
          </div>
          <ComparisonTable
            ariaLabel={t('pain_label')}
            headPromise={t('pain_table_head_promise')}
            headReality={t('pain_table_head_reality')}
            rows={comparisonRows}
            caption={t('pain_closing')}
          />
        </div>
      </section>

      {/* ── 3. How — FormulaBlock ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('how_label')}
          </h2>
          <div className="space-y-6 mb-12">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('how_p1')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('how_p2')}
            </p>
          </div>
          <FormulaBlock
            ariaLabel={`${t('how_formula_term_1')} ${t('how_op_1')} ${t('how_formula_term_2')} ${t('how_op_2')} ${t('how_formula_term_3')}`}
            terms={formulaTerms}
            operators={[t('how_op_1'), t('how_op_2')]}
          />
          <div className="mt-12 space-y-4">
            {([1, 2, 3] as const).map((n) => (
              <p
                key={n}
                className="reveal text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: t(`how_term_${n}_explanation`).replace(
                    /\*\*(.+?)\*\*/g,
                    '<strong class="text-[var(--text-primary)] font-semibold">$1</strong>',
                  ),
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Receive — IconGrid ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('receive_label')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12">
            {t('receive_intro')}
          </p>
          <IconGrid ariaLabel={t('receive_label')} items={iconGridItems} columns={4} />
          <p className="reveal mt-10 text-sm sm:text-base">
            <Link href={`/${locale}/i-numeri`} className={linkClass}>
              {t('receive_link_numbers')}
            </Link>
          </p>
        </div>
      </section>

      {/* ── 5. Differenziatore ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('diff_label')}
          </h2>
          <div className="space-y-6 mb-12">
            {(['diff_p1', 'diff_p2', 'diff_p3'] as const).map((key) => (
              <p key={key} className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                {t(key)}
              </p>
            ))}
          </div>
          <figure className="reveal">
            <Image
              src="/img/softwarehouse/natan-chat-example.webp"
              alt={t('diff_screenshot_alt')}
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg border border-[var(--border)]"
            />
            <figcaption className="mt-4 text-sm text-[var(--text-muted)] italic leading-relaxed">
              {t('diff_screenshot_caption')}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── 6. Portfolio ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('portfolio_label')}
          </h2>
          <div className="space-y-6 mb-12 max-w-3xl">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('portfolio_p1')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('portfolio_p2')}
            </p>
          </div>
          <PortfolioGrid
            ariaLabel={t('portfolio_label')}
            groups={[
              {
                label: t('portfolio_group_market'),
                children: PORTFOLIO_MARKET.map((p) => (
                  <PortfolioCard
                    key={p.key}
                    name={t(`portfolio_${p.key}_name`)}
                    description={t(`portfolio_${p.key}_desc`)}
                    loc={p.loc}
                    hours={'hours' in p ? p.hours : undefined}
                    auditBadge={'hours' in p ? t('portfolio_audit_badge') : undefined}
                    liveUrl={'live' in p ? p.live : undefined}
                  />
                )),
              },
              {
                label: t('portfolio_group_infra'),
                children: PORTFOLIO_INFRA.map((p) => (
                  <PortfolioCard
                    key={p.key}
                    name={t(`portfolio_${p.key}_name`)}
                    description={t(`portfolio_${p.key}_desc`)}
                    loc={'loc' in p ? p.loc : undefined}
                    liveUrl={'live' in p ? p.live : undefined}
                  />
                )),
              },
              {
                label: t('portfolio_group_sites'),
                children: PORTFOLIO_SITES.map((p) => (
                  <PortfolioCard
                    key={p.key}
                    name={t(`portfolio_${p.key}_name`)}
                    description={t(`portfolio_${p.key}_desc`)}
                    loc={'loc' in p ? p.loc : undefined}
                    hours={'hours' in p ? p.hours : undefined}
                    auditBadge={'hours' in p ? t('portfolio_audit_badge') : undefined}
                    liveUrl={'live' in p ? p.live : undefined}
                  />
                )),
              },
            ]}
          />
          <p className="reveal mt-10 text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
            {t('portfolio_audit_note')}{' '}
            <Link href={`/${locale}/i-numeri`} className={linkClass}>
              {t('portfolio_audit_link')}
            </Link>
          </p>
        </div>
      </section>

      {/* ── 7. Process — FlowDiagram ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('process_label')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12 max-w-3xl">
            {t('process_intro')}
          </p>
          <FlowDiagram ariaLabel={t('process_label')} phases={flowPhases} />
          <p className="reveal mt-12 text-base sm:text-lg text-[var(--accent)] italic leading-relaxed max-w-3xl">
            {t('process_closing')}
          </p>
        </div>
      </section>

      {/* ── 8. Investimento — PricingTiers ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('pricing_label')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12 max-w-3xl">
            {t('pricing_intro')}
          </p>
          <PricingTiers
            ariaLabel={t('pricing_aria')}
            tiers={pricingTiers}
            labels={{
              timeline: t('pricing_label_timeline'),
              maintenance: t('pricing_label_maintenance'),
              depositMvp: t('pricing_label_deposit'),
            }}
          />
          <p className="reveal mt-8 text-sm">
            <a href={EMAIL_HREF} className={linkClass}>
              {t('pricing_uncertain_link')}
            </a>
          </p>
        </div>
      </section>

      {/* ── 9. CTA ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('cta_label')}
          </p>
          <p className="reveal text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed mb-12">
            {t('cta_paragraph')}
          </p>
          <div className="reveal flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={EMAIL_HREF}
              aria-label={t('cta_email_aria')}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3 text-base font-semibold text-[var(--bg)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              {t('cta_email')}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('cta_whatsapp_aria')}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-8 py-3 text-base font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--bg)]"
            >
              {t('cta_whatsapp')}
              <span className="sr-only">, opens in new tab</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
