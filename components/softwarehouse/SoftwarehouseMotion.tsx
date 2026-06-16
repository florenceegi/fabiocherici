/**
 * @package fabiocherici.com — SoftwarehouseMotion
 * @author FlorenceEGI — fabiocherici.com
 * @version 1.0.0
 * @date 2026-06-16
 * @purpose Motore di animazione GROSSO per /softwarehouse (richiesta CEO: animazioni
 *          VERE, i rettangoli si muovono e si uniscono — non il fade timido globale).
 *          GSAP + ScrollTrigger (dynamic import, P0-FC-1). Coreografa gli elementi
 *          marcati con data-sw="<tipo>": le card partono fuori posizione e arrivano
 *          quando la sezione entra nel viewport. Tipi:
 *            bento    → figli dai 4 lati che si incastrano
 *            stepper  → figli che entrano da sinistra in sequenza
 *            split    → 2 figli dai lati opposti che si scontrano al centro
 *            stagger  → figli che salgono in scala a cascata
 *            up       → l'elemento sale deciso
 *          Disattiva il reveal globale sugli stessi elementi (toglie .reveal) per
 *          evitare doppia animazione. reduced-motion → tutto fermo e visibile
 *          (P0-FC-5). Senza JS il contenuto è visibile (P0-FC-2): l'off-position è
 *          impostata da JS solo dopo il mount.
 */

'use client';

import { useEffect } from 'react';

type SwType = 'bento' | 'stepper' | 'split' | 'stagger' | 'up';

export default function SoftwarehouseMotion() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return; // accessibilità: nessun movimento
    }
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
      if (cancelled) return;
      const gsap = g.default;
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ctx = (gsap as any).context(() => {
        const containers = Array.from(document.querySelectorAll<HTMLElement>('[data-sw]'));
        containers.forEach((container) => {
          const type = (container.dataset.sw || 'stagger') as SwType;
          // I figli da animare; togli il reveal globale per non avere doppioni.
          const kids = Array.from(container.children) as HTMLElement[];
          kids.forEach((k) => {
            k.classList.remove('reveal', 'revealed');
            k.querySelectorAll('.reveal').forEach((r) => r.classList.remove('reveal', 'revealed'));
          });
          if (kids.length === 0) return;

          const common = {
            scrollTrigger: { trigger: container, start: 'top 82%', once: true },
          };

          if (type === 'bento') {
            kids.forEach((k, i) => {
              const fromX = i % 2 === 0 ? -120 : 120;
              const fromY = i < 2 ? -60 : 60;
              gsap.fromTo(
                k,
                { opacity: 0, x: fromX, y: fromY, scale: 0.85, rotate: i % 2 === 0 ? -3 : 3 },
                { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.5)', delay: i * 0.1, ...common },
              );
            });
          } else if (type === 'stepper') {
            kids.forEach((k, i) => {
              gsap.fromTo(
                k,
                { opacity: 0, x: -90, scale: 0.9 },
                { opacity: 1, x: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)', delay: i * 0.16, ...common },
              );
            });
          } else if (type === 'split') {
            kids.forEach((k, i) => {
              gsap.fromTo(
                k,
                { opacity: 0, x: i === 0 ? -160 : 160, rotate: i === 0 ? -2 : 2 },
                { opacity: 1, x: 0, rotate: 0, duration: 0.8, ease: 'power3.out', ...common },
              );
            });
          } else if (type === 'up') {
            gsap.fromTo(
              container,
              { opacity: 0, y: 80, scale: 0.97 },
              { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: container, start: 'top 85%', once: true } },
            );
          } else {
            // stagger
            kids.forEach((k, i) => {
              gsap.fromTo(
                k,
                { opacity: 0, y: 70, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)', delay: i * 0.09, ...common },
              );
            });
          }
        });
        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return null;
}
