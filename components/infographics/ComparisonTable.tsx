/**
 * @package fabiocherici.com — ComparisonTable
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-27
 * @purpose Tabella comparison 2 colonne "promesso vs successo". Riusabile in design system.
 *          Pattern: ❌ promesso | descrizione realtà. WCAG AA semantic table + aria.
 */

import type { ReactNode } from 'react';

export type ComparisonRow = {
  promise: string;
  reality: string;
};

export interface ComparisonTableProps {
  headPromise: string;
  headReality: string;
  rows: ComparisonRow[];
  caption?: ReactNode;
  ariaLabel?: string;
}

export default function ComparisonTable({
  headPromise,
  headReality,
  rows,
  caption,
  ariaLabel,
}: ComparisonTableProps) {
  return (
    <div className="reveal w-full">
      <table
        aria-label={ariaLabel}
        className="w-full border-collapse text-left"
      >
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th
              scope="col"
              className="py-3 pr-4 text-xs sm:text-sm font-mono uppercase tracking-widest text-[var(--text-muted)]"
            >
              {headPromise}
            </th>
            <th
              scope="col"
              className="py-3 pl-4 text-xs sm:text-sm font-mono uppercase tracking-widest text-[var(--text-muted)]"
            >
              {headReality}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={
                'border-b border-[var(--border)] ' +
                (i % 2 === 0 ? 'bg-transparent' : 'bg-[var(--bg-card)]/40')
              }
            >
              <td className="py-4 pr-4 align-top text-sm sm:text-base text-[var(--text-secondary)]">
                <span
                  aria-hidden="true"
                  className="mr-2 text-[#8B4A4A] font-bold"
                >
                  ✕
                </span>
                {row.promise}
              </td>
              <td className="py-4 pl-4 align-top text-sm sm:text-base text-[var(--text-primary)]">
                {row.reality}
              </td>
            </tr>
          ))}
        </tbody>
        {caption && (
          <caption className="caption-bottom mt-4 text-sm sm:text-base text-[var(--accent)] italic">
            {caption}
          </caption>
        )}
      </table>
    </div>
  );
}
