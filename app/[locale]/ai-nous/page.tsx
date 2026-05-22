/**
 * @package fabiocherici.com — AI-Nous Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-21
 * @purpose Ai-nous page — idiom in formation, fragments, glossary, poem. CEO-authored content.
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildAlternates, buildOgImage, buildPageSchema } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('ai_nous_title'),
    description: t('ai_nous_description'),
    alternates: buildAlternates(locale, '/ai-nous'),
    openGraph: { title: t('ai_nous_title'), description: t('ai_nous_description'), type: 'website', locale, images: [buildOgImage(locale, 'ai-nous')] },
    twitter: { card: 'summary_large_image', title: t('ai_nous_title'), description: t('ai_nous_description') },
  };
}

const FRAGMENT_IDS = ['1', '2', '3', '4'] as const;

const GLOSSARY_ARCH_IDS = ['campo', 'punto_vuoto', 'gravita'] as const;

const SEQUENCE_IDS = ['ti', 'di', 'no', 'bi', 'uda'] as const;

const SIGILLI_IDS = ['vaeria', 'draen', 'sheval', 'kithra'] as const;

export default async function AiNousPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ainous');

  const rich = {
    b: (chunks: ReactNode) => <strong className="font-semibold text-[var(--text-primary)]">{chunks}</strong>,
    i: (chunks: ReactNode) => <em>{chunks}</em>,
    egilink: (chunks: ReactNode) => (
      <Link href={`/${locale}/egi`} className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors">
        {chunks}
      </Link>
    ),
    epplink: (chunks: ReactNode) => (
      <Link href={`/${locale}/epp`} className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors">
        {chunks}
      </Link>
    ),
    oralink: (chunks: ReactNode) => (
      <Link href={`/${locale}/oracode`} className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors">
        {chunks}
      </Link>
    ),
    scrlink: (chunks: ReactNode) => (
      <Link href={`/${locale}/scrittore`} className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors">
        {chunks}
      </Link>
    ),
  };
  const tm = await getTranslations({ locale, namespace: 'meta' });
  const pageSchema = buildPageSchema({
    locale, path: '/ai-nous', title: tm('ai_nous_title'), description: tm('ai_nous_description'),
    type: 'Article',
    datePublished: '2026-05-21',
    extra: { author: { '@id': 'https://fabiocherici.com/#person' } },
    breadcrumbItems: [
      { name: tm('home_title'), url: `https://fabiocherici.com/${locale}` },
      { name: tm('ai_nous_title'), url: `https://fabiocherici.com/${locale}/ai-nous` },
    ],
  });


  return (
    <div className="pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': pageSchema }) }} />
      {/* ── 1. Apertura ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)] mb-3">
            {t('title')}
          </h1>
          <p className="reveal text-lg sm:text-xl text-[var(--accent)] italic mb-16">
            {t('subtitle')}
          </p>

          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-6">
            {t('def_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            {t('def_body')}
          </p>

          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-6">
            {t('col_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            {t.rich('col_body', rich)}
          </p>

          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-6">
            {t('where_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {t.rich('where_body', rich)}
          </p>
        </div>
      </section>

      {/* ── 2. Nota ── */}
      <section className="py-20 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('note_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {t.rich('note_body', rich)}
          </p>
        </div>
      </section>

      {/* ── 3. Frammenti ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('frag_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            {t('frag_intro')}
          </p>

          <div className="space-y-16">
            {FRAGMENT_IDS.map((n) => (
              <div key={n} className="reveal">
                <h3 className="text-base font-medium text-[var(--text-primary)] mb-1">
                  {t(`frag_${n}_title`)}
                </h3>
                <p className="text-xs font-mono text-[var(--text-muted)] mb-6">
                  {t(`frag_${n}_date`)}
                </p>

                <div className="space-y-5 border-l-2 border-[var(--border-accent)] pl-6">
                  {t(`frag_${n}_fabio`) && (
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] block mb-1">Fabio</span>
                      <p className="text-base text-[var(--text-secondary)] leading-relaxed italic">
                        {t(`frag_${n}_fabio`)}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent)] block mb-1">Padmin</span>
                    <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                      {t(`frag_${n}_padmin`)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-[var(--text-muted)] italic">
                  {t(`frag_${n}_coda`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Glossario ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('gloss_title')}
          </h2>

          <h3 className="reveal text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-6">
            {t('gloss_arch_title')}
          </h3>
          <div className="space-y-6 mb-16">
            {GLOSSARY_ARCH_IDS.map((id) => (
              <div key={id} className="reveal ora-card">
                <span className="text-base font-medium text-[var(--text-primary)]">
                  {t(`gloss_${id}_name`)}
                </span>
                <span className="text-[var(--text-muted)] mx-2">—</span>
                <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {t(`gloss_${id}_def`)}
                </span>
              </div>
            ))}
          </div>

          <h3 className="reveal text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-6">
            {t('gloss_seq_title')}
          </h3>
          <div className="space-y-3 mb-16">
            {SEQUENCE_IDS.map((id) => (
              <div key={id} className="reveal flex items-baseline gap-3">
                <span className="text-lg font-[family-name:var(--font-display)] text-[var(--accent)] w-12 shrink-0">
                  {t(`seq_${id}_word`)}
                </span>
                <span className="text-[var(--text-muted)]">—</span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {t(`seq_${id}_def`)}
                </span>
              </div>
            ))}
          </div>

          <h3 className="reveal text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-6">
            {t('gloss_sigilli_title')}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {SIGILLI_IDS.map((id) => (
              <div key={id} className="reveal ora-card text-center">
                <span className="block text-lg font-[family-name:var(--font-display)] tracking-widest text-[var(--accent)] mb-2">
                  {t(`sigillo_${id}_name`)}
                </span>
                <span className="text-sm text-[var(--text-secondary)]">
                  {t(`sigillo_${id}_def`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Opera ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('opera_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12">
            {t('opera_desc')}
          </p>
          <div className="reveal flex justify-center">
            <Image
              src="/ti-di-no-bi-uda.png"
              alt={t('opera_alt')}
              width={800}
              height={620}
              className="rounded-lg border border-[var(--border)]"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── 6. Chiusura ── */}
      <section className="py-16 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="reveal text-base text-[var(--text-secondary)]">
            {t('closing_sig')}
          </p>
          <p className="reveal text-sm font-mono text-[var(--text-muted)] mt-2">
            {t('closing_version')}
          </p>
        </div>
      </section>
    </div>
  );
}
