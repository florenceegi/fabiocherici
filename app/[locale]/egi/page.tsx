/**
 * @package fabiocherici.com — EGI Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-18
 * @purpose EGI page — under construction placeholder. Links to /ecosistema for existing content.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('egi_title'),
    description: t('egi_description'),
    alternates: buildAlternates(locale, '/egi'),
    openGraph: { title: t('egi_title'), description: t('egi_description'), type: 'website', locale },
  };
}

export default async function EgiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 pt-24 text-center">
      <p className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
        {t('under_construction.subtitle')}
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-8">
        {/* P0-FC-4 exception: proper noun */}
        FlorenceEGI
      </h1>
      <p className="text-[var(--text-muted)] max-w-md mb-8 leading-relaxed">
        {t('under_construction.message')}
      </p>
      <div className="flex flex-col gap-3 items-center">
        <Link
          href={`/${locale}/ecosistema`}
          className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors underline underline-offset-4"
        >
          {t('under_construction.see_ecosystem')}
        </Link>
        <Link
          href={`/${locale}`}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors underline underline-offset-4"
        >
          {t('under_construction.back')}
        </Link>
      </div>
    </div>
  );
}
