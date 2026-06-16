/**
 * @package fabiocherici.com — Softwarehouse Page (pagina di vendita VISIVA FlorenceEGI)
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 4.0.0 (riscrittura VISIVA 2026 — anti muro-di-testo, verdetto CEO)
 * @date 2026-06-16
 * @purpose Pagina di vendita /softwarehouse come ESPERIENZA visiva 2026, non
 *          documento. Ogni sezione è resa scansionabile a moduli (bento grid,
 *          stat-card, stepper, split mercato↔noi, fact-card, prodotto-vivo
 *          interattivo) invece che a paragrafi. Copy CORTO = etichette/blocchi
 *          brevi (P0-FC-4 i18n). FEDELTÀ SSOT: 8 piattaforme ovunque, caparra IN
 *          CUSTODIA (zero %). I numeri-prova vengono dal portfolio reale (23
 *          progetti · ore EGI-STAT). Voce "noi". Sequenza: Hero (prodotto-vivo) →
 *          1 Problema (bento dolori) → 2 Come funziona (stepper) + risk-reversal
 *          → 3 Velocità (split + stat) → 4 Prezzi (tabella) → 5 Prova (bento:
 *          opere reali + Padmin + verifica) → 5b nastro cliente → 5c portfolio
 *          raggruppato per categoria → 6 Cosa ricevi (tratti)
 *          → 7 Chi siamo (fact-card) → 8 CTA finale. Server component: testo
 *          nell'HTML statico (P0-FC-2), niente 3D (P0-FC-3), GSAP solo nei client
 *          riusati via dynamic import (P0-FC-1).
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildAlternates, buildOgImage, buildPageSchema } from '@/lib/seo';
import SoftwarehouseHero from '@/components/softwarehouse/SoftwarehouseHero';
import RiskReversalBox from '@/components/softwarehouse/RiskReversalBox';
import PricingMarketVsUs from '@/components/softwarehouse/PricingMarketVsUs';
import SectionCta from '@/components/softwarehouse/SectionCta';
import PainCard from '@/components/softwarehouse/visual/PainCard';
import ProcessStepper from '@/components/softwarehouse/visual/ProcessStepper';
import SpeedSplit from '@/components/softwarehouse/visual/SpeedSplit';
import StatCard from '@/components/softwarehouse/visual/StatCard';
import FactCard from '@/components/softwarehouse/visual/FactCard';
import RepoPortfolio from '@/components/softwarehouse/RepoPortfolio';
import Marquee from '@/components/softwarehouse/Marquee';
import SoftwarehouseMotion from '@/components/softwarehouse/SoftwarehouseMotion';

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

const labelClass =
  'reveal text-sm font-mono uppercase tracking-widest text-[var(--accent)] mb-4';

const titleClass =
  'font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-6';

const introClass =
  'reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed';

const linkClass =
  'text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors';

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

  // Provider = FlorenceEGI S.R.L. priceRange = fasce SSOT reali.
  const serviceSchema = {
    '@type': 'Service',
    '@id': `https://fabiocherici.com/${locale}/softwarehouse#service`,
    name: 'Software su misura per PMI',
    serviceType: 'Custom software development',
    provider: {
      '@type': 'Organization',
      name: 'FlorenceEGI S.R.L.',
      url: 'https://florenceegi.com',
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

  /* Sez. 1 — i 4 dolori (bento, copy corto) */
  const pains = [1, 2, 3, 4].map((n) => ({
    title: t(`pain_${n}_title`),
    detail: t(`pain_${n}_detail`),
  }));

  /* Sez. 2 — le 5 FASI del processo (SSOT commercial-claims-public §"processo a 5 fasi") */
  const howSteps = [1, 2, 3, 4, 5].map((n) => ({
    title: t(`how_step_${n}_title`),
    desc: t(`how_step_${n}_desc`),
  }));

  /* Sez. 4 — prezzi: fasce SSOT reali, colonna mercato vs "circa la metà". */
  const pricingRows = [1, 2, 3, 4, 5].map((n) => ({
    name: t(`pricing_tier_${n}_name`),
    price: t(`pricing_tier_${n}_price`),
    market: t(`pricing_tier_${n}_market`),
    maintenance: t(`pricing_tier_${n}_maintenance`),
  }));

  /* Sez. 7 — i 3 fatti di autorità (fact-card) */
  const whoFacts = [1, 2, 3].map((n) => ({
    kicker: t(`who_fact_${n}_kicker`),
    title: t(`who_fact_${n}_title`),
    detail: t(`who_fact_${n}_detail`),
  }));

  const howBoxItems = [t('how_box_1'), t('how_box_2'), t('how_box_3')] as const;

  /* Sez. 5b — nastro vivo in LINGUAGGIO CLIENTE (cosa costruiamo, non nomi-repo) */
  const marqueeItems = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => t(`marquee_item_${n}`));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [...pageSchema, serviceSchema] }),
        }}
      />

      {/* Motore animazioni GROSSE per-sezione (GSAP+ScrollTrigger, reduced-motion safe) */}
      <SoftwarehouseMotion />

      {/* ── HERO — prodotto-vivo (#padmin nello Stadio 2) ── */}
      <SoftwarehouseHero locale={locale} primaryCtaHref="#contatto" />

      {/* ── 1. Il problema — BENTO di dolori brevi, non paragrafone ── */}
      <section id="problema" className="py-24 bg-[var(--bg)]" aria-labelledby="problema-heading">
        <div className="mx-auto max-w-5xl px-6">
          <p className={labelClass}>{t('problem_label')}</p>
          <h2 id="problema-heading" className={`reveal ${titleClass}`}>{t('problem_title')}</h2>
          <div data-sw="bento" className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {pains.map((p) => (
              <PainCard key={p.title} title={p.title} detail={p.detail} />
            ))}
          </div>
          <p className="reveal mt-10 max-w-3xl text-xl leading-relaxed text-[var(--text-primary)] sm:text-2xl">
            {t('problem_closing')}
          </p>
        </div>
      </section>

      {/* ── 2. Come funziona — STEPPER visivo + box risk-reversal ── */}
      <section id="come-funziona" className="py-24 bg-[var(--bg-elevated)]" aria-labelledby="come-funziona-heading">
        <div className="mx-auto max-w-6xl px-6">
          <p className={labelClass}>{t('how_label')}</p>
          <h2 id="come-funziona-heading" className={`reveal ${titleClass}`}>{t('how_title')}</h2>
          <div className="mt-8 mb-12">
            <ProcessStepper steps={howSteps} />
          </div>
          <div className="mx-auto max-w-4xl">
            <RiskReversalBox label={t('how_box_label')} items={howBoxItems} />
            <p className="reveal mt-8 text-lg leading-relaxed text-[var(--accent)] sm:text-xl">
              {t('how_closing')}
            </p>
            <SectionCta text={t('cta_mid_how')} href="#contatto" />
          </div>
        </div>
      </section>

      {/* ── 3. Velocità — SPLIT mercato↔noi + stat (la leva) ── */}
      <section id="velocita" className="py-24 bg-[var(--bg)]" aria-labelledby="velocita-heading">
        <div className="mx-auto max-w-5xl px-6">
          <p className={labelClass}>{t('speed_label')}</p>
          <h2 id="velocita-heading" className={`reveal ${titleClass}`}>{t('speed_title')}</h2>
          <p className={`${introClass} mb-10 max-w-3xl`}>{t('speed_intro')}</p>

          <SpeedSplit
            marketLabel={t('speed_market_label')}
            marketValue={t('speed_market_value')}
            marketDetail={t('speed_market_detail')}
            usLabel={t('speed_us_label')}
            usValue={t('speed_us_value')}
            usDetail={t('speed_us_detail')}
          />

          <div data-sw="stagger" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              value={t('speed_stat_1_value')}
              label={t('speed_stat_1_label')}
              variant="outline"
            />
            <div className="reveal flex flex-col justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-7">
              <p className="text-sm font-mono uppercase tracking-widest text-[var(--accent)]">
                {t('speed_why_label')}
              </p>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{t('speed_why')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Prezzi — tabella mercato vs con noi + auto-qualifica ── */}
      <section id="prezzi" className="py-24 bg-[var(--bg-elevated)]" aria-labelledby="prezzi-heading">
        <div className="mx-auto max-w-5xl px-6">
          <p className={labelClass}>{t('pricing_label')}</p>
          <h2 id="prezzi-heading" className={`reveal ${titleClass}`}>{t('pricing_title')}</h2>
          <p className={`${introClass} mb-10 max-w-3xl`}>{t('pricing_intro')}</p>
          <div data-sw="up">
            <PricingMarketVsUs
              rows={pricingRows}
              usValue={t('pricing_us_value')}
              labels={{
                caption: t('pricing_aria'),
                tier: t('pricing_col_tier'),
                price: t('pricing_col_price'),
                market: t('pricing_col_market'),
                us: t('pricing_col_us'),
                maintenance: t('pricing_col_maintenance'),
              }}
            />
          </div>
          <p className="reveal mt-6 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)] italic">
            {t('pricing_caparra_note')}
          </p>
          <p className="reveal mt-4 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('pricing_qualify')}
          </p>
          <SectionCta text={t('cta_mid_pricing')} href="#contatto" />
        </div>
      </section>

      {/* ── 5. Oracode Nexus — il MOTORE, spiegato semplice (ex sezione "prova", doppione) ── */}
      <section id="oracode-nexus" className="py-24 bg-[var(--bg)]" aria-labelledby="nexus-heading">
        <div className="mx-auto max-w-6xl px-6">
          <p className={labelClass}>{t('nexus_label')}</p>
          <h2 id="nexus-heading" className={`reveal ${titleClass}`}>{t('nexus_title')}</h2>
          <p className={`${introClass} mb-10 max-w-3xl`}>{t('nexus_intro')}</p>

          {/* Confronto: vibe coding ✕ vs Oracode Nexus ✓ — "un altro pianeta" sulla QUALITÀ del codice */}
          <p className="reveal mb-6 max-w-3xl font-[family-name:var(--font-display)] text-xl font-light leading-snug text-[var(--text-primary)] sm:text-2xl">
            {t('nexus_contrast_title')}
          </p>
          <div data-sw="split" className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 opacity-70">
              <p className="mb-4 text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                {t('nexus_vibe_label')}
              </p>
              <ul className="flex flex-col gap-3">
                {[1, 2, 3].map((n) => (
                  <li key={n} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    <span aria-hidden="true" className="mt-0.5 text-[var(--text-muted)]">✕</span>
                    {t(`nexus_vibe_${n}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-2xl border border-[var(--border-accent)] bg-[var(--bg-card)] p-6"
              style={{ boxShadow: '0 0 0 1px var(--accent-muted)' }}
            >
              <p className="mb-4 text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
                {t('nexus_ours_label')}
              </p>
              <ul className="flex flex-col gap-3">
                {[1, 2, 3].map((n) => (
                  <li key={n} className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--text-primary)]">
                    <span aria-hidden="true" className="mt-0.5 font-semibold text-[var(--accent)]">✓</span>
                    {t(`nexus_ours_${n}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-sw="stagger" className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 transition-transform hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="font-[family-name:var(--font-display)] text-4xl font-light leading-none text-[var(--accent)]"
                >
                  0{n}
                </span>
                <h3 className="text-lg font-semibold leading-tight text-[var(--text-primary)]">
                  {t(`nexus_${n}_title`)}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {t(`nexus_${n}_desc`)}
                </p>
              </div>
            ))}
          </div>

          <p className="reveal mt-10 max-w-3xl font-[family-name:var(--font-display)] text-xl font-light leading-snug text-[var(--text-primary)] sm:text-2xl">
            {t('nexus_closing')}
          </p>

          <SectionCta text={t('cta_mid_proof')} href="#contatto" />
        </div>
      </section>

      {/* ── 5b. Nastro vivo — cosa costruiamo, in linguaggio cliente ── */}
      <Marquee items={marqueeItems} ariaLabel={t('marquee_aria')} durationSeconds={45} />

      {/* ── 5c. Portfolio — i 23 progetti raggruppati per categoria + totali count-up ── */}
      <RepoPortfolio />

      {/* ── 7. Chi è FlorenceEGI — FACT-CARD, non paragrafone ── */}
      <section id="chi-siamo" className="py-24 bg-[var(--bg)]" aria-labelledby="chi-siamo-heading">
        <div className="mx-auto max-w-5xl px-6">
          <p className={labelClass}>{t('who_label')}</p>
          <h2 id="chi-siamo-heading" className={`reveal ${titleClass}`}>{t('who_title')}</h2>
          <div data-sw="stagger" className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {whoFacts.map((f) => (
              <FactCard key={f.title} kicker={f.kicker} title={f.title} detail={f.detail} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA finale calda ── */}
      <section id="contatto" className="py-32 bg-[var(--bg-elevated)]" aria-labelledby="contatto-heading">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className={labelClass}>{t('cta_final_label')}</p>
          <h2 id="contatto-heading" className={`reveal ${titleClass}`}>{t('cta_final_title')}</h2>
          <p className="reveal mb-12 text-lg leading-relaxed text-[var(--text-secondary)] sm:text-xl">
            {t('cta_final_paragraph')}
          </p>
          <div className="reveal flex flex-col items-center justify-center gap-4 sm:flex-row">
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
          {/* Contatto SEMPRE raggiungibile (anche senza client mail): indirizzo visibile/copiabile */}
          <p className="reveal mt-8 font-mono text-sm text-[var(--text-secondary)]">
            <a href={EMAIL_HREF} className={linkClass}>fabio@florenceegi.com</a>
            <span className="mx-3 text-[var(--text-muted)]" aria-hidden="true">·</span>
            <span className="text-[var(--text-primary)]">+39 338 835 0412</span>
          </p>
          <p className="reveal mt-6 text-base text-[var(--text-secondary)]">
            <a href="#padmin" className={linkClass}>{t('cta_final_padmin')}</a>
          </p>
        </div>
      </section>
    </div>
  );
}
