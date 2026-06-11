/**
 * @package fabiocherici.com — Softwarehouse Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-11
 * @purpose Softwarehouse page — rewrite M-015: 8 sezioni risk-reversal +
 *          Oracode Nexus→LSO (SSOT commercial-claims v1.0.0, P0-FC-6).
 *          Hero "Vedi il tuo software funzionare. Poi decidi." + cantiere
 *          aperto LIVE + 3 card offerta + processo 5 fasi (riuso M-008) +
 *          specie nuova LSO + demo toccabili + prezzi invariati + CTA calda.
 *          Server component: tutto il testo nell'HTML statico (P0-FC-2).
 * @mission M-015
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildAlternates, buildOgImage, buildPageSchema } from '@/lib/seo';
import IconGrid from '@/components/infographics/IconGrid';
import FlowDiagram from '@/components/infographics/FlowDiagram';
import PricingTiers from '@/components/infographics/PricingTiers';
import PortfolioCard from '@/components/infographics/PortfolioCard';
import SoftwarehouseHero from '@/components/softwarehouse/SoftwarehouseHero';
import LiveSiteStats from '@/components/softwarehouse/LiveSiteStats';
import LsoTraits from '@/components/softwarehouse/LsoTraits';
import AdvisorSlot from '@/components/softwarehouse/AdvisorSlot';
import SectionCta from '@/components/softwarehouse/SectionCta';

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

const labelClass =
  'reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4';

const titleClass =
  'reveal font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-primary)] mb-6';

/* Icone card offerta — stesso stile stroke 1.5 del pattern M-008 */
const OFFER_ICONS = [
  // 1. Software su misura — layers
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
  // 2. Esemplare unico (Sigillo) — award/seal
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="8" r="6" /><path d="M15.5 13 17 22l-5-3-5 3 1.5-9" /></svg>,
  // 3. Già rifatto — refresh
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>,
];

