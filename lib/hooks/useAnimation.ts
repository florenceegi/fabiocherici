/**
 * @package fabiocherici.com — useAnimation Hook
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Client-side animation preset detection + GSAP config presets. Ported from CREATOR-STAGING.
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import { getStoredAnimation, type AnimationId } from '@/lib/animation';

export type AnimationPreset = {
  id: AnimationId;
  hero: { from: Record<string, unknown>; to: Record<string, unknown> };
  scrollReveal: { from: Record<string, unknown>; to: Record<string, unknown>; stagger: number; triggerStart: string };
  pageTransition: { from: Record<string, unknown>; to: Record<string, unknown> };
  hoverScale: number;
  easing: string;
  speed: number;
};

const PRESETS: Record<AnimationId, AnimationPreset> = {
  minimal: {
    id: 'minimal',
    hero: { from: { opacity: 0 }, to: { opacity: 1, duration: 0.8, ease: 'power1.out' } },
    scrollReveal: { from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0, duration: 0.6, ease: 'power1.out' }, stagger: 0.08, triggerStart: 'top 85%' },
    pageTransition: { from: { opacity: 0 }, to: { opacity: 1, duration: 0.4, ease: 'power1.out' } },
    hoverScale: 1.02,
    easing: 'power1.out',
    speed: 1,
  },
  cinematic: {
    id: 'cinematic',
    hero: { from: { opacity: 0, y: 40, scale: 0.97 }, to: { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out' } },
    scrollReveal: { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, stagger: 0.12, triggerStart: 'top 80%' },
    pageTransition: { from: { opacity: 0, y: 20 }, to: { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' } },
    hoverScale: 1.03,
    easing: 'power3.out',
    speed: 1,
  },
  energetic: {
    id: 'energetic',
    hero: { from: { opacity: 0, y: -30, scale: 1.05 }, to: { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' } },
    scrollReveal: { from: { opacity: 0, y: 30, scale: 0.95 }, to: { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }, stagger: 0.06, triggerStart: 'top 85%' },
    pageTransition: { from: { opacity: 0, scale: 0.98 }, to: { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' } },
    hoverScale: 1.06,
    easing: 'back.out(1.7)',
    speed: 1.2,
  },
  editorial: {
    id: 'editorial',
    hero: { from: { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }, to: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut' } },
    scrollReveal: { from: { opacity: 0, clipPath: 'inset(0% 100% 0% 0%)' }, to: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power3.inOut' }, stagger: 0.1, triggerStart: 'top 80%' },
    pageTransition: { from: { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }, to: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' } },
    hoverScale: 1.01,
    easing: 'power4.inOut',
    speed: 1,
  },
  fluid: {
    id: 'fluid',
    hero: { from: { opacity: 0, y: 30, rotateX: 5 }, to: { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: 'power2.out' } },
    scrollReveal: { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0, duration: 0.9, ease: 'sine.out' }, stagger: 0.1, triggerStart: 'top 82%' },
    pageTransition: { from: { opacity: 0, y: 15 }, to: { opacity: 1, y: 0, duration: 0.5, ease: 'sine.out' } },
    hoverScale: 1.04,
    easing: 'sine.out',
    speed: 0.9,
  },
  none: {
    id: 'none',
    hero: { from: { opacity: 1 }, to: { opacity: 1, duration: 0 } },
    scrollReveal: { from: { opacity: 1 }, to: { opacity: 1, duration: 0 }, stagger: 0, triggerStart: 'top 100%' },
    pageTransition: { from: { opacity: 1 }, to: { opacity: 1, duration: 0 } },
    hoverScale: 1,
    easing: 'none',
    speed: 0,
  },
};

export function useAnimation(): AnimationPreset {
  const [animId, setAnimId] = useState<AnimationId>('cinematic');

  useEffect(() => {
    setAnimId(getStoredAnimation());
  }, []);

  return useMemo(() => PRESETS[animId], [animId]);
}

export function getPreset(id: AnimationId): AnimationPreset {
  return PRESETS[id];
}
