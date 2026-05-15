/**
 * @package fabiocherici.com — Client Providers
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Wraps client-side context providers (theme + a11y)
 */

'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme-context';
import { A11yProvider } from '@/lib/a11y-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <A11yProvider>
        {children}
      </A11yProvider>
    </ThemeProvider>
  );
}
