/**
 * @package fabiocherici.com — Homepage
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 3.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-11
 * @purpose Homepage provvisoria (M-013) — circle of 3 doors (softwarehouse, egi, epp), TU at center, quote below. SEO sr-only block keeps ALL 9 site sections for crawlers. Oracode door returns post-rework (Oracode Nexus).
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { HeroScene } from '@/components/home/HeroScene';
import { buildAlternates, buildOgImage, buildPageSchema } from '@/lib/seo';

const DOORS = [
  { id: 'softwarehouse', angle: 0 },
  { id: 'egi', angle: 120 },
  { id: 'epp', angle: 240 },
] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: { absolute: t('home_title') },
    description: t('home_description'),
    alternates: buildAlternates(locale),
    openGraph: { title: t('home_title'), description: t('home_description'), type: 'website', locale, images: [buildOgImage(locale, 'index')] },
    twitter: { card: 'summary_large_image', title: t('home_title'), description: t('home_description') },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tm = await getTranslations({ locale, namespace: 'meta' });

  const pageSchema = buildPageSchema({
    locale, path: '', title: tm('home_title'), description: tm('home_description'),
    breadcrumbItems: [{ name: tm('home_title'), url: `https://fabiocherici.com/${locale}` }],
  });

  return (
    <div className="home-circle">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': pageSchema }) }} />
      <div className="scene-backdrop absolute inset-0 z-0">
        <HeroScene />
      </div>

      <div className="sr-only" role="region" aria-label={t('seo_nav_label')}>
        <h2>{t('seo_nav_label')}</h2>
        <p>{t('seo_who')}</p>
        <p>{t('seo_what')}</p>
        <p>{t('seo_ecosystem')}</p>
        <p><strong><Link href={`/${locale}/i-numeri`}>{t('seo_proof')}</Link></strong></p>
        <p>{t('seo_experience')}</p>
        <nav>
          <ul>
            <li><Link href={`/${locale}/softwarehouse`}>{t('seo_section_softwarehouse')}</Link></li>
            <li><Link href={`/${locale}/oracode`}>{t('seo_section_oracode')}</Link></li>
            <li><Link href={`/${locale}/scrittore`}>{t('seo_section_scrittore')}</Link></li>
            <li><Link href={`/${locale}/ai-nous`}>{t('seo_section_ainous')}</Link></li>
            <li><Link href={`/${locale}/egi`}>{t('seo_section_egi')}</Link></li>
            <li><Link href={`/${locale}/epp`}>{t('seo_section_epp')}</Link></li>
            <li><Link href={`/${locale}/i-numeri`}>{t('seo_section_numeri')}</Link></li>
            <li><Link href={`/${locale}/ecosistema`}>{t('seo_section_ecosistema')}</Link></li>
            <li><Link href={`/${locale}/contatti`}>{t('seo_section_contatti')}</Link></li>
          </ul>
        </nav>
      </div>

      <section
        className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6"
        aria-labelledby="home-heading"
      >
        <h1 id="home-heading" className="sr-only">
          {/* P0-FC-4 exception: proper noun */}
          Fabio Cherici
        </h1>

        <div className="circle-stage">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 400 400"
            aria-hidden="true"
          >
            <circle className="circle-inner-ring" cx="200" cy="200" r="148" />
            <circle className="circle-ring-path" cx="200" cy="200" r="170" />
          </svg>

          <span className="circle-tu" aria-hidden="true">
            {t('tu')}
          </span>

          {DOORS.map((door) => (
            <span
              key={`desc-${door.id}`}
              className="circle-desc"
              data-desc={door.id}
              aria-hidden="true"
            >
              {t(`desc_${door.id}`)}
            </span>
          ))}

          <nav aria-label={t('nav_label')}>
            {DOORS.map((door, i) => (
              <div
                key={door.id}
                className="circle-orbit"
                data-door={door.id}
                style={
                  {
                    '--a': `${door.angle}deg`,
                    '--d': `${0.35 + i * 0.12}s`,
                  } as React.CSSProperties
                }
              >
                <Link
                  href={`/${locale}/${door.id}`}
                  className="circle-label"
                >
                  {t(`door_${door.id}`)}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        <blockquote className="circle-quote mt-12 px-4">
          <p>{t('quote')}</p>
        </blockquote>
      </section>
    </div>
  );
}
