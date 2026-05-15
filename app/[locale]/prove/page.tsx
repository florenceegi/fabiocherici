/**
 * @package fabiocherici.com — Prove Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Detailed evidence page — numbers, audit links, methodology. All content via i18n.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('prove_title'),
    openGraph: { title: t('prove_title'), type: 'website', locale },
  };
}

const STAT_IDS = ['lines', 'platforms', 'languages', 'files', 'symbols', 'person'] as const;
const PROJECT_IDS = ['sigillo', 'credential', 'gialloro'] as const;

export default async function ProvePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('prove');

  return (
    <div className="pt-24">
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            {t('subtitle')}
          </p>
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)] mb-8">
            {t('title')}
          </h1>
        </div>
      </section>

      <section className="py-16 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="sr-only">{t('stats_title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {STAT_IDS.map((id) => (
              <div key={id} className="reveal text-center">
                <span className="block text-4xl md:text-5xl font-light font-mono text-[var(--accent)]">
                  {t(`stat_${id}_value`)}
                </span>
                <span className="text-sm text-[var(--text-muted)] uppercase tracking-wider mt-2 block">
                  {t(`stat_${id}_label`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-6 space-y-16">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)]">
            {t('projects_title')}
          </h2>
          {PROJECT_IDS.map((id) => (
            <div key={id} className="reveal border-l-2 border-[var(--accent)] pl-8">
              <h3 className="text-2xl font-[family-name:var(--font-display)] text-[var(--accent)] mb-2">
                {t(`proj_${id}_name`)}
              </h3>
              <p className="text-base text-[var(--text-secondary)] mb-6">{t(`proj_${id}_what`)}</p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[var(--text-muted)]">{t('label_hours')}</span>{' '}
                  <span className="text-[var(--text-primary)]">{t(`proj_${id}_hours`)}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">{t('label_code')}</span>{' '}
                  <span className="text-[var(--text-primary)]">{t(`proj_${id}_lines`)}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">{t('label_integrations')}</span>{' '}
                  <span className="text-[var(--text-primary)]">{t(`proj_${id}_integrations`)}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">{t('label_first_commit')}</span>{' '}
                  <span className="text-[var(--text-primary)]">{t(`proj_${id}_first_commit`)}</span>
                </div>
              </div>
              <p className="mt-6 text-sm text-[var(--text-secondary)] italic">{t(`proj_${id}_compare`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('methodology_title')}
          </h2>
          <div className="reveal space-y-4 text-base text-[var(--text-secondary)] leading-relaxed">
            <p>{t('methodology_p1')}</p>
            <p>{t('methodology_p2')}</p>
            <p>{t('methodology_p3')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
