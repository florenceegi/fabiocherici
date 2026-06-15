/**
 * @package fabiocherici.com — AdvisorSlot
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 3.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Slot della chat advisor (design M-015 §D, widget M-017). Innesto v2
 *          ATTIVO: con static export le env NEXT_PUBLIC_* sono valutate a BUILD
 *          time. Se NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT è definita rende il widget
 *          Padmin (NexusWidget); altrimenti resta il fallback statico onesto
 *          (copy + CTA "la provi in chiamata") — build NON si rompe senza env.
 * @mission M-017
 */

import NexusWidget from './nexus/NexusWidget';

export interface AdvisorSlotProps {
  /** Copy onesto sullo stato della chat (i18n: lso_demo_caption) */
  demoCaption: string;
  /** Testo CTA "provala in chiamata" (i18n: lso_chat_cta) */
  ctaLabel: string;
  /** Label "apre in nuova scheda" (i18n footer.opens_new_tab) per la vetrina */
  opensNewTabLabel: string;
}

export default function AdvisorSlot({ demoCaption, ctaLabel, opensNewTabLabel }: AdvisorSlotProps) {
  // Valutata a build-time (static export). Endpoint assente → fallback statico.
  const chatEndpoint = process.env.NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT;
  const showcaseEndpoint = process.env.NEXT_PUBLIC_EGI_SHOWCASE_ENDPOINT;

  if (chatEndpoint) {
    return (
      <NexusWidget
        chatEndpoint={chatEndpoint}
        showcaseEndpoint={showcaseEndpoint}
        opensNewTabLabel={opensNewTabLabel}
      />
    );
  }

  // Fallback statico (degrado P0-FC-2): testo + CTA sempre nell'HTML server.
  return (
    <div className="space-y-8">
      <p className="reveal text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">
        {demoCaption}
      </p>
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
