/**
 * @package fabiocherici.com — HeroAssemble
 * @author FlorenceEGI — fabiocherici.com
 * @version 1.0.0
 * @date 2026-06-16
 * @purpose La "DANZA" dell'hero (richiesta CEO: dimostrare visivamente, non
 *          scrivere). Mostra un GESTIONALE che si ASSEMBLA da solo: una finestra
 *          app vuota in cui i pezzi (sidebar, toolbar, stat, tabella, grafico)
 *          entrano uno a uno fino a comporre un software finito — poi il ciclo
 *          riparte. Dice "montiamo il tuo software, lo vedi prendere forma" e la
 *          velocità dell'assemblaggio echeggia "prima versione in giorni".
 *          È un MOTIVO visivo astratto (non dati reali → non viola P0-FC-6: non
 *          afferma nulla, illustra il processo di costruzione).
 *          Moto = GSAP timeline via import('gsap') in useEffect (P0-FC-1).
 *          reduced-motion → finestra GIÀ assemblata, statica (P0-FC-5). Senza JS
 *          (P0-FC-2): i pezzi sono renderizzati visibili di default (opacity:1);
 *          il JS li nasconde e li anima solo se può (data-assemble + classe).
 */

'use client';

import { useEffect, useRef } from 'react';

export default function HeroAssemble() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return; // reduced-motion: resta tutto assemblato e fermo
    }
    const pieces = Array.from(root.querySelectorAll<HTMLElement>('[data-assemble]'));
    if (pieces.length === 0) return;

    let killed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tl: any;
    import('gsap').then(({ default: gsap }) => {
      if (killed) return;
      gsap.set(pieces, { opacity: 0, y: 14, scale: 0.96 });
      tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6 });
      tl.to(pieces, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.14,
      })
        .to({}, { duration: 1.4 }) // tieni il gestionale "finito" in vista
        .to(pieces, { opacity: 0, y: 10, duration: 0.4, ease: 'power1.in', stagger: 0.04 });
    });

    return () => {
      killed = true;
      if (tl) tl.kill();
    };
  }, []);

  // Skeleton bronzo/grafite di un "gestionale". Tutti i pezzi visibili di default
  // (P0-FC-2): il JS li anima solo se disponibile.
  const bar = 'rounded bg-[var(--border-accent)]';
  const accentBar = 'rounded bg-[var(--accent)]/70';

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-2xl"
    >
      {/* title bar */}
      <div data-assemble className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-accent)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-accent)]" />
        <span className={`${bar} ml-3 h-2 w-32`} />
      </div>

      <div className="flex min-h-[18rem]">
        {/* sidebar */}
        <div data-assemble className="hidden w-36 shrink-0 flex-col gap-3 border-r border-[var(--border)] p-4 sm:flex">
          <span className={`${accentBar} h-3 w-20`} />
          <span className={`${bar} mt-2 h-2.5 w-full`} />
          <span className={`${bar} h-2.5 w-full`} />
          <span className={`${bar} h-2.5 w-3/4`} />
          <span className={`${bar} h-2.5 w-full`} />
          <span className={`${bar} mt-auto h-2.5 w-2/3`} />
        </div>

        {/* main */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* toolbar */}
          <div data-assemble className="flex items-center justify-between">
            <span className={`${bar} h-3 w-28`} />
            <span className={`${accentBar} h-6 w-20 rounded-md`} />
          </div>

          {/* stat row */}
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                data-assemble
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3"
              >
                <span className={`${i === 0 ? accentBar : bar} block h-4 w-2/3`} />
                <span className={`${bar} mt-2 block h-2 w-full`} />
              </div>
            ))}
          </div>

          {/* mini bar chart */}
          <div data-assemble className="flex items-end gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3">
            {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
              <span
                key={i}
                className={`${i % 3 === 0 ? 'bg-[var(--accent)]/70' : 'bg-[var(--border-accent)]'} w-full rounded-t`}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          {/* table rows */}
          <div className="flex flex-col gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                data-assemble
                className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2"
              >
                <span className="h-5 w-5 shrink-0 rounded-full bg-[var(--accent)]/40" />
                <span className={`${bar} h-2.5 flex-1`} />
                <span className={`${bar} h-2.5 w-16`} />
                <span className={`${accentBar} h-4 w-10 rounded`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
