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
              alt="Sigillo"
              width={28}
              height={28}
              className="opacity-70"
            />
            <span>{t('protected_by_sigillo')}</span>
          </div>

          <nav aria-label={t('nav_label')} className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-secondary)]">
            <Link href="/oracode" className="hover:text-[var(--accent)] transition-colors">
              Oracode
            </Link>
            <Link href="/prove" className="hover:text-[var(--accent)] transition-colors">
              {t('prove')}
            </Link>
            <Link href="/ecosistema" className="hover:text-[var(--accent)] transition-colors">
              {t('ecosistema')}
            </Link>
            <Link href="/contatti" className="hover:text-[var(--accent)] transition-colors">
              {t('contact')}
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
          </nav>

          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {t('built_with')}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              © {year} Fabio Cherici. {t('rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
