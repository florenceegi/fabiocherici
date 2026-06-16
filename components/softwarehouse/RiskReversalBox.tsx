/**
 * @package fabiocherici.com — RiskReversalBox
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 1.0.0
 * @date 2026-06-16
 * @purpose Box "Cosa firmi davvero" (blueprint §3 Sez.2, §8): rende VISIBILE il
 *          meccanismo del risk-reversal (D9: la prova accanto all'obiezione #7).
 *          Caparra "in custodia" — ZERO percentuali (non in SSOT). Server
 *          component, zero JS, testo nell'HTML statico (P0-FC-2). Sfondo
 *          --bg-card + bordo --accent-muted per emergere (blueprint §2.1).
 */

export interface RiskReversalBoxProps {
  /** Eyebrow del box (i18n: how_box_label) */
  label: string;
  /** Voci del meccanismo, già tradotte (i18n: how_box_1..3) */
  items: readonly string[];
}

export default function RiskReversalBox({ label, items }: RiskReversalBoxProps) {
  return (
    <div
      className="reveal rounded-xl border bg-[var(--bg-card)] p-6 sm:p-8"
      style={{ borderColor: 'var(--accent-muted)' }}
    >
      <p className="mb-5 text-sm font-mono uppercase tracking-widest text-[var(--accent)]">
        {label}
      </p>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-base text-[var(--text-secondary)] leading-relaxed"
          >
            <span aria-hidden="true" className="mt-1 shrink-0 text-[var(--accent)]">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
