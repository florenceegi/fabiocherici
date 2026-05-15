/**
 * @package fabiocherici.com — Proof Section
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Blocco 4 — Evidence cards (Sigillo, EGI-Credential, Gialloro). Numbers + comparisons.
 */

'use client';

import { useTranslations } from 'next-intl';

function ProofCard({
  title,
  subtitle,
  stats,
  detail,
  comparison,
}: {
  title: string;
  subtitle: string;
  stats: { label: string; value: string }[];
  detail?: string;
  comparison: string;
}) {
  return (
    <div className="reveal rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 hover:border-[var(--accent-muted)] transition-colors">
      <h3 className="text-xl font-semibold text-[var(--accent)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] mb-6">{subtitle}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {stats.map((s) => (
          <div key={s.label}>
            <span className="block text-2xl font-light font-mono text-[var(--text-primary)]">{s.value}</span>
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>

      {detail && (
        <p className="text-xs text-[var(--text-muted)] mb-4">{detail}</p>
      )}

      <p className="text-sm text-[var(--text-secondary)] italic border-t border-[var(--border)] pt-4">
        {comparison}
      </p>
    </div>
  );
}

export function ProofSection() {
  const t = useTranslations('home.proof');

  return (
    <section id="proof" className="py-32 bg-[var(--bg-elevated)]">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="reveal font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-6">
          {t('title')}
        </h2>

        {/* Big numbers */}
        <div className="reveal mb-6">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('numbers_title')}
          </h3>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            {t('numbers')}
          </p>
          <p className="text-2xl font-[family-name:var(--font-display)] text-[var(--accent)] mt-2">
            {t('numbers_person')}
          </p>
        </div>

        {/* Concurrent dev */}
        <div className="reveal mb-16 rounded-xl border border-[var(--accent-muted)] bg-[var(--accent-glow)] px-8 py-6">
          <h3 className="text-sm font-mono uppercase tracking-widest text-[var(--accent)] mb-2">
            {t('concurrent_title')}
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-3">{t('concurrent_dates')}</p>
          <p className="text-lg text-[var(--text-primary)]">{t('concurrent_desc')}</p>
        </div>

        {/* Proof cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <ProofCard
            title={t('sigillo_title')}
            subtitle={t('sigillo_subtitle')}
            stats={[
              { label: t('label_hours'), value: t('sigillo_hours') },
              { label: t('label_code'), value: t('sigillo_lines') },
            ]}
            detail={t('sigillo_what')}
            comparison={t('sigillo_compare')}
          />

          <ProofCard
            title={t('credential_title')}
            subtitle={t('credential_subtitle')}
            stats={[
              { label: t('label_hours'), value: t('credential_hours') },
              { label: t('label_code'), value: t('credential_lines') },
            ]}
            detail={`${t('credential_standards')}. ${t('credential_overlap')}`}
            comparison={t('credential_compare')}
          />

          <ProofCard
            title={t('gialloro_title')}
            subtitle={t('gialloro_subtitle')}
            stats={[
              { label: t('label_hours'), value: t('gialloro_hours') },
              { label: t('label_code'), value: t('gialloro_lines') },
            ]}
            detail={t('gialloro_calendar')}
            comparison={t('gialloro_compare')}
          />
        </div>
      </div>
    </section>
  );
}
