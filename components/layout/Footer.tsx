/**
 * @package fabiocherici.com — Footer
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Minimal footer — copyright + FlorenceEGI link + Oracode badge
 */

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-[var(--text-muted)]">
            © {year} Fabio Cherici. {t('rights')}
          </div>

          <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
            <a
              href="https://florenceegi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              FlorenceEGI
            </a>
            <a
              href="https://github.com/florenceegi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              GitHub
            </a>
            <Link href="/contatti" className="hover:text-[var(--accent)] transition-colors">
              {t('contact')}
            </Link>
          </div>

          <div className="text-xs text-[var(--text-muted)] font-mono">
            {t('built_with')}
          </div>
        </div>
      </div>
    </footer>
  );
}
