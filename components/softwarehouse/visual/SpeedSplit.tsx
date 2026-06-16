/**
 * @package fabiocherici.com — SpeedSplit
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 1.0.0
 * @date 2026-06-16
 * @purpose Split-screen visivo "mercato ↔ noi" per la sezione velocità (la leva:
 *          la velocità È il prodotto, commercial-claims-public r.103). Due colonne
 *          contrapposte: a sinistra il mercato (settimane, attenuato/barrato), a
 *          destra noi (3-5 giorni, bronzo, protagonista). Sostituisce i due
 *          paragrafoni con un confronto immediato e scansionabile. Server
 *          component, zero JS, testo nell'HTML (P0-FC-2). FEDELTÀ: sempre
 *          comparativo (mercato vs noi), mai numero gridato a secco.
 */

export interface SpeedSplitProps {
  /** Etichetta colonna mercato (es. "Una software house qualsiasi"). */
  marketLabel: string;
  /** Valore mercato (es. "settimane"). */
  marketValue: string;
  /** Riga di dettaglio mercato breve. */
  marketDetail: string;
  /** Etichetta colonna noi (es. "Con FlorenceEGI"). */
  usLabel: string;
  /** Valore noi protagonista (es. "3-5 giorni"). */
  usValue: string;
  /** Riga di dettaglio noi breve. */
  usDetail: string;
}

export default function SpeedSplit({
  marketLabel,
  marketValue,
  marketDetail,
  usLabel,
  usValue,
  usDetail,
}: SpeedSplitProps) {
  return (
    <div data-sw="split" className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
      {/* Mercato — attenuato */}
      <div className="flex flex-col gap-2 bg-[var(--bg-card)] p-8 sm:p-10">
        <p className="text-sm font-mono uppercase tracking-widest text-[var(--text-muted)]">
          {marketLabel}
        </p>
        <p className="font-[family-name:var(--font-display)] text-4xl font-light leading-none text-[var(--text-secondary)] line-through decoration-[var(--text-muted)]/40 sm:text-5xl">
          {marketValue}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{marketDetail}</p>
      </div>
      {/* Noi — protagonista bronzo */}
      <div
        className="flex flex-col gap-2 p-8 sm:p-10"
        style={{ backgroundColor: 'var(--accent-glow)' }}
      >
        <p className="text-sm font-mono uppercase tracking-widest text-[var(--accent)]">{usLabel}</p>
        <p className="font-[family-name:var(--font-display)] text-5xl font-light leading-none text-[var(--accent)] sm:text-6xl">
          {usValue}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{usDetail}</p>
      </div>
    </div>
  );
}
