/**
 * @package fabiocherici.com — Softwarehouse Hero
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-11
 * @purpose Hero softwarehouse — claim risk-reversal (SSOT commercial-claims §1 atto 1)
 *          + 3D ambient background. Unico Canvas della pagina (P0-FC-5).
 *          Testo visibile senza JS: .reveal è solo enhancement (P0-FC-2).
 * @mission M-015
 */

'use client';

import { useTranslations } from 'next-intl';
import { Scene3DSwitch } from '@/components/three/Scene3DSwitch';

export default function SoftwarehouseHero() {
  const t = useTranslations('softwarehouse');

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg)]"
      aria-labelledby="softwarehouse-heading"
    >
      <Scene3DSwitch />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
        <p className="mb-6 text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)]">
          {t('hero_label')}
        </p>

        <h1
          id="softwarehouse-heading"
          className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight text-[var(--text-primary)]"
        >
          {t('hero_title')}
        </h1>

        <p className="reveal mt-8 max-w-2xl mx-auto text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed">
          {t('hero_sub')}
        </p>

        <div className="reveal mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#processo"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3 text-base font-semibold text-[var(--bg)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            {t('hero_cta_process')}
          </a>
          <a
            href="#contatto"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-8 py-3 text-base font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--bg)]"
          >
            {t('hero_cta_contact')}
          </a>
        </div>
      </div>
    </section>
  );
}
