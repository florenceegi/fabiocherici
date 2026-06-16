/**
 * @package fabiocherici.com — PricingMarketVsUs
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 1.0.0
 * @date 2026-06-16
 * @purpose Tabella prezzi "tempo di mercato vs con noi" (blueprint §4.1, copy
 *          Sez.4). FEDELTÀ SSOT: nessuna percentuale caparra (NON in SSOT) e
 *          nessun numero "con noi" per-fascia inventato — l'SSOT dà solo la regola
 *          "circa la metà del tempo di mercato" (commercial-claims-public r.96):
 *          quindi la colonna "Con noi" mostra il valore QUALITATIVO "circa la metà"
 *          (usValue), uguale per ogni fascia, evidenziata bronzo (è la leva).
 *          La caparra "in custodia" è una NOTA sotto la tabella, non una colonna.
 *          Responsive (web.dev/learn-responsive: riflow, non scroll-via): desktop
 *          = <table> semantica con <caption> sr-only e <th scope>; mobile = stessa
 *          informazione in card per fascia. Le due rappresentazioni si escludono
 *          via Tailwind hidden/md:* + aria-hidden coordinato → niente doppia
 *          lettura per screen reader. Server component, zero JS (P0-FC-2).
 *          Target size SC 2.5.8 (AA): nessun elemento interattivo nella tabella.
 */

export interface PricingRow {
  name: string;
  price: string;
  market: string;
  maintenance: string;
}

export interface PricingMarketVsUsProps {
  rows: readonly PricingRow[];
  /** Valore qualitativo colonna "Con noi" (SSOT: "circa la metà"). */
  usValue: string;
  labels: {
    caption: string;
    tier: string;
    price: string;
    market: string;
    us: string;
    maintenance: string;
  };
}

export default function PricingMarketVsUs({ rows, usValue, labels }: PricingMarketVsUsProps) {
  return (
    <div className="reveal">
      {/* ── Desktop: tabella semantica ── */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-[var(--border)]">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{labels.caption}</caption>
          <thead>
            <tr className="bg-[var(--bg-elevated)]">
              <th scope="col" className="px-5 py-4 text-sm font-mono uppercase tracking-wider text-[var(--text-muted)]">
                {labels.tier}
              </th>
              <th scope="col" className="px-5 py-4 text-sm font-mono uppercase tracking-wider text-[var(--text-muted)]">
                {labels.price}
              </th>
              <th scope="col" className="px-5 py-4 text-sm font-mono uppercase tracking-wider text-[var(--text-muted)]">
                {labels.market}
              </th>
              <th
                scope="col"
                className="px-5 py-4 text-sm font-mono uppercase tracking-wider text-[var(--accent)]"
                style={{ backgroundColor: 'var(--accent-glow)' }}
              >
                {labels.us}
              </th>
              <th scope="col" className="px-5 py-4 text-sm font-mono uppercase tracking-wider text-[var(--text-muted)]">
                {labels.maintenance}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-t border-[var(--border)]">
                <th scope="row" className="px-5 py-4 text-base font-semibold text-[var(--text-primary)]">
                  {row.name}
                </th>
                <td className="px-5 py-4 text-base text-[var(--accent)] font-semibold">{row.price}</td>
                <td className="px-5 py-4 text-base text-[var(--text-secondary)] line-through decoration-[var(--text-muted)]/50">
                  {row.market}
                </td>
                <td
                  className="px-5 py-4 text-base font-semibold text-[var(--accent)]"
                  style={{ backgroundColor: 'var(--accent-glow)' }}
                >
                  {usValue}
                </td>
                <td className="px-5 py-4 text-base text-[var(--text-secondary)]">{row.maintenance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile: card per fascia (riflow, non scroll orizzontale) ──
           Niente aria-hidden: sotto md la tabella desktop è display:none (fuori
           dall'a11y tree), quindi qui NON c'è doppia lettura; lo screen reader su
           mobile deve poter leggere i prezzi (WCAG 1.3.1 / 4.1.2). */}
      <ul className="md:hidden space-y-4">
        {rows.map((row) => (
          <li key={row.name} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">{row.name}</h3>
            <p className="mt-1 text-lg font-bold text-[var(--accent)]">{row.price}</p>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--text-muted)] font-mono uppercase tracking-wider text-xs">
                  {labels.market}
                </dt>
                <dd className="text-right text-[var(--text-secondary)] line-through decoration-[var(--text-muted)]/50">
                  {row.market}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--accent)] font-mono uppercase tracking-wider text-xs">{labels.us}</dt>
                <dd className="text-right font-semibold text-[var(--accent)]">{usValue}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--text-muted)] font-mono uppercase tracking-wider text-xs">
                  {labels.maintenance}
                </dt>
                <dd className="text-right text-[var(--text-secondary)]">{row.maintenance}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
