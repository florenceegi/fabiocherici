/**
 * @package fabiocherici.com — Navigation
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Top navigation bar — bronzo/grafite, 5 routes + preferences trigger + skip-to-content
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/routing';
import { PreferencesPanel } from './PreferencesPanel';

const NAV_ITEMS = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/oracode', labelKey: 'nav.oracode' },
  { href: '/prove', labelKey: 'nav.prove' },
  { href: '/ecosistema', labelKey: 'nav.ecosistema' },
  { href: '/contatti', labelKey: 'nav.contatti' },
] as const;

export function Navigation({ locale }: { locale: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-[var(--bg)] focus:outline-none"
      >
        {t('nav.skip')}
      </a>

      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--surface-glass)] border-b border-[var(--border)]">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
          aria-label={t('nav.main')}
        >
          <Link
            href="/"
            className="font-[var(--font-display)] text-lg font-semibold tracking-tight text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Fabio Cherici
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-sm transition-colors ${
                      isActive
                        ? 'text-[var(--accent)] font-medium'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={() => setPrefsOpen(true)}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                aria-label={t('nav.preferences')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </li>
          </ul>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={t('nav.menu')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              {mobileOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              ) : (
                <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md">
            <ul className="flex flex-col gap-1 px-6 py-4">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-2 text-sm ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}
                    >
                      {t(item.labelKey)}
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={() => { setPrefsOpen(true); setMobileOpen(false); }}
                  className="py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]"
                >
                  {t('nav.preferences')}
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>

      <PreferencesPanel
        open={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        locale={locale}
      />
    </>
  );
}
