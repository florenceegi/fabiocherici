/**
 * @package fabiocherici.com — Oracode Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 4.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-22
 * @purpose Oracode paradigm page — 8 sections (OS3+OS4+OSZ), CEO-approved content, verify spy, pillar/rule cards.
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
    title: t('oracode_title'),
    description: t('oracode_description'),
    alternates: buildAlternates(locale, '/oracode'),
    openGraph: { title: t('oracode_title'), description: t('oracode_description'), type: 'website', locale },
  };
}

const PILLAR_IDS = ['1', '2', '3', '4', '5', '6'] as const;

const RULE_IDS = [
  'zero', 'atomic', 'limits', 'anti', 'error', 'service',
  'constants', 'flow', 'i18n', 'interfaces', 'doc', 'infra', 'catalog',
] as const;

const RAIL_IDS = ['block', 'ask', 'warn'] as const;

const EPISTEMIC_IDS = ['compat', 'integrity', 'sources', 'trace'] as const;

export default async function OracodePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('oracode');

  const rich = {
    b: (chunks: ReactNode) => <strong className="font-semibold text-[var(--text-primary)]">{chunks}</strong>,
    c: (chunks: ReactNode) => <code className="ora-code">{chunks}</code>,
    contactlink: (chunks: ReactNode) => (
      <Link href={`/${locale}/contatti`} className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors">
        {chunks}
      </Link>
    ),
    verify: (chunks: ReactNode) => (
      <a
        href={`/${locale}/i-numeri`}
        className="ora-verify"
        aria-label={t('what_verify_aria')}
      >
        {chunks}
      </a>
    ),
    egilink: (chunks: ReactNode) => (
      <Link href={`/${locale}/egi`} className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors">
        {chunks}
      </Link>
    ),
  };

  return (
    <div className="pt-24">
      {/* ── 1. Apertura ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)] mb-6">
            {t('title')}
          </h1>
          <p className="reveal text-xl sm:text-2xl text-[var(--text-secondary)] leading-relaxed italic mb-10">
            {t('open_q')}
          </p>
          <p className="reveal text-3xl sm:text-4xl font-semibold text-[var(--accent)] mb-10">
            {t('open_false')}
          </p>
          <div className="space-y-6">
            {(['open_p1', 'open_p2', 'open_p3', 'open_p4', 'open_p5'] as const).map((key) => (
              <p key={key} className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                {t(key)}
              </p>
            ))}
          </div>
          <p className="reveal mt-12 text-xl sm:text-2xl text-[var(--text-primary)] font-medium">
            {t.rich('open_cta', rich)}
          </p>
        </div>
      </section>

      {/* ── 2. Concretamente ── */}
      <section className="py-20 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('what_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
            {t.rich('what_p1', rich)}
          </p>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {t('what_p2')}
          </p>
        </div>
      </section>

      {/* ── 3. Fondamenta ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('foundations_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            {t('foundations_intro')}
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {PILLAR_IDS.map((n) => (
              <div key={n} className="reveal ora-card">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full border border-[var(--accent-muted)] text-xs font-mono text-[var(--accent)]">
                    {n}
                  </span>
                  <h3 className="text-base font-medium text-[var(--text-primary)]">
                    {t(`pillar_${n}_name`)}
                  </h3>
                </div>
                <p className="text-sm italic text-[var(--accent)] mb-3">
                  {t(`pillar_${n}_motto`)}
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {t.rich(`pillar_${n}_desc`, rich)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Regole ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('rules_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            {t('rules_intro')}
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {RULE_IDS.map((id) => (
              <div key={id} className="reveal ora-card">
                <h3 className="text-base font-medium text-[var(--text-primary)] mb-1">
                  {t(`rule_${id}_name`)}
                </h3>
                <p className="text-sm italic text-[var(--accent)] mb-3">
                  {t.rich(`rule_${id}_motto`, rich)}
                </p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {t.rich(`rule_${id}_desc`, rich)}
                </p>
              </div>
            ))}
          </div>
          <p className="reveal mt-10 text-sm text-[var(--text-muted)] leading-relaxed italic">
            {t('rules_note')}
          </p>
        </div>
      </section>

      {/* ── 5. Binari ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('rails_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
            {t('rails_intro')}
          </p>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-10">
            {t.rich('rails_p1', rich)}
          </p>
          <p className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-6">
            {t('rails_levels')}
          </p>
          <div className="space-y-4 mb-10">
            {RAIL_IDS.map((id) => (
              <div key={id} className="reveal flex gap-4 items-start ora-card">
                <span className="ora-rail-badge" data-rail={id}>
                  {t(`rails_${id}_name`)}
                </span>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-0.5">
                  {t(`rails_${id}_desc`)}
                </p>
              </div>
            ))}
          </div>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {t('rails_closing')}
          </p>
        </div>
      </section>

      {/* ── 6. Memoria viva ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('memory_title')}
          </h2>
          <div className="space-y-6">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('memory_p1')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('memory_p2')}
            </p>
          </div>
          <blockquote className="reveal my-12 border-l-2 border-[var(--accent)] pl-6">
            <p className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] leading-snug">
              {t('memory_claim')}
            </p>
          </blockquote>
          <div className="space-y-6">
            {(['memory_p3', 'memory_p4', 'memory_p5', 'memory_p6'] as const).map((key) => (
              <p key={key} className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                {t.rich(key, rich)}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. L'altra metà — la disciplina umana (OS4) ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('human_title')}
          </h2>
          <div className="space-y-6">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('human_p1')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('human_p2')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t.rich('human_p3', rich)}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('human_p4')}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-10 mb-10">
            {EPISTEMIC_IDS.map((id) => (
              <div key={id} className="reveal ora-card">
                <h3 className="text-base font-medium text-[var(--text-primary)] mb-1">
                  {t(`human_${id}_name`)}
                </h3>
                <p className="text-sm italic text-[var(--accent)]">
                  {t(`human_${id}_desc`)}
                </p>
              </div>
            ))}
          </div>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed italic">
            {t('human_closing')}
          </p>
        </div>
      </section>

      {/* ── 8. Frutto naturale ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('fruit_title')}
          </h2>
          <div className="space-y-6">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t.rich('fruit_osz_p1', rich)}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('fruit_osz_p2')}
            </p>
            {(['fruit_p1', 'fruit_p2', 'fruit_p3', 'fruit_p4', 'fruit_p5'] as const).map((key) => (
              <p key={key} className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                {t.rich(key, rich)}
              </p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
