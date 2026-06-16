/**
 * @package fabiocherici.com — SoftwarehouseHero (hero ESPERIENZA, "la danza")
 * @author FlorenceEGI — fabiocherici.com
 * @version 5.0.0 (musical: la danza incanta, le parole danno significato)
 * @date 2026-06-16
 * @purpose Above-the-fold come ESPERIENZA VISIVA IN MOVIMENTO (richiesta CEO:
 *          nel 2026 non si legge, si guarda). STADIO 1: un muro di OPERE VERE
 *          dell'ecosistema FlorenceEGI che SCORRE in colonne (HeroArtWall) =
 *          la "danza" (colore + moto al primo sguardo, prova del lavoro vivo);
 *          sopra, poche PAROLE che danno senso — eyebrow → H1 grande (LCP testo,
 *          P0-FC-2) → promessa breve → badge "operatore online" → 1 CTA bronzo →
 *          striscia-numeri snella. Scrim grafite→trasparente per leggibilità.
 *          Moto = CSS transform (P0-FC-3 niente WebGL, P0-FC-5 no CLS, spento a
 *          reduced-motion). STADIO 2 (#padmin): Padmin (chat viva) + vetrina
 *          opere cliccabili (AdvisorSlot → NexusWidget, gate env → fallback).
 *          Server component. FEDELTÀ: voce "noi", 8 piattaforme, 3-5 giorni,
 *          numeri-prova SSOT. Senza JS l'hero resta leggibile (la danza è
 *          enhancement dietro il testo).
 */

import { getTranslations } from 'next-intl/server';
import AdvisorSlot from './AdvisorSlot';
import HeroAssemble from './HeroAssemble';

export interface SoftwarehouseHeroProps {
  locale: string;
  /** Href della CTA primaria (es. "#contatto" o mailto). */
  primaryCtaHref: string;
}

export default async function SoftwarehouseHero({ locale, primaryCtaHref }: SoftwarehouseHeroProps) {
  const t = await getTranslations({ locale, namespace: 'softwarehouse' });
  const tn = await getTranslations({ locale, namespace: 'nexus' });
  const tf = await getTranslations({ locale, namespace: 'footer' });

  const seeds = [tn('seed_1'), tn('seed_2'), tn('seed_3')] as const;

  const stats = [
    { value: t('hero_stat_1_value'), unit: t('hero_stat_1_unit'), label: t('hero_stat_1_label') },
    { value: t('hero_stat_2_value'), unit: '', label: t('hero_stat_2_label') },
    { value: t('hero_stat_3_value'), unit: t('hero_stat_3_unit'), label: t('hero_stat_3_label') },
  ];

  return (
    <>
      {/* ══ STADIO 1 — value-prop compatta (NO arte di sfondo: software house) ══ */}
      <section
        className="sw-hero relative overflow-hidden bg-[var(--bg)]"
        aria-labelledby="softwarehouse-heading"
      >
        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-24 sm:py-28 lg:grid-cols-2">
         <div>
          <p className="mb-6 text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)]">
            {t('hero_eyebrow')}
          </p>

          <h1
            id="softwarehouse-heading"
            className="max-w-3xl font-[family-name:var(--font-display)] text-4xl font-light leading-[1.06] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-[4.25rem]"
          >
            {t('hero_title')}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-secondary)]">
            {t('hero_promise')}
          </p>

          <p className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--border-accent)] bg-[var(--bg-card)]/80 px-4 py-2 text-sm text-[var(--text-secondary)] backdrop-blur">
            <span className="sw-live-dot" aria-hidden="true" />
            {t('hero_live_badge')}
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href={primaryCtaHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3.5 text-base font-semibold text-[var(--bg)] transition-colors hover:bg-[var(--accent-hover)] sm:w-auto"
            >
              {t('hero_cta_primary')}
            </a>
            <a
              href="#padmin"
              className="text-base text-[var(--text-secondary)] underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
            >
              {t('hero_cta_padmin')} ↓
            </a>
          </div>

          {/* striscia-numeri snella (non card pesanti) */}
          <dl className="mt-14 flex flex-wrap gap-x-10 gap-y-6">
            {stats.map((s) => (
              <div key={s.label} className="border-l border-[var(--border-accent)] pl-4">
                <dt className="font-[family-name:var(--font-display)] text-3xl font-light text-[var(--accent)] sm:text-4xl">
                  {s.value}
                  {s.unit ? <span className="ml-1 text-xl text-[var(--text-secondary)]">{s.unit}</span> : null}
                </dt>
                <dd className="mt-1 max-w-[12rem] text-sm text-[var(--text-muted)]">{s.label}</dd>
              </div>
            ))}
          </dl>
         </div>

          {/* la DANZA: il gestionale che si assembla da solo */}
          <div className="hidden lg:block">
            <HeroAssemble />
          </div>
        </div>
      </section>

      {/* ══ STADIO 2 — PADMIN + PROVA VIVA (#padmin) ══ */}
      <section
        id="padmin"
        className="bg-[var(--bg-elevated)]"
        aria-labelledby="padmin-section-heading"
      >
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pb-24">
          <p className="mb-3 text-sm font-mono uppercase tracking-widest text-[var(--text-muted)]">
            {t('padmin_section_label')}
          </p>
          <h2
            id="padmin-section-heading"
            className="reveal mb-4 font-[family-name:var(--font-display)] text-2xl font-light tracking-tight text-[var(--text-primary)] sm:text-3xl"
          >
            {t('padmin_section_title')}
          </h2>
          <p className="reveal mb-8 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            {t('padmin_section_intro')}
          </p>
          <AdvisorSlot
            demoCaption={t('lso_demo_caption')}
            ctaLabel={t('lso_chat_cta')}
            opensNewTabLabel={tf('opens_new_tab')}
            seeds={seeds}
            seedIntro={tn('seed_intro')}
          />
        </div>
      </section>
    </>
  );
}
