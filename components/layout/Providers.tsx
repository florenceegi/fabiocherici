/**
 * @package fabiocherici.com — Client Providers
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Client-side context provider tree. Theme + A11y + Scene + Animation + ScrollReveal.
 */

'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme-context';
import { A11yProvider } from '@/lib/a11y-context';
import { SceneProvider } from '@/lib/scene-context';
import { AnimationProvider } from '@/lib/animation-context';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <A11yProvider>
        <SceneProvider>
          <AnimationProvider>
            <ScrollReveal />
            {children}
          </AnimationProvider>
        </SceneProvider>
      </A11yProvider>
    </ThemeProvider>
  );
}
