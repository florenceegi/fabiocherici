/**
 * @package fabiocherici.com — Locale Layout
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.1.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Per-locale layout — owns <html lang> + <body>. Wraps providers, nav, footer. Static params for 7 locales.
 */

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { locales } from '@/lib/i18n/config';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/layout/Providers';
import { fontVariables } from '@/lib/fonts';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'meta' });

  return (
    <html lang={locale} suppressHydrationWarning className={fontVariables}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://fabiocherici.com/#website',
                  name: 'Fabio Cherici — Oracode',
                  url: 'https://fabiocherici.com',
                  description: t('home_description'),
                  inLanguage: ['it', 'en', 'de', 'es', 'fr', 'pt', 'zh'],
                },
                {
                  '@type': 'Person',
                  '@id': 'https://fabiocherici.com/#person',
                  name: 'Fabio Cherici',
                  url: 'https://fabiocherici.com',
                  jobTitle: 'CEO & Founder',
                  worksFor: {
                    '@type': 'Organization',
                    name: 'FlorenceEGI S.R.L.',
                    url: 'https://florenceegi.com',
                  },
                  knowsAbout: ['Software Architecture', 'Artificial Intelligence', 'Blockchain', 'Oracode'],
                  sameAs: [
                    'https://github.com/florenceegi',
                    'https://www.linkedin.com/in/fabio-cherici-22905954/',
                    'https://www.instagram.com/fabiocherici/',
                    'https://www.facebook.com/fabiochericiscrittore/',
                    'https://www.facebook.com/fabioWOWcherici/',
                    'https://www.amazon.it/s?k=Fabio+Cherici&i=stripbooks',
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text-primary)] antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navigation locale={locale} />
            <main id="main-content" className="min-h-screen">
              {children}
            </main>
            <Footer locale={locale} />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
