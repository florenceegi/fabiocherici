/**
 * @package fabiocherici.com — LsoTraits
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-11
 * @purpose Le 3 proprietà del LSO (SSOT commercial-claims §5) che "respirano".
 *          Server component, zero JS: il respiro è CSS-only (.lso-trait,
 *          globals.css @keyframes lso-breathe, attivo SOLO sotto
 *          prefers-reduced-motion: no-preference — design M-015 §B).
 * @mission M-015
 */

export type LsoTrait = {
  /** Titolo proprietà (es. "Si documenta da solo") */
  title: string;
  /** Descrizione cliente (traduzione approvata SSOT §5) */
  description: string;
};

export interface LsoTraitsProps {
  traits: LsoTrait[];
  ariaLabel?: string;
}

export default function LsoTraits({ traits, ariaLabel }: LsoTraitsProps) {
  return (
    <ul aria-label={ariaLabel} className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {traits.map((trait, i) => (
        <li
          key={i}
          className="lso-trait reveal flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6"
        >
          <h3 className="text-base font-semibold text-[var(--text-primary)] leading-tight">
            {trait.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {trait.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
