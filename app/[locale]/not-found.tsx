/**
 * @package fabiocherici.com — 404 Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose 404 not found — branded, minimal
 */

import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';

export default function NotFound() {
  const t = useTranslations('not_found');

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-8xl font-light font-mono text-[var(--accent)] mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-[var(--text-secondary)] mb-8">
          {t('message')}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-8 py-3 text-sm text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all"
        >
          {t('back')}
        </Link>
      </div>
    </div>
  );
}
