/**
 * @package fabiocherici.com — NexusWidget
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Contenitore del widget Padmin (correzioni CEO M-017). Ora il widget
 *          vive in CIMA a /softwarehouse (#1 cosa interattiva): la CHAT è
 *          l'elemento DOMINANTE e ampio. Layout: chat grande a piena larghezza
 *          (area messaggi alta su desktop e mobile), poi sotto una fascia con il
 *          ticker pillole e la VETRINA opere reali (striscia scorrevole). La
 *          vetrina chiama /showcase sullo STESSO origin del chat: derivo l'URL
 *          dall'endpoint base del chat (Nexus fa da proxy alle opere EGI reali),
 *          con override opzionale via env esplicita.
 * @mission M-017
 */

'use client';

import PadminChat from './PadminChat';
import EgiShowcase from './EgiShowcase';
import WisdomTicker from './WisdomTicker';

export interface NexusWidgetProps {
  /** Endpoint base della chat (POST {endpoint}/chat). */
  chatEndpoint: string;
  /**
   * URL esplicito del proxy showcase (override). Se assente, viene derivato
   * dall'endpoint chat ({base}/showcase, stesso origin).
   */
  showcaseEndpoint?: string;
  /** Label "apre in nuova scheda" (i18n footer), passata a EgiShowcase. */
  opensNewTabLabel: string;
  /** Prompt-seed cliccabili (M-018), inoltrati a PadminChat. Click = invio. */
  seeds?: readonly string[];
  /** Micro-invito sopra i seed (i18n nexus.seed_intro). */
  seedIntro?: string;
}

/** Deriva {base}/showcase dallo stesso origin del chat (Nexus proxy). */
function deriveShowcaseEndpoint(chatEndpoint: string, explicit?: string): string {
  if (explicit) return explicit;
  const base = chatEndpoint.replace(/\/$/, '');
  // '/' (same-origin) → '/showcase'; altrimenti '{base}/showcase'.
  return base === '' ? '/showcase' : `${base}/showcase`;
}

export default function NexusWidget({
  chatEndpoint,
  showcaseEndpoint,
  opensNewTabLabel,
  seeds,
  seedIntro,
}: NexusWidgetProps) {
  const resolvedShowcase = deriveShowcaseEndpoint(chatEndpoint, showcaseEndpoint);

  return (
    <div className="reveal flex flex-col gap-6">
      {/* CHAT — elemento dominante: alta e larga, comoda da leggere/scrivere */}
      <div
        className="rounded-2xl border p-4 shadow-lg sm:p-6"
        style={{ borderColor: 'var(--border-accent)', backgroundColor: 'var(--bg-elevated)' }}
      >
        <PadminChat endpoint={chatEndpoint} seeds={seeds} seedIntro={seedIntro} />
      </div>

      {/* Fascia secondaria: ticker pillole + vetrina opere reali (strisce) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <WisdomTicker />
        <EgiShowcase endpoint={resolvedShowcase} opensNewTabLabel={opensNewTabLabel} />
      </div>
    </div>
  );
}
