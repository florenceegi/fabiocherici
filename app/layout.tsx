/**
 * @package fabiocherici.com — Root Layout
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.1.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Passthrough root — metadata only. <html lang> lives in [locale]/layout.tsx.
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Fabio Cherici — Oracode',
    template: '%s | Fabio Cherici',
  },
  description: 'Oracode: a formal methodology for governing software ecosystems where AI agents write production code.',
  metadataBase: new URL('https://fabiocherici.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
