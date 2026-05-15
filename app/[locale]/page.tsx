/**
 * @package fabiocherici.com — Homepage
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Homepage manifesto — Oracode paradigm, 5 blocks + hero + closing. The site IS the proof.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/home/HeroSection';
import { ProblemSection } from '@/components/home/ProblemSection';
import { WhatOracodeProduces } from '@/components/home/WhatOracodeProduces';
import { OrganismSection } from '@/components/home/OrganismSection';
import { ProofSection } from '@/components/home/ProofSection';
import { WhyProtocol } from '@/components/home/WhyProtocol';
import { ClosingSection } from '@/components/home/ClosingSection';

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

  return (
    <>
      <HeroSection />
      <ProblemSection />
      <WhatOracodeProduces />
      <OrganismSection />
      <ProofSection />
      <WhyProtocol />
      <ClosingSection />
    </>
  );
}
