/**
 * @package fabiocherici.com — SectionCta
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-11
 * @purpose CTA intermedia di sezione (design M-015 §A): un solo link-bottone pill
 *          centrato, separatore di battuta dopo le sezioni 3, 5, 7.
 *          Server component, zero JS. Testo via props (i18n nella page, P0-FC-4).
 * @mission M-015
 */

export interface SectionCtaProps {
  /** Testo del bottone (già tradotto dalla page) */
  text: string;
  /** Ancora interna di destinazione (es. "#contatto") */
  href: string;
}

export default function SectionCta({ text, href }: SectionCtaProps) {
  return (
    <div className="reveal mt-16 flex justify-center">
      <a
        href={href}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3 text-base font-semibold text-[var(--bg)] transition-colors hover:bg-[var(--accent-hover)]"
      >
        {text}
      </a>
    </div>
  );
}
