/**
 * @package fabiocherici.com — AdvisorSlot
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-11
 * @purpose Slot progressivo per la chat advisor (design M-015 §D). v1: demo
 *          statica (screenshot reale chat_ai.png + caption SSOT §3 r9 + CTA
 *          "la provi in chiamata"). Predisposizione innesto: con static export
 *          la env NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT è valutata a BUILD time —
 *          quando AdvisorChat esisterà (mission M-EGI), questo slot renderà
 *          <AdvisorChat endpoint={endpoint} locale={locale} /> se la env è
 *          definita. In v1 il componente NON esiste (design §D: niente
 *          componenti vuoti) e lo slot rende SOLO la demo statica.
 * @mission M-015
 */

import Image from 'next/image';

export interface AdvisorSlotProps {
  /** Alt screenshot demo (i18n: lso_demo_alt) */
  demoAlt: string;
  /** Caption demo (i18n: lso_demo_caption) */
  demoCaption: string;
  /** Testo CTA "provala in chiamata" (i18n: lso_chat_cta) */
  ctaLabel: string;
}

export default function AdvisorSlot({ demoAlt, demoCaption, ctaLabel }: AdvisorSlotProps) {
  // Innesto v2 (M-EGI): sostituire il blocco statico con
  //   const endpoint = process.env.NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT;
  //   return endpoint ? <AdvisorChat endpoint={endpoint} locale={locale} /> : <demo statica>;
  // "Setti la env e rebuildi": zero refactor della pagina (design M-015 §D).
  return (
    <div className="space-y-8">
      <figure className="reveal">
        <Image
          src="/img/softwarehouse/chat_ai.png"
          alt={demoAlt}
          width={1200}
          height={800}
          className="w-full h-auto rounded-lg border border-[var(--border)]"
        />
        <figcaption className="mt-4 text-sm text-[var(--text-muted)] italic leading-relaxed">
          {demoCaption}
        </figcaption>
      </figure>
      <div className="reveal text-center">
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
