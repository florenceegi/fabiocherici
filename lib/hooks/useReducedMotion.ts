/**
 * @package fabiocherici.com — useReducedMotion Hook
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-16
 * @purpose Resolves reduced-motion from a11y context + OS preference. 'on' forces true, 'off' forces false, 'system' defers to OS.
 */

'use client';

import { useState, useEffect } from 'react';
import { useA11y } from '@/lib/a11y-context';

export function useReducedMotion(): boolean {
  const { reducedMotion } = useA11y();
  const [osPrefersReduced, setOsPrefersReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setOsPrefersReduced(mql.matches);

    const handler = (e: MediaQueryListEvent) => setOsPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  if (reducedMotion === 'on') return true;
  if (reducedMotion === 'off') return false;
  return osPrefersReduced;
}
