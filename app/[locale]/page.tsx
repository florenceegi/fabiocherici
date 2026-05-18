/**
 * @package fabiocherici.com — Homepage
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-18
 * @purpose Homepage — single screen, circle of 6 doors, TU at center, quote below. CSS-only entrance animation, 3D scene as ambient backdrop.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { HeroScene } from '@/components/home/HeroScene';

const DOORS = [
  { id: 'ceo', angle: 0 },
  { id: 'oracode', angle: 60 },
  { id: 'scrittore', angle: 120 },
  { id: 'orisphaera', angle: 180 },
  { id: 'egi', angle: 240 },
  { id: 'epp', angle: 300 },
] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: { absolute: t('home_title') },
    description: t('home_description'),
    openGraph: { title: t('home_title'), description: t('home_description'), type: 'website', locale },
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

  return (
    <div className="home-circle">
      <div className="scene-backdrop absolute inset-0 z-0">
        <HeroScene />
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
