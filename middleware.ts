/**
 * @package fabiocherici.com — Middleware
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose next-intl middleware for locale routing (7 locales). Runs at build time for static export.
 */

import createMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(it|en|fr|de|es|pt|zh)/:path*'],
};
