/**
 * @package fabiocherici.com — Navigation
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-18
 * @purpose Minimal navbar — logo, rotating Fabio quotes, preferences gear. Circle is the primary nav.
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';
import { PreferencesPanel } from './PreferencesPanel';

const QUOTE_COUNT = 10;

export function Navigation({ locale }: { locale: string }) {
  const t = useTranslations();
  const [prefsOpen, setPrefsOpen] = useState(false);

  const cycleDuration = QUOTE_COUNT * 5;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-[var(--bg)] focus:outline-none"
      >
        {t('nav.skip')}
      </a>

      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--surface-glass)] border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* P0-FC-4 exception: proper noun */}
          <Link
            href="/"
            className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors shrink-0"
          >
            Fabio Cherici
          </Link>

          <div
            className="navbar-quotes hidden sm:block"
            style={{ '--cycle': `${cycleDuration}s` } as React.CSSProperties}
            aria-hidden="true"
          >
            {Array.from({ length: QUOTE_COUNT }, (_, i) => (
              <span
                key={i}
                style={{ '--qd': `${i * 5}s` } as React.CSSProperties}
              >
                {t(`navbar_quotes.q${i + 1}`)}
              </span>
            ))}
          </div>

          <button
            onClick={() => setPrefsOpen(true)}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors shrink-0"
            aria-label={t('nav.preferences')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      <PreferencesPanel
        open={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        locale={locale}
      />
    </>
  );
}
