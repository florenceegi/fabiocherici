/**
 * @package fabiocherici.com — AI Transparency
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-20
 * @purpose AI Act Art. 50(1) transparency page — target of the canonical AiDisclosureBanner
 *          link (/{locale}/ai-transparency). Static, SSR, indexable. Declares Padmin's
 *          AI nature, that answers are grounded on project documents and may err, the
 *          models used (high level), advisory-only purpose, how to report a wrong answer,
 *          and the service owner. Server Component, semantic landmarks + aria-labelledby.
 * @mission M-FABIOCHERICI-001
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildAlternates, buildOgImage, buildPageSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('aitransparency_title'),
    description: t('aitransparency_description'),
    alternates: buildAlternates(locale, '/ai-transparency'),
    openGraph: { title: t('aitransparency_title'), description: t('aitransparency_description'), type: 'website', locale, images: [buildOgImage(locale, 'ai-transparency')] },
    twitter: { card: 'summary_large_image', title: t('aitransparency_title'), description: t('aitransparency_description') },
  };
}

const SECTIONS = ['models', 'advisory', 'report', 'contact'] as const;

export default async function AiTransparencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('aiTransparency');
  const tm = await getTranslations({ locale, namespace: 'meta' });

  const pageSchema = buildPageSchema({
    locale, path: '/ai-transparency', title: tm('aitransparency_title'), description: tm('aitransparency_description'),
    type: 'WebPage',
    breadcrumbItems: [
      { name: tm('home_title'), url: `https://fabiocherici.com/${locale}` },
      { name: tm('aitransparency_title'), url: `https://fabiocherici.com/${locale}/ai-transparency` },
    ],
  });

  return (
    <main className="pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': pageSchema }) }} />
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="reveal font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-primary)] mb-6">
            {t('title')}
          </h1>

          <section aria-labelledby="ait-intro" className="mb-12">
            <h2 id="ait-intro" className="sr-only">
              {t('title')}
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('intro')}
            </p>
          </section>

          <div className="space-y-10">
            {SECTIONS.map((id) => (
              <section key={id} aria-labelledby={`ait-${id}`}>
                <h2 id={`ait-${id}`} className="text-lg font-medium text-[var(--text-primary)] mb-3">
                  {t(`${id}Heading`)}
                </h2>
                <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                  {t(`${id}Body`)}
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