const GITHUB_URL = 'https://github.com/florenceegi';
const IDEALORO_LIVE_URL = 'https://preview.florenceegi.com';
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
  const tf = await getTranslations('footer');

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

  /* 3 card offerta — SSOT §2, beneficio PRIMA del nome proprietario (regola jargon §1) */
  const offerItems = [
    {
      icon: OFFER_ICONS[0],
      title: t('offer_1_title'),
      description: t.rich('offer_1_desc', {
        pricinglink: (chunks: ReactNode) => (
          <a href="#prezzi" className={linkClass}>{chunks}</a>
        ),
      }),
    },
    {
      icon: OFFER_ICONS[1],
      title: t('offer_2_title'),
      description: t.rich('offer_2_desc', {
        demolink: (chunks: ReactNode) => (
          <a href="#demo" className={linkClass}>{chunks}</a>
        ),
      }),
    },
    {
      icon: OFFER_ICONS[2],
      title: t('offer_3_title'),
      description: t.rich('offer_3_desc', {
        contactlink: (chunks: ReactNode) => (
          <a href="#contatto" className={linkClass}>{chunks}</a>
        ),
      }),
    },
  ];

  /* Processo 5 fasi — RIUSO INVARIATO M-008 (SSOT §3 r4: sancito, non si rinegozia) */
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

  /* Fasce INVARIATE (SSOT §8) */
  const pricingTiers = [1, 2, 3, 4, 5].map((n) => ({
    name: t(`pricing_tier_${n}_name`),
    priceRange: t(`pricing_tier_${n}_price`),
    timeline: t(`pricing_tier_${n}_timeline`),
    maintenance: t(`pricing_tier_${n}_maintenance`),
    depositMvp: t(`pricing_tier_${n}_deposit`),
  }));

  const lsoTraits = [1, 2, 3].map((n) => ({
    title: t(`lso_trait_${n}_title`),
    description: t(`lso_trait_${n}_desc`),
  }));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [...pageSchema, serviceSchema] }),
        }}
      />

      {/* ── 1. Hero — claim risk-reversal + 3D ambient (unico Canvas) ── */}
      <SoftwarehouseHero />

      {/* ── 2. Cantiere aperto LIVE ── */}
      <section id="cantiere" className="py-24 bg-[var(--bg-elevated)]" aria-labelledby="cantiere-heading">
        <div className="mx-auto max-w-5xl px-6">
          <p className={labelClass}>{t('live_label')}</p>
          <h2 id="cantiere-heading" className={titleClass}>{t('live_title')}</h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-10 max-w-3xl">
            {t('live_intro')}
          </p>
          <LiveSiteStats />
          <p className="reveal mt-8 text-sm sm:text-base">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {t('live_github_link')}
              <span className="sr-only"> ({tf('opens_new_tab')})</span>
            </a>
          </p>
        </div>
      </section>

      {/* ── 3. Le 3 linee d'offerta ── */}
      <section id="offerta" className="py-24 bg-[var(--bg)]" aria-labelledby="offerta-heading">
        <div className="mx-auto max-w-5xl px-6">
          <p className={labelClass}>{t('offer_label')}</p>
          <h2 id="offerta-heading" className={`${titleClass} mb-12`}>{t('offer_title')}</h2>
          <IconGrid ariaLabel={t('offer_label')} items={offerItems} columns={3} />
          <SectionCta text={t('cta_mid_offer')} href="#contatto" />
        </div>
      </section>

      {/* ── 4. Processo 5 fasi — riuso M-008 ── */}
      <section id="processo" className="py-24 bg-[var(--bg-elevated)]" aria-labelledby="processo-heading">
        <div className="mx-auto max-w-6xl px-6">
          <h2 id="processo-heading" className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('process_label')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12 max-w-3xl">
            {t('process_intro_v2')}
          </p>
          <FlowDiagram ariaLabel={t('process_label')} phases={flowPhases} />
          <p className="reveal mt-12 text-base sm:text-lg text-[var(--accent)] italic leading-relaxed max-w-3xl">
            {t('process_closing')}
          </p>
        </div>
      </section>

      {/* ── 5. La specie nuova — Oracode Nexus → LSO ── */}
      <section id="lso" className="py-32 bg-[var(--bg)]" aria-labelledby="lso-heading">
        <div className="mx-auto max-w-3xl px-6">
          <p className={labelClass}>{t('lso_label')}</p>
          <h2 id="lso-heading" className={titleClass}>{t('lso_title')}</h2>
          <div className="space-y-6 mb-10">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('lso_p1')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('lso_p2')}
            </p>
          </div>
          <div className="reveal my-10 text-center">
            <p className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-light text-[var(--accent)]">
              {t('lso_name')}
            </p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{t('lso_name_translation')}</p>
          </div>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-10">
            {t('lso_proof')}
          </p>
          <LsoTraits ariaLabel={t('lso_label')} traits={lsoTraits} />
          <p className="reveal mt-10 mb-12 text-lg sm:text-xl text-[var(--accent)] italic leading-relaxed">
            {t('lso_closing')}
          </p>
          <AdvisorSlot
            demoAlt={t('lso_demo_alt')}
            demoCaption={t('lso_demo_caption')}
            ctaLabel={t('lso_chat_cta')}
          />
          <SectionCta text={t('cta_mid_lso')} href="#demo" />
        </div>
      </section>

      {/* ── 6. Demo toccabili ── */}
      <section id="demo" className="py-24 bg-[var(--bg-elevated)]" aria-labelledby="demo-heading">
        <div className="mx-auto max-w-5xl px-6">
          <p className={labelClass}>{t('demos_label')}</p>
          <h2 id="demo-heading" className={titleClass}>{t('demos_title')}</h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12 max-w-3xl">
            {t('demos_intro')}
          </p>
          {/* Lista demo: aggiungere Capasso = aggiungere una card (SOLO al deploy
              su pinocapasso.com — SSOT §3 r10), zero refactor. */}
          <div className="reveal max-w-md">
            <PortfolioCard
              name={t('demos_idealoro_name')}
              description={t('demos_idealoro_desc')}
              liveUrl={IDEALORO_LIVE_URL}
              liveLabel={t('demos_live_label')}
              opensNewTabLabel={tf('opens_new_tab')}
            />
          </div>
        </div>
      </section>

      {/* ── 7. Prezzi — fasce INVARIATE ── */}
      <section id="prezzi" className="py-24 bg-[var(--bg)]" aria-labelledby="prezzi-heading">
        <div className="mx-auto max-w-7xl px-6">
          <h2 id="prezzi-heading" className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
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
          <SectionCta text={t('cta_mid_pricing')} href="#contatto" />
        </div>
      </section>

      {/* ── 8. CTA calda ── */}
      <section id="contatto" className="py-32 bg-[var(--bg-elevated)]" aria-labelledby="contatto-heading">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className={labelClass}>{t('cta_final_label')}</p>
          <h2 id="contatto-heading" className={titleClass}>{t('cta_final_title')}</h2>
          <p className="reveal text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed mb-12">
            {t('cta_final_paragraph')}
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
              <span className="sr-only"> ({tf('opens_new_tab')})</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
