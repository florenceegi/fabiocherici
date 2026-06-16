/**
 * @package fabiocherici.com — PainCard
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 1.0.0
 * @date 2026-06-16
 * @purpose Card-dolore breve per il bento "Il problema" (direzione visiva 2026:
 *          il paragrafone empatico diventa 4 moduli scansionabili, uno per
 *          dolore). Titolo corto + 1 riga. Server component, zero JS, testo
 *          nell'HTML (P0-FC-2). Decorativo: nessun controllo, nessun ARIA extra
 *          (semantic HTML prima di ARIA). Hover = micro-feedback (transform/
 *          colore bordo), solo enhancement.
 */

export interface PainCardProps {
  /** Titolo-dolore corto (es. "Dati sparsi ovunque"). */
  title: string;
  /** Una riga di contesto (es. "Excel, email, WhatsApp che non si parlano"). */
  detail: string;
}

export default function PainCard({ title, detail }: PainCardProps) {
  return (
    <div className="reveal flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 transition-colors hover:border-[var(--accent-muted)]">
      <h3 className="text-base font-semibold leading-tight text-[var(--text-primary)]">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{detail}</p>
    </div>
  );
}
