/**
 * @package fabiocherici.com — Ecosistema Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose The 9 FlorenceEGI organs — what they do, how they connect. All content via i18n.
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';

const ORGAN_IDS = ['egi', 'hub', 'hub_home', 'natan', 'credential', 'sigillo', 'bottega', 'info', 'staging'] as const;

export default async function EcosistemaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ecosistema');

  return (
    <div className="pt-24">
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            {t('subtitle')}
          </p>
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)]">
            {t('title')}
          </h1>
        </div>
      </section>

      <section className="py-16 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('organ_label')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ORGAN_IDS.map((id) => (
              <div
                key={id}
                className="reveal rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 hover:border-[var(--accent-muted)] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  {/* P0-FC-4 exception: organ names are proper nouns */}
                  <h3 className="text-base font-semibold text-[var(--accent)]">{t(`organ_${id}_name`)}</h3>
                  <span className="text-xs text-[var(--text-muted)] font-mono">{t(`organ_${id}_role`)}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{t(`organ_${id}_desc`)}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] font-mono">{t(`organ_${id}_stack`)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('infra_title')}
          </h2>
          <div className="reveal space-y-4 text-base text-[var(--text-secondary)] leading-relaxed">
            <p>{t('infra_p1')}</p>
            <p>{t('infra_p2')}</p>
            <p>{t('infra_p3')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
