/**
 * @package fabiocherici.com — EPP Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 3.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-28
 * @purpose EPP page — Environment Protection Programs, 14 sections with 6 inline accordion widgets (Ragion d'essere + APR/ARF/BPE + fiscalita individuali/aziende).
 * @mission M-009
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildAlternates, buildOgImage, buildPageSchema, buildFaqSchema, buildItemListSchema } from '@/lib/seo';
import { EppAccordion } from '@/components/ui/EppAccordion';
import { Heart, Waves, Trees, Bee, FileText, Building2, Sprout, Briefcase } from '@/components/ui/EppIcons';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('epp_title'),
    description: t('epp_description'),
    alternates: buildAlternates(locale, '/epp'),
    openGraph: { title: t('epp_title'), description: t('epp_description'), type: 'website', locale, images: [buildOgImage(locale, 'epp')] },
    twitter: { card: 'summary_large_image', title: t('epp_title'), description: t('epp_description') },
  };
}

const linkClass = 'text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4 transition-colors';

export default async function EppPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('epp');
  const tw = await getTranslations('epp.widgets');
  const tm = await getTranslations({ locale, namespace: 'meta' });

  const pageSchemas = buildPageSchema({
    locale, path: '/epp', title: tm('epp_title'), description: tm('epp_description'),
    type: 'WebPage',
    breadcrumbItems: [
      { name: tm('home_title'), url: `https://fabiocherici.com/${locale}` },
      { name: tm('epp_title'), url: `https://fabiocherici.com/${locale}/epp` },
    ],
  });

  // D6 — FAQPage schema (2 fiscal widgets)
  const faqSchema = buildFaqSchema([
    { question: tw('fiscalita_individuale.title'), answer: tw('fiscalita_individuale.you_p1') + ' ' + tw('fiscalita_individuale.you_p2') },
    { question: tw('fiscalita_aziende.title'),     answer: tw('fiscalita_aziende.intro_body') },
  ]);

  // D6 — ItemList schema (3 programmi)
  const programsSchema = buildItemListSchema(tw('programs_section_title'), [
    { name: `APR — ${tw('apr.subtitle')}`, description: tw('apr.what_body') },
    { name: `ARF — ${tw('arf.subtitle')}`, description: tw('arf.what_body') },
    { name: `BPE — ${tw('bpe.subtitle')}`, description: tw('bpe.what_body') },
  ]);

  const jsonLd = { '@context': 'https://schema.org', '@graph': [...pageSchemas, faqSchema, programsSchema] };

  const rich = {
    b: (chunks: ReactNode) => <strong className="font-semibold text-[var(--text-primary)]">{chunks}</strong>,
    contactlink: (chunks: ReactNode) => (
      <Link href={`/${locale}/contatti`} className={linkClass}>{chunks}</Link>
    ),
    platformlink: (chunks: ReactNode) => (
      <a href="https://art.florenceegi.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
        {chunks}<span className="sr-only">, opens in new tab</span>
      </a>
    ),
  };

  const disclaimerIndividuale = tw('fiscalita_individuale.disclaimer');
  const disclaimerAziende     = tw('fiscalita_aziende.disclaimer');

  return (
    <div className="pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── 1. Hero ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <p className="reveal text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            {t('subtitle')}
          </p>
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)] mb-8">
            {t('title')}
          </h1>
          <p className="reveal text-xl sm:text-2xl text-[var(--text-primary)] leading-relaxed font-medium mb-8">
            {t('hero_claim')}
          </p>
          <div className="space-y-6">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('hero_p1')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('hero_p2')}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Widget — Ragion d'essere ── */}
      <section className="py-16 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-6">
          <EppAccordion
            id="widget-ragione-essere"
            badge={tw('ragione_essere.badge')}
            title={tw('ragione_essere.title')}
            icon={<Heart />}
          >
            <p>{tw('ragione_essere.body_p1')}</p>
            <p>{tw('ragione_essere.body_p2')}</p>
            <p>{tw('ragione_essere.body_p3')}</p>
            <p>{tw('ragione_essere.body_p4')}</p>
            <p>{tw('ragione_essere.body_p5')}</p>
            <p className="font-medium text-[var(--text-primary)]">{tw('ragione_essere.body_p6')}</p>
          </EppAccordion>
        </div>
      </section>

      {/* ── 3. Split — Donut Chart ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-16">
            {t('split_title')}
          </h2>
          <div className="reveal relative mx-auto max-w-2xl">
            <Image
              src={`/images/epp/${locale}/01.png`}
              alt={t('split_alt')}
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── 4. Flow — Non-Custodial ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            {t('flow_title')}
          </h2>
          <div className="space-y-6 mb-16">
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('flow_p1')}
            </p>
            <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('flow_p2')}
            </p>
          </div>
          <div className="reveal relative mx-auto max-w-3xl">
            <Image
              src={`/images/epp/${locale}/02.png`}
              alt={t('flow_alt')}
              width={1400}
              height={700}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ── 5. What EPP is NOT ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('not_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            {t('not_intro')}
          </p>
          <div className="reveal relative mx-auto max-w-3xl">
            <Image
              src={`/images/epp/${locale}/04.png`}
              alt={t('not_alt')}
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ── 6. Triple Guarantee ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('guarantee_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            {t('guarantee_intro')}
          </p>
          <div className="reveal relative mx-auto max-w-sm sm:max-w-md">
            <Image
              src={`/images/epp/${locale}/03.png`}
              alt={t('guarantee_alt')}
              width={900}
              height={1100}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* ── 7. Virtuous Cycle ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-16">
            {t('cycle_title')}
          </h2>
          <div className="reveal relative mx-auto max-w-lg sm:max-w-xl">
            <Image
              src={`/images/epp/${locale}/05.png`}
              alt={t('cycle_alt')}
              width={1100}
              height={1100}
              className="w-full h-auto"
            />
          </div>
          <p className="reveal mt-8 text-center text-base sm:text-lg text-[var(--text-secondary)] italic">
            {t('cycle_caption')}
          </p>
        </div>
      </section>

      {/* ── 8-10. Wrapper "I tre programmi" — APR + ARF + BPE widget ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {tw('programs_section_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12">
            {tw('programs_section_intro')}
          </p>
          <div className="space-y-4">
            <EppAccordion
              id="widget-apr"
              badge={tw('apr.badge')}
              title={tw('apr.title')}
              subtitle={tw('apr.subtitle')}
              icon={<Waves />}
            >
              <h4 className="font-medium text-[var(--text-primary)]">{tw('apr.what_title')}</h4>
              <p>{tw('apr.what_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('apr.why_title')}</h4>
              <p>{tw('apr.why_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('apr.continent_title')}</h4>
              <p>{tw('apr.continent_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('apr.micro_title')}</h4>
              <p>{tw('apr.micro_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('apr.impact_title')}</h4>
              <p>{tw('apr.impact_body')}</p>
              <p className="pt-2 text-sm border-t border-[var(--border)]">
                <strong className="text-[var(--text-primary)]">{tw('apr.status_label')}:</strong> {tw('apr.status_text')}
              </p>
            </EppAccordion>

            <EppAccordion
              id="widget-arf"
              badge={tw('arf.badge')}
              title={tw('arf.title')}
              subtitle={tw('arf.subtitle')}
              icon={<Trees />}
            >
              <h4 className="font-medium text-[var(--text-primary)]">{tw('arf.what_title')}</h4>
              <p>{tw('arf.what_body')}</p>
              <p>{tw('arf.scope_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('arf.why_title')}</h4>
              <p>{tw('arf.why_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('arf.where_title')}</h4>
              <p>{tw('arf.where_p1')}</p>
              <p>{tw('arf.where_p2')}</p>
              <p>{tw('arf.where_p3')}</p>
              <p>{tw('arf.where_p4')}</p>
              <p className="pt-2 text-sm border-t border-[var(--border)]">
                <strong className="text-[var(--text-primary)]">{tw('arf.status_label')}:</strong> {tw('arf.status_text')}
              </p>
            </EppAccordion>

            <EppAccordion
              id="widget-bpe"
              badge={tw('bpe.badge')}
              title={tw('bpe.title')}
              subtitle={tw('bpe.subtitle')}
              icon={<Bee />}
            >
              <h4 className="font-medium text-[var(--text-primary)]">{tw('bpe.what_title')}</h4>
              <p>{tw('bpe.what_body')}</p>
              <p>{tw('bpe.name_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('bpe.why_title')}</h4>
              <p>{tw('bpe.why_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('bpe.depend_title')}</h4>
              <p>{tw('bpe.depend_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('bpe.causes_title')}</h4>
              <p>{tw('bpe.causes_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('bpe.impact_title')}</h4>
              <p>{tw('bpe.impact_body')}</p>
              <p className="pt-2 text-sm border-t border-[var(--border)]">
                <strong className="text-[var(--text-primary)]">{tw('bpe.status_label')}:</strong> {tw('bpe.status_text')}
              </p>
            </EppAccordion>
          </div>
        </div>
      </section>

      {/* ── 11. Partner Dashboard ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {t('dashboard_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-16">
            {t('dashboard_intro')}
          </p>
          <div className="reveal relative mx-auto max-w-3xl">
            <Image
              src={`/images/epp/${locale}/06.png`}
              alt={t('dashboard_alt')}
              width={1200}
              height={900}
              className="w-full h-auto"
            />
          </div>
          <p className="reveal mt-8 text-center">
            <a
              href="https://art.florenceegi.com/epp-projects"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {t('dashboard_link')}<span className="sr-only">, opens in new tab</span>
            </a>
          </p>
        </div>
      </section>

      {/* ── 12-13. Wrapper "Fiscalità" — individuale + aziende widget ── */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {tw('fiscal_section_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12">
            {tw('fiscal_section_intro')}
          </p>
          <div className="space-y-4">
            <EppAccordion
              id="widget-fiscal-individual"
              badge={tw('fiscalita_individuale.badge')}
              title={tw('fiscalita_individuale.title')}
              subtitle={tw('fiscalita_individuale.subtitle')}
              icon={<FileText />}
            >
              {disclaimerIndividuale && (
                <p className="italic text-sm text-[var(--text-muted)] border-l-2 border-[var(--accent)] pl-3">
                  {disclaimerIndividuale}
                </p>
              )}
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_individuale.you_title')}</h4>
              <p>{tw('fiscalita_individuale.you_p1')}</p>
              <p>{tw('fiscalita_individuale.you_p2')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_individuale.practice_title')}</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>{tw('fiscalita_individuale.practice_item1')}</li>
                <li>{tw('fiscalita_individuale.practice_item2')}</li>
                <li>{tw('fiscalita_individuale.practice_item3')}</li>
              </ul>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_individuale.receipt_title')}</h4>
              <p>{tw('fiscalita_individuale.receipt_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_individuale.not_title')}</h4>
              <p>{tw('fiscalita_individuale.not_p1')}</p>
              <p>{tw('fiscalita_individuale.not_p2')}</p>
            </EppAccordion>

            <EppAccordion
              id="widget-fiscal-business"
              badge={tw('fiscalita_aziende.badge')}
              title={tw('fiscalita_aziende.title')}
              subtitle={tw('fiscalita_aziende.subtitle')}
              icon={<Building2 />}
            >
              {disclaimerAziende && (
                <p className="italic text-sm text-[var(--text-muted)] border-l-2 border-[var(--accent)] pl-3">
                  {disclaimerAziende}
                </p>
              )}
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_aziende.intro_title')}</h4>
              <p>{tw('fiscalita_aziende.intro_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_aziende.vat_title')}</h4>
              <p>{tw('fiscalita_aziende.vat_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_aziende.books_title')}</h4>
              <p>{tw('fiscalita_aziende.books_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_aziende.docs_title')}</h4>
              <p>{tw('fiscalita_aziende.docs_intro')}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{tw('fiscalita_aziende.docs_item1')}</li>
                <li>{tw('fiscalita_aziende.docs_item2')}</li>
                <li>{tw('fiscalita_aziende.docs_item3')}</li>
                <li>{tw('fiscalita_aziende.docs_item4')}</li>
              </ul>
              <p>{tw('fiscalita_aziende.docs_outro')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_aziende.not_title')}</h4>
              <p>{tw('fiscalita_aziende.not_p1')}</p>
              <p>{tw('fiscalita_aziende.not_p2')}</p>
            </EppAccordion>
          </div>
        </div>
      </section>

      {/* ── 14. Fiscalità lato EPP — 2 widget (no-profit + grande ente) ── */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <p className="reveal text-sm font-mono uppercase tracking-widest text-[var(--accent)] mb-4">
            {tw('fiscalita_epp.section_badge')}
          </p>
          <h2 className="reveal font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-light text-[var(--text-primary)] mb-3">
            {tw('fiscalita_epp.section_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] italic mb-8">
            {tw('fiscalita_epp.section_subtitle')}
          </p>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12">
            {tw('fiscalita_epp.section_intro')}
          </p>
          <div className="space-y-4">
            <EppAccordion
              id="widget-epp-noprofit"
              badge={tw('fiscalita_epp.noprofit.badge')}
              title={tw('fiscalita_epp.noprofit.title')}
              subtitle={tw('fiscalita_epp.noprofit.subtitle')}
              icon={<Sprout />}
            >
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_epp.noprofit.how_title')}</h4>
              <ul className="list-disc pl-5 space-y-1">
                {(tw.raw('fiscalita_epp.noprofit.how_items') as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_epp.noprofit.example_title')}</h4>
              <p>{tw('fiscalita_epp.noprofit.example_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_epp.noprofit.sources_title')}</h4>
              <p className="text-sm">{tw('fiscalita_epp.noprofit.sources_body')}</p>
            </EppAccordion>

            <EppAccordion
              id="widget-epp-azienda"
              badge={tw('fiscalita_epp.azienda.badge')}
              title={tw('fiscalita_epp.azienda.title')}
              subtitle={tw('fiscalita_epp.azienda.subtitle')}
              icon={<Briefcase />}
            >
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_epp.azienda.how_title')}</h4>
              <ul className="list-disc pl-5 space-y-1">
                {(tw.raw('fiscalita_epp.azienda.how_items') as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_epp.azienda.principle_title')}</h4>
              <p>{tw('fiscalita_epp.azienda.principle_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_epp.azienda.example_title')}</h4>
              <p>{tw('fiscalita_epp.azienda.example_body')}</p>
              <h4 className="font-medium text-[var(--text-primary)]">{tw('fiscalita_epp.azienda.sources_title')}</h4>
              <p className="text-sm">{tw('fiscalita_epp.azienda.sources_body')}</p>
            </EppAccordion>
          </div>
          <p className="reveal mt-12 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed italic">
            {tw('fiscalita_epp.section_outro')}
          </p>
        </div>
      </section>

      {/* ── 15. CTA ── */}
      <section className="py-20 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            {t('cta_title')}
          </h2>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
            {t('cta_p1')}
          </p>
          <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-12">
            {t.rich('cta_p2', rich)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://art.florenceegi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors font-medium"
            >
              {t('cta_platform')}<span className="sr-only">, opens in new tab</span>
            </a>
            <Link
              href={`/${locale}/contatti`}
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors font-medium"
            >
              {t('cta_contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
