/**
 * @package fabiocherici.com — Next.js Config
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Next.js 15 config — static export for S3+CloudFront, i18n via next-intl
 */

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Override opzionale della distDir via env: consente una build di verifica
  // senza invalidare la cache .next del dev server attivo. Default invariato.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
};

export default withNextIntl(nextConfig);
