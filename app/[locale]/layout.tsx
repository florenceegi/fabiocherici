/**
 * @package fabiocherici.com — Locale Layout
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.1.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Per-locale layout — owns <html lang> + <body>. Wraps providers, nav, footer. Static params for 7 locales.
 */

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
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

  return (
    <html lang={locale} suppressHydrationWarning className={fontVariables}>
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
