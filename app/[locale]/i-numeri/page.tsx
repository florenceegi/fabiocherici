/**
 * @package fabiocherici.com — I Numeri Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-21
 * @purpose Public numbers page — archive posture, data from PLATFORM_NUMBERS.md v2.2.0. Landing for verify spies.
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildAlternates, buildOgImage, buildPageSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('numeri_title'),
    description: t('numeri_description'),
    alternates: buildAlternates(locale, '/i-numeri'),
    openGraph: { title: t('numeri_title'), description: t('numeri_description'), type: 'website', locale, images: [buildOgImage(locale, 'i-numeri')] },
    twitter: { card: 'summary_large_image', title: t('numeri_title'), description: t('numeri_description') },
  };
}

const STAT_IDS = ['loc', 'exnovo', 'scope', 'hours', 'governance'] as const;

const PRODUCT_IDS = ['idealoro', 'bizcard', 'creator', 'sigillo', 'credential'] as const;

const PRODUCT_META: Record<typeof PRODUCT_IDS[number], { site?: string; repo?: string }> = {
  idealoro: { site: 'https://preview.florenceegi.com', repo: 'https://github.com/florenceegi/IDEALORO-PREVIEW' },
  bizcard: { site: 'https://egi-credential.florenceegi.com/business-card' },
  creator: { site: 'https://creator-staging.florenceegi.com', repo: 'https://github.com/florenceegi/creator-staging' },
  sigillo: { site: 'https://egi-sigillo.florenceegi.com' },
  credential: { site: 'https://egi-credential.florenceegi.com' },
};

const ORGAN_IDS = [
  'egi', 'natan', 'hub', 'info', 'home', 'credential',
  'bottega', 'sigillo', 'stat', 'creator', 'gialloro',
  'gialloro_cms', 'fabio', 'yuri',
] as const;

const ORGAN_META: Partial<Record<typeof ORGAN_IDS[number], { site?: string; repo?: string }>> = {
  egi: { site: 'https://art.florenceegi.com' },
  natan: { site: 'https://natan-loc.florenceegi.com' },
  hub: { site: 'https://hub.florenceegi.com' },
  info: { site: 'https://info.florenceegi.com', repo: 'https://github.com/florenceegi/EGI-INFO' },
  home: { site: 'https://florenceegi.com', repo: 'https://github.com/florenceegi/EGI-HUB-HOME-REACT' },
  credential: { site: 'https://egi-credential.florenceegi.com' },
  sigillo: { site: 'https://egi-sigillo.florenceegi.com' },
  creator: { site: 'https://creator-staging.florenceegi.com', repo: 'https://github.com/florenceegi/creator-staging' },
  gialloro: { site: 'https://preview.florenceegi.com', repo: 'https://github.com/florenceegi/IDEALORO-PREVIEW' },
};

export default async function NumeriPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('numeri');

  const rich = {
    b: (chunks: ReactNode) => <strong className="font-semibold text-[var(--text-primary)]">{chunks}</strong>,
  };

  const tm = await getTranslations({ locale, namespace: 'meta' });
  const pageSchema = buildPageSchema({
    locale, path: '/i-numeri', title: tm('numeri_title'), description: tm('numeri_description'),
    type: 'WebPage',
    breadcrumbItems: [
      { name: tm('home_title'), url: `https://fabiocherici.com/${locale}` },
      { name: tm('numeri_title'), url: `https://fabiocherici.com/${locale}/i-numeri` },
    ],
  });

  return (
    <div className="pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': pageSchema }) }} />
      {/* ── Fascia 1 — Apertura ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)] mb-8">
            {t('title')}
          </h1>
          <div className="space-y-4">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('intro_p1')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('intro_p2')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('intro_p3')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Fascia 2 — I numeri di sistema ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-16">
            {t('system_title')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {STAT_IDS.map((id) => (
              <div key={id} className="reveal ora-card flex flex-col">
                <span className="block text-4xl md:text-5xl font-light font-mono text-[var(--accent)] mb-3 leading-none">
                  {t(`stat_${id}_value`)}
                </span>
                <span className="text-base text-[var(--text-primary)] font-medium mb-2">
                  {t(`stat_${id}_label`)}
                </span>
                <span className="text-sm text-[var(--text-muted)] leading-relaxed mt-auto">
                  {t(`stat_${id}_condition`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fascia 3 — I cinque prodotti ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('products_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-4">
            {t('products_intro')}
          </p>
          <p className="reveal text-sm text-[var(--text-muted)] leading-relaxed mb-16 italic">
            {t('products_note')}
          </p>
          <div className="space-y-8">
            {PRODUCT_IDS.map((id) => {
              const meta = PRODUCT_META[id];
              return (
                <div key={id} className="reveal ora-card">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                    <h3 className="text-xl font-[family-name:var(--font-display)] text-[var(--accent)]">
                      {t(`prod_${id}_name`)}
                    </h3>
                    {meta.site && (
                      <a
                        href={meta.site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                      >
                        {meta.site.replace('https://', '')} ↗<span className="sr-only">, opens in new tab</span>
                      </a>
                    )}
                    {meta.repo && (
                      <a
                        href={meta.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                      >
                        GitHub ↗<span className="sr-only">, opens in new tab</span>
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-5">
                    {t(`prod_${id}_what`)}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="block text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">
                        {t('label_hours')}
                      </span>
                      <span className="text-[var(--text-primary)] font-mono">
                        {t(`prod_${id}_hours`)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">
                        {t('label_loc')}
                      </span>
                      <span className="text-[var(--text-primary)] font-mono">
                        {t(`prod_${id}_loc`)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">
                        {t('label_commits')}
                      </span>
                      <span className="text-[var(--text-primary)] font-mono">
                        {t(`prod_${id}_commits`)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[var(--text-muted)] text-xs uppercase tracking-wider mb-1">
                        {t('label_calendar')}
                      </span>
                      <span className="text-[var(--text-primary)] font-mono">
                        {t(`prod_${id}_calendar`)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Fascia 4 — Codebase per organo ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('codebase_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-4">
            {t('codebase_intro')}
          </p>
          <p className="reveal text-sm text-[var(--text-muted)] leading-relaxed mb-12 italic">
            {t('codebase_note')}
          </p>
          <div className="reveal overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">{t('codebase_intro')}</caption>
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th scope="col" className="text-left py-3 pr-4 text-[var(--text-muted)] font-mono text-xs uppercase tracking-wider">
                    {t('table_organ')}
                  </th>
                  <th scope="col" className="text-right py-3 px-4 text-[var(--text-muted)] font-mono text-xs uppercase tracking-wider">
                    {t('table_code')}
                  </th>
                  <th scope="col" className="text-right py-3 pl-4 text-[var(--text-muted)] font-mono text-xs uppercase tracking-wider">
                    {t('table_files')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {ORGAN_IDS.map((id) => {
                  const meta = ORGAN_META[id];
                  return (
                    <tr key={id} className="border-b border-[var(--border)]/50">
                      <td className="py-2.5 pr-4 text-[var(--text-primary)]">
                        {t(`organ_${id}_name`)}
                        {meta?.site && (
                          <a
                            href={meta.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                          >
                            {meta.site.replace('https://', '')} ↗<span className="sr-only">, opens in new tab</span>
                          </a>
                        )}
                        {meta?.repo && (
                          <a
                            href={meta.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                          >
                            GitHub ↗<span className="sr-only">, opens in new tab</span>
                          </a>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-[var(--text-secondary)]">
                        {t(`organ_${id}_code`)}
                      </td>
                      <td className="py-2.5 pl-4 text-right font-mono text-[var(--text-secondary)]">
                        {t(`organ_${id}_files`)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[var(--accent-muted)]">
                  <td className="py-3 pr-4 font-semibold text-[var(--text-primary)]">
                    {t('table_total')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-[var(--accent)]">
                    {t('table_total_code')}
                  </td>
                  <td className="py-3 pl-4 text-right font-mono font-semibold text-[var(--accent)]">
                    {t('table_total_files')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* ── Fascia 5 — Chiusura ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('closing_title')}
          </h2>
          <div className="space-y-4">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t.rich('closing_p1', rich)}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('closing_p2')}
            </p>
          </div>
          <p className="reveal mt-12 text-xs text-[var(--text-muted)] font-mono">
            {t('closing_source')}
          </p>
        </div>
      </section>
    </div>
  );
}
