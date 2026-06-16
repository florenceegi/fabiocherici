/**
 * @package fabiocherici.com — Softwarehouse Hero (attention-first, M-018)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-16
 * @purpose Hero conversazionale "split" (design ATTENTION_HERO_RECOMMENDATION
 *          Opzione A, approvato CEO M-018). PRIMO viewport in due colonne:
 *          sinistra = la promessa (label, H1 risk-reversal SSOT, sub de-gergata,
 *          1 riga trust); destra = l'azione = il widget Padmin con prompt-seed
 *          cliccabili (AdvisorSlot). L'hero È la sezione #padmin (sopra la piega).
 *          Server component: l'H1 (LCP) è testo server-rendered, niente 3D
 *          (rimosso — era solo per la home), il widget Padmin idrata come client
 *          dentro AdvisorSlot senza spostare il testo (no CLS, P0-FC-5).
 *          Leggibile senza JS: testo + fallback chat onesto (P0-FC-2).
 * @mission M-018
 */

import { getTranslations } from 'next-intl/server';
import AdvisorSlot from './AdvisorSlot';

export interface SoftwarehouseHeroProps {
  locale: string;
}

export default async function SoftwarehouseHero({ locale }: SoftwarehouseHeroProps) {
  const t = await getTranslations({ locale, namespace: 'softwarehouse' });
  const tn = await getTranslations({ locale, namespace: 'nexus' });
  const tf = await getTranslations({ locale, namespace: 'footer' });

  const seeds = [tn('seed_1'), tn('seed_2'), tn('seed_3')] as const;

  return (
    <section
      className="relative overflow-hidden bg-[var(--bg)]"
      aria-labelledby="softwarehouse-heading"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
        {/* ── Colonna sinistra: la promessa (scannabile, LCP = H1) ── */}
        <div>
          <p className="mb-6 text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)]">
            {t('hero_label')}
          </p>

          <h1
            id="softwarehouse-heading"
            className="reveal font-[family-name:var(--font-display)] text-4xl font-light leading-[1.1] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl"
          >
            {t('hero_title')}
          </h1>

          <p className="reveal mt-6 max-w-xl text-lg text-[var(--text-secondary)] leading-relaxed sm:text-xl">
            {t('hero_sub')}
          </p>

          <p className="reveal mt-6 text-sm font-mono uppercase tracking-wider text-[var(--text-muted)]">
            {t('hero_trust')}
          </p>
        </div>

        {/* ── Colonna destra: l'azione = parlare con Padmin (CTA primaria) ── */}
        <div>
          <p className="mb-3 text-sm font-mono uppercase tracking-widest text-[var(--text-muted)]">
            {t('padmin_section_label')}
          </p>
          <h2 className="reveal mb-6 font-[family-name:var(--font-display)] text-2xl font-light tracking-tight text-[var(--text-primary)] sm:text-3xl">
            {t('padmin_section_title')}
          </h2>
          <AdvisorSlot
            demoCaption={t('lso_demo_caption')}
            ctaLabel={t('lso_chat_cta')}
            opensNewTabLabel={tf('opens_new_tab')}
            seeds={seeds}
            seedIntro={tn('seed_intro')}
          />
        </div>
      </div>
    </section>
  );
}
