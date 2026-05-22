import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Redirect',
    robots: { index: false, follow: false },
    other: { 'http-equiv': 'refresh', content: `0; url=/${locale}/i-numeri` },
  };
}

export default async function ProvePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-[var(--text-secondary)]">
        Redirect a <Link href={`/${locale}/i-numeri`} className="text-[var(--accent)] underline">/i-numeri</Link>
      </p>
    </div>
  );
}
