/**
 * @package fabiocherici.com — Privacy Policy
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-22
 * @purpose Privacy policy page — GDPR Art. 13/14 compliance. Static content, no data collection server-side.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('privacy_title'),
    description: t('privacy_title'),
    alternates: buildAlternates(locale, '/privacy'),
    openGraph: { title: t('privacy_title'), description: t('privacy_title'), type: 'website', locale },
    robots: { index: false, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');

  const SECTIONS = [
    'controller', 'data_collected', 'purpose', 'legal_basis',
    'storage', 'local_storage', 'third_party', 'rights', 'contact',
  ] as const;

  return (
    <div className="pt-24">
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="reveal font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-primary)] mb-4">
            {t('title')}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-12">
            {t('last_updated')}
          </p>

          <div className="space-y-10">
            {SECTIONS.map((id) => (
              <div key={id}>
                <h2 className="text-lg font-medium text-[var(--text-primary)] mb-3">
                  {t(`${id}_title`)}
                </h2>
                <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                  {t(`${id}_body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
