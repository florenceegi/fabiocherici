/**
 * @package fabiocherici.com — Marquee (testo scorrevole / nastro vivo)
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 1.0.0
 * @date 2026-06-16
 * @purpose Striscia di testo che scorre orizzontalmente in loop continuo (CSS
 *          transform translateX, compositor-only — zero layout shift, P0-FC-5).
 *          Usata per far sfilare i nomi dei 23 repo come "nastro vivo" sopra il
 *          portfolio. Server component, ZERO JS: il testo è nell'HTML statico ed
 *          è leggibile senza JS (P0-FC-2). Lo scorrimento è enhancement gestito
 *          interamente in CSS, gated da `prefers-reduced-motion: no-preference`
 *          (P0-FC-5): con reduced-motion il nastro è STATICO e leggibile.
 *          Il contenuto è duplicato x2 (aria-hidden sul duplicato) per ottenere
 *          un loop senza salti. A11Y: "marquee" NON è un ruolo ARIA valido
 *          (ARIA 1.2) → si usa role="group" + aria-label per nominare la striscia;
 *          il duplicato è aria-hidden così lo screen reader legge le voci una
 *          sola volta. Lista semantica (ul/li) per la sequenza reale.
 */

import type { CSSProperties } from 'react';

export interface MarqueeProps {
  /** Voci da far scorrere (es. i nomi dei 23 repo). */
  items: readonly string[];
  /** Etichetta accessibile della striscia (es. "23 progetti costruiti"). */
  ariaLabel: string;
  /** Durata di un giro completo in secondi (default 40). */
  durationSeconds?: number;
}

/** Una passata delle voci con separatore bronzo tra ciascuna. */
function MarqueeTrack({ items }: { items: readonly string[] }) {
  return (
    <ul className="sw-marquee__track" role="list">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="sw-marquee__item">
          <span className="sw-marquee__sep" aria-hidden="true">
            ·
          </span>
          <span className="sw-marquee__label">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Marquee({ items, ariaLabel, durationSeconds = 40 }: MarqueeProps) {
  if (items.length === 0) return null;

  return (
    <div
      className="sw-marquee"
      role="group"
      aria-label={ariaLabel}
      style={{ '--sw-marquee-duration': `${durationSeconds}s` } as CSSProperties}
    >
      <div className="sw-marquee__viewport">
        {/* Passata reale (letta dallo screen reader). */}
        <MarqueeTrack items={items} />
        {/* Duplicato per loop continuo — nascosto agli AT. */}
        <div aria-hidden="true">
          <MarqueeTrack items={items} />
        </div>
      </div>
    </div>
  );
}
