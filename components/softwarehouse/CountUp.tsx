/**
 * @package fabiocherici.com — CountUp (conta-su animato allo scroll)
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 1.0.0
 * @date 2026-06-16
 * @purpose Numero che "sale" da 0 al valore finale quando entra in viewport.
 *          GSAP via dynamic import DENTRO useEffect (P0-FC-1, mai top-level),
 *          IntersectionObserver per il trigger. P0-FC-2: il valore FINALE è già
 *          renderizzato nell'HTML (children formattato dal padre) — senza JS si
 *          legge il numero corretto, l'animazione lo sovrascrive solo quando JS
 *          è attivo. P0-FC-5: con reduced-motion NON anima, mostra subito il
 *          valore finale. Compositor-friendly: cambia solo textContent (nessun
 *          layout shift sul container, che mantiene la stessa larghezza del
 *          numero finale già presente). aria-hidden sul numero in movimento +
 *          valore finale leggibile via screen-reader-only statico.
 */

'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

export interface CountUpProps {
  /** Valore numerico finale verso cui contare. */
  value: number;
  /** Formatta il numero (es. separatore migliaia per-locale). */
  format: (n: number) => string;
  /** Durata animazione in secondi (default 1.6). */
  durationSeconds?: number;
  /** Prefisso non animato (es. "~"). */
  prefix?: string;
}

export default function CountUp({ value, format, durationSeconds = 1.6, prefix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // P0-FC-5: reduced-motion → nessuna animazione, il valore finale è già nel DOM.
    if (reducedMotion) return;

    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    // killTweensOf richiede l'oggetto target stabile; animiamo un proxy.
    const proxy = { n: 0 };

    import('gsap').then(({ default: gsap }) => {
      if (cancelled || !ref.current) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer?.unobserve(entry.target);
            // Parte da 0 → conta fino al valore.
            el.textContent = `${prefix}${format(0)}`;
            gsap.to(proxy, {
              n: value,
              duration: durationSeconds,
              ease: 'power2.out',
              onUpdate: () => {
                if (ref.current) ref.current.textContent = `${prefix}${format(Math.round(proxy.n))}`;
              },
            });
          });
        },
        { threshold: 0.4 },
      );

      observer.observe(el);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [value, format, durationSeconds, prefix, reducedMotion]);

  return (
    <span ref={ref} aria-hidden="true">
      {prefix}
      {format(value)}
    </span>
  );
}
