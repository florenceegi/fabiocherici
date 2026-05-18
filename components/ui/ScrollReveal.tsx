/**
 * @package fabiocherici.com — ScrollReveal
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 7.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-16
 * @purpose Scroll-triggered reveal via IntersectionObserver + GSAP (dynamic import). Re-animates ALL elements on preset change.
 */

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from '@/lib/i18n/routing';
import { useAnimation } from '@/lib/animation-context';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { AnimationPreset } from '@/lib/animation';

export function ScrollReveal() {
  const preset = useAnimation();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const prevPresetIdRef = useRef<string>(preset.id);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    let cancelled = false;

    import('gsap').then(({ default: gsap }) => {
      if (cancelled) return;

      document.documentElement.classList.add('reveal-ready');

      const presetChanged = prevPresetIdRef.current !== preset.id;
      prevPresetIdRef.current = preset.id;

      observerRef.current?.disconnect();
      gsap.killTweensOf('.reveal');

      if (presetChanged) {
        document.querySelectorAll('.reveal.revealed').forEach((el) => {
          el.classList.remove('revealed');
          gsap.set(el, { clearProps: 'all' });
        });
      }

      const elements = document.querySelectorAll('.reveal:not(.revealed)');
      if (!elements.length) return;

      if (reducedMotion || preset.id === 'none' || preset.speed === 0) {
        elements.forEach((el) => {
          gsap.set(el, { opacity: 1, y: 0, scale: 1, clearProps: 'clipPath,rotateX' });
          el.classList.add('revealed');
        });
        return;
      }

      const { from, to, stagger } = preset.scrollReveal;
      elements.forEach((el) => gsap.set(el, from));

      let batchQueue: Element[] = [];
      let batchTimer: ReturnType<typeof setTimeout> | null = null;

      function flushBatch() {
        const batch = [...batchQueue];
        batchQueue = [];
        batchTimer = null;
        batch.forEach((el, i) => {
          el.classList.add('revealed');
          gsap.to(el, { ...to, delay: i * stagger, overwrite: 'auto' });
        });
      }

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            obs.unobserve(entry.target);
            batchQueue.push(entry.target);
          });
          if (batchQueue.length && !batchTimer) {
            batchTimer = setTimeout(flushBatch, 16);
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
      );

      observerRef.current = obs;
      elements.forEach((el) => obs.observe(el));
    });

    return () => {
      cancelled = true;
      observerRef.current?.disconnect();
    };
  }, [preset, pathname, reducedMotion]);

  return null;
}
