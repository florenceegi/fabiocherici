/**
 * @package fabiocherici.com — Hero Section
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Homepage hero — Oracode claim + 3D background. Full viewport, text over scene.
 */

'use client';

import { useTranslations } from 'next-intl';
import { Scene3DSwitch } from '@/components/three/Scene3DSwitch';

export function HeroSection() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Scene3DSwitch />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
        <p className="mb-6 text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)]">
          {t('tagline')}
        </p>

        <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight text-[var(--text-primary)]">
          {t('claim')}
        </h1>

        <p className="reveal mt-8 max-w-2xl mx-auto text-lg text-[var(--text-secondary)] leading-relaxed">
          {t('sub1')}
        </p>

        <p className="reveal mt-6 max-w-2xl mx-auto text-base text-[var(--text-muted)] leading-relaxed">
          {t('sub2')}
        </p>

        <div className="reveal mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#proof"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--accent-muted)] px-8 py-3 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all duration-300"
          >
            {t('cta')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
