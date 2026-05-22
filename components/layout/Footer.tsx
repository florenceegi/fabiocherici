/**
 * @package fabiocherici.com — Footer
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 3.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-18
 * @purpose Footer — Sigillo badge, internal page links (Oracode/Prove/Ecosistema/Contatti), external links, copyright.
 */

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            <Image
              src="/sigillo-logo.png"
              alt=""
              width={28}
              height={28}
              className="opacity-70"
              aria-hidden="true"
            />
            <span>{t('protected_by_sigillo')}</span>
          </div>

          <nav aria-label={t('nav_label')} className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-secondary)]">
            <Link href="/oracode" className="hover:text-[var(--accent)] transition-colors">
              Oracode
            </Link>
            <Link href="/i-numeri" className="hover:text-[var(--accent)] transition-colors">
              {t('numeri')}
            </Link>
            <Link href="/ecosistema" className="hover:text-[var(--accent)] transition-colors">
              {t('ecosistema')}
            </Link>
            <Link href="/contatti" className="hover:text-[var(--accent)] transition-colors">
              {t('contact')}
            </Link>
            <Link href="/privacy" className="hover:text-[var(--accent)] transition-colors">
              Privacy
            </Link>
            <span className="text-[var(--border)]" aria-hidden="true">|</span>
            {/* P0-FC-4 exception: proper nouns */}
            <a
              href="https://florenceegi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              FlorenceEGI
              <span className="sr-only"> ({t('opens_new_tab')})</span>
            </a>
            <a
              href="https://github.com/florenceegi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              GitHub
              <span className="sr-only"> ({t('opens_new_tab')})</span>
            </a>
            <span className="text-[var(--border)]" aria-hidden="true">|</span>
            <a
              href="https://www.amazon.it/s?k=Fabio+Cherici&i=stripbooks"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
              aria-label={`Amazon Books ${t('opens_new_tab')}`}
            >
              <span className="sr-only">Amazon Books</span>
              <svg className="inline-block h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.96 11.44c0 .63-.02 1.15-.07 1.58-.05.42-.14.78-.28 1.07-.14.29-.33.5-.57.65-.25.14-.56.22-.94.22-.33 0-.6-.07-.82-.2a1.4 1.4 0 0 1-.53-.56 2.5 2.5 0 0 1-.28-.86c-.05-.34-.08-.72-.08-1.13 0-.65.03-1.19.1-1.61.06-.42.16-.76.31-1.02.14-.26.33-.44.56-.55.23-.11.51-.17.84-.17.32 0 .58.07.79.2.2.14.37.33.49.59.12.25.2.56.25.93.05.36.07.78.07 1.26zm3.87 5.28c-.25.16-.62.3-1.1.43-.48.13-1 .19-1.55.19-.87 0-1.6-.14-2.2-.43a4.1 4.1 0 0 1-1.5-1.17 4.88 4.88 0 0 1-.86-1.72 7.54 7.54 0 0 1-.28-2.1c0-.78.1-1.48.32-2.1.21-.63.52-1.17.92-1.62.4-.45.88-.8 1.45-1.04.57-.24 1.21-.37 1.93-.37.56 0 1.07.06 1.53.17.47.12.84.27 1.12.46v8.4c0 .55-.04 1.04-.13 1.48a2.8 2.8 0 0 1-.48 1.12c-.23.31-.55.55-.96.72-.41.17-.93.25-1.57.25-.42 0-.83-.04-1.24-.11a6.8 6.8 0 0 1-1.12-.3 5.7 5.7 0 0 1-.97-.46l.9-1.63c.38.27.76.47 1.14.6.38.13.74.2 1.09.2.53 0 .9-.15 1.12-.44.22-.3.33-.75.33-1.37v-.56zM21.72 17.85c-.78.46-1.6.82-2.47 1.08a9.6 9.6 0 0 1-2.87.4c-1.07 0-2.04-.16-2.92-.49a6.4 6.4 0 0 1-2.24-1.4A6.27 6.27 0 0 1 9.8 15.4a7.78 7.78 0 0 1-.5-2.86c0-1.06.18-2.02.53-2.88a6.37 6.37 0 0 1 1.5-2.24A6.78 6.78 0 0 1 13.6 6a8.2 8.2 0 0 1 3-.53c.9 0 1.73.1 2.48.3.75.2 1.42.47 2 .83L20 8.42a7.3 7.3 0 0 0-1.54-.62 6.14 6.14 0 0 0-1.72-.24c-.68 0-1.28.12-1.8.37-.52.24-.96.58-1.31 1.01a4.56 4.56 0 0 0-.83 1.53 5.97 5.97 0 0 0-.29 1.9c0 1.42.37 2.54 1.1 3.37.74.82 1.76 1.24 3.08 1.24.58 0 1.12-.07 1.63-.2.5-.14.97-.34 1.4-.6v2.67z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/fabio-cherici-22905954/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
              aria-label={`LinkedIn ${t('opens_new_tab')}`}
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="inline-block h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/fabiocherici/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
              aria-label={`Instagram ${t('opens_new_tab')}`}
            >
              <span className="sr-only">Instagram</span>
              <svg className="inline-block h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/fabiochericiscrittore/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
              aria-label={`Facebook Scrittore ${t('opens_new_tab')}`}
            >
              <span className="sr-only">Facebook Scrittore</span>
              <svg className="inline-block h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/fabioWOWcherici/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
              aria-label={`Facebook FlorenceEGI ${t('opens_new_tab')}`}
            >
              <span className="sr-only">Facebook FlorenceEGI</span>
              <svg className="inline-block h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </nav>

          <div className="flex flex-col items-center gap-4" role="region" aria-label={t('quality_aria')}>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
              {t('quality_label')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <a
                href="https://www.ssllabs.com/ssltest/analyze.html?d=fabiocherici.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent-muted)] transition-colors"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                SSL A+<span className="sr-only">, {t('opens_new_tab')}</span>
              </a>
              <a
                href="https://securityheaders.com/?q=https%3A%2F%2Ffabiocherici.com&followRedirects=on"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent-muted)] transition-colors"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Security A+<span className="sr-only">, {t('opens_new_tab')}</span>
              </a>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-mono text-[var(--text-muted)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                WCAG AA
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-mono text-[var(--text-muted)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                GDPR
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 text-[11px] font-mono text-[var(--text-muted)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                {t('zero_tracking')}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {t('built_with')}
            </p>
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <Image
                src="/sigillo-logo.png"
                alt=""
                width={14}
                height={14}
                className="opacity-50"
                aria-hidden="true"
              />
              {year} Fabio Cherici. {t('rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
