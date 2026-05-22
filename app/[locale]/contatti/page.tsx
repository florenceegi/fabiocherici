/**
 * @package fabiocherici.com — Contact Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 3.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Contact page — server component with generateMetadata, delegates form to ContactForm client component.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/contact/ContactForm';
import { buildAlternates, buildPageSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('contatti_title'),
    description: t('contatti_description'),
    alternates: buildAlternates(locale, '/contatti'),
    openGraph: { title: t('contatti_title'), description: t('contatti_description'), type: 'website', locale },
  };
}

export default async function ContattiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contatti');
  const tm = await getTranslations({ locale, namespace: 'meta' });
  const pageSchema = buildPageSchema({
    locale, path: '/contatti', title: tm('contatti_title'), description: tm('contatti_description'),
    type: 'ContactPage',
    breadcrumbItems: [
      { name: tm('home_title'), url: `https://fabiocherici.com/${locale}` },
      { name: tm('contatti_title'), url: `https://fabiocherici.com/${locale}/contatti` },
    ],
  });


  return (
    <div className="pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': pageSchema }) }} />
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-xl px-6">
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            {t('subtitle')}
          </p>
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-12">
            {t('title')}
          </h1>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
