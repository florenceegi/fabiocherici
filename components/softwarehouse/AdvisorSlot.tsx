/**
 * @package fabiocherici.com — AdvisorSlot
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-12
 * @purpose Slot della chat advisor (design M-015 §D). M-016: rimosso lo
 *          screenshot statico (vincolo CEO). Finché la chat reale non è
 *          innestata (route EGI fabiocherici/advisor/chat — mission M-EGI),
 *          lo slot rende SOLO copy onesto + CTA "la provi in chiamata".
 *          Innesto v2: con static export la env NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT
 *          è valutata a BUILD time — quando AdvisorChat esisterà renderà
 *          <AdvisorChat endpoint={endpoint} locale={locale} /> se la env è
 *          definita; zero refactor della pagina.
 * @mission M-016
 */

export interface AdvisorSlotProps {
  /** Copy onesto sullo stato della chat (i18n: lso_demo_caption) */
  demoCaption: string;
  /** Testo CTA "provala in chiamata" (i18n: lso_chat_cta) */
  ctaLabel: string;
}

export default function AdvisorSlot({ demoCaption, ctaLabel }: AdvisorSlotProps) {
  // Innesto v2 (mission M-EGI): sostituire il blocco con
  //   const endpoint = process.env.NEXT_PUBLIC_ADVISOR_CHAT_ENDPOINT;
  //   return endpoint ? <AdvisorChat endpoint={endpoint} locale={locale} /> : <fallback>;
  // "Setti la env e rebuildi": zero refactor della pagina (design M-015 §D).
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
