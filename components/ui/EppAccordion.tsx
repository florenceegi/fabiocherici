/**
 * @package fabiocherici.com — EPP Accordion
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-28
 * @purpose Server Component accordion native HTML5 details/summary for EPP widgets. Zero JS runtime, A11y native via summary, static-export friendly.
 * @mission M-009
 */

import type { ReactNode } from 'react';
import { ChevronDown } from './EppIcons';

export type EppAccordionProps = {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function EppAccordion({
  id,
  badge,
  title,
  subtitle,
  icon,
  defaultOpen = false,
  children,
}: EppAccordionProps) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group rounded-lg border border-[var(--border)] bg-[var(--surface)] open:bg-[var(--surface-glass)] transition-colors overflow-hidden"
    >
      <summary
        className="
          flex items-start gap-4 px-6 py-5 cursor-pointer select-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]
          [&::-webkit-details-marker]:hidden [&::marker]:hidden
        "
      >
        {icon && (
          <span className="shrink-0 text-[var(--accent)] mt-1" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          {badge && (
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-2">
              {badge}
            </p>
          )}
          <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-light text-[var(--text-primary)] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm sm:text-base text-[var(--text-secondary)] italic">
              {subtitle}
            </p>
          )}
        </div>
        <ChevronDown
          className="shrink-0 mt-2 text-[var(--text-secondary)] transition-transform duration-300 ease-out group-open:rotate-180"
        />
      </summary>
      <div className="px-6 pb-6 bg-[var(--bg-elevated)] text-[var(--text-secondary)] leading-relaxed space-y-4">
        {children}
      </div>
    </details>
  );
}
