/**
 * @package fabiocherici.com — AdvisorSlot
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 4.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-16
 * @purpose Slot della chat advisor (design M-015 §D, widget M-017). Innesto v2
 *          ATTIVO: con static export le env NEXT_PUBLIC_* sono valutate a BUILD
 *          time. Se NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT è definita rende il widget
 *          Padmin (NexusWidget); altrimenti resta il fallback statico onesto
 *          (copy + CTA "la provi in chiamata") — build NON si rompe senza env.
 *          M-018: riceve i prompt-seed (i18n) dal server e li inoltra al widget;
 *          nel fallback senza env li mostra come testo (degrado P0-FC-2: senza
 *          chat il visitatore legge comunque cosa può chiedere).
 * @mission M-018
 */

import NexusWidget from './nexus/NexusWidget';

export interface AdvisorSlotProps {
  /** Copy onesto sullo stato della chat (i18n: lso_demo_caption) */
  demoCaption: string;
  /** Testo CTA "provala in chiamata" (i18n: lso_chat_cta) */
  ctaLabel: string;
  /** Label "apre in nuova scheda" (i18n footer.opens_new_tab) per la vetrina */
  opensNewTabLabel: string;
  /** Prompt-seed cliccabili (M-018): click → messaggio inviato a Padmin. */
  seeds?: readonly string[];
  /** Micro-invito sopra i seed (i18n nexus.seed_intro). */
  seedIntro?: string;
}

export default function AdvisorSlot({
  demoCaption,
  ctaLabel,
  opensNewTabLabel,
  seeds,
  seedIntro,
}: AdvisorSlotProps) {
  // Valutata a build-time (static export). Endpoint assente → fallback statico.
  const chatEndpoint = process.env.NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT;
  const showcaseEndpoint = process.env.NEXT_PUBLIC_EGI_SHOWCASE_ENDPOINT;

  if (chatEndpoint) {
    return (
      <NexusWidget
        chatEndpoint={chatEndpoint}
        showcaseEndpoint={showcaseEndpoint}
        opensNewTabLabel={opensNewTabLabel}
        seeds={seeds}
        seedIntro={seedIntro}
      />
    );
  }

  // Fallback statico (degrado P0-FC-2): testo + seed come spunti + CTA, tutto
  // nell'HTML server. Senza chat i seed restano spunti leggibili (recognition).
  return (
    <div className="space-y-8">
      <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">
        {demoCaption}
      </p>
      {seeds && seeds.length > 0 ? (
        <div className="reveal">
          {seedIntro ? (
            <p className="mb-2 text-sm text-[var(--text-muted)]">{seedIntro}</p>
          ) : null}
          <ul className="space-y-2">
            {seeds.map((seed) => (
              <li
                key={seed}
                className="text-base text-[var(--text-secondary)] before:mr-2 before:text-[var(--accent)] before:content-['—']"
              >
                {seed}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="reveal">
        <a
          href="#contatto"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-8 py-3 text-base font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--bg)]"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
