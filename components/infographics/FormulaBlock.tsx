/**
 * @package fabiocherici.com — FormulaBlock
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-27
 * @purpose Composizione tipografica formula matematica grande (es. "A × B = C").
 *          Operandi + operatori parametrici. Responsive: orizzontale desktop → verticale mobile.
 */

import type { ReactNode } from 'react';

export type FormulaTerm = {
  label: string;
  emphasis?: 'accent' | 'primary' | 'muted';
  /** Optional href: if set, the term renders as a link */
  href?: string;
};

export interface FormulaBlockProps {
  terms: FormulaTerm[];
  operators: string[];
  ariaLabel?: string;
  details?: ReactNode;
}

const emphasisClass = (e?: FormulaTerm['emphasis']) => {
  switch (e) {
    case 'accent':
      return 'text-[var(--accent)]';
    case 'muted':
      return 'text-[var(--text-muted)]';
    case 'primary':
    default:
      return 'text-[var(--text-primary)]';
  }
};

export default function FormulaBlock({
  terms,
  operators,
  ariaLabel,
  details,
}: FormulaBlockProps) {
  if (terms.length === 0) return null;
  if (operators.length !== terms.length - 1) {
    console.warn(
      'FormulaBlock: operators.length must be terms.length - 1',
    );
  }

  return (
    <div className="reveal w-full">
      <div
        role="img"
        aria-label={ariaLabel || terms.map((t) => t.label).join(' ')}
        className="flex flex-col items-center justify-center gap-2 py-8 text-center font-[family-name:var(--font-display)] sm:flex-row sm:flex-wrap sm:gap-4"
      >
        {terms.map((term, i) => {
          const labelClass =
            'text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight ' +
            emphasisClass(term.emphasis);
          return (
            <span key={`t-${i}`} className="contents">
              {term.href ? (
                <a
                  href={term.href}
                  className={
                    labelClass + ' underline underline-offset-8 decoration-2 hover:opacity-80 transition-opacity'
                  }
                >
                  {term.label}
                </a>
              ) : (
                <span className={labelClass}>{term.label}</span>
              )}
              {i < operators.length && (
                <span
                  aria-hidden="true"
                  className="text-2xl sm:text-3xl md:text-4xl font-light text-[var(--text-muted)]"
                >
                  {operators[i]}
                </span>
              )}
            </span>
          );
        })}
      </div>
      {details && <div className="mt-8 space-y-4">{details}</div>}
    </div>
  );
}
