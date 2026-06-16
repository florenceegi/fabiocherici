/**
 * @package fabiocherici.com — RepoCard (card portfolio di un singolo progetto)
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 2.0.0 (riscrittura DAL CLIENTE — verdetto CEO M-016)
 * @date 2026-06-16
 * @purpose Modulo atomico del portfolio, ripensato per un imprenditore PMI non
 *          tecnico: in alto la DESCRIZIONE in linguaggio cliente (titolo della
 *          card), il nome-codice del repo come piccola etichetta mono SECONDARIA
 *          sotto, e in fondo le metriche reali (ore + righe se presenti) con un
 *          micro-indicatore visivo a barra proporzionale alle ore. Presentazionale
 *          puro: nessuno stato, nessun JS proprio. La classe `.reveal` è solo
 *          enhancement (stagger gestito da ScrollReveal globale) — il contenuto è
 *          VISIBILE di default (P0-FC-2). La barra è CSS `transform: scaleX`
 *          (compositor-only, zero layout shift, P0-FC-5). Decorativo: nessun
 *          controllo interattivo → target-size SC 2.5.8 (AA) non si applica.
 *          Hover-lift + glow bronzo = micro-feedback, solo enhancement; la barra
 *          è aria-hidden (le ore sono già esposte come testo accanto).
 */

export interface RepoCardData {
  /** Nome-codice del repo (etichetta mono secondaria). */
  name: string;
  /** Descrizione in linguaggio cliente (titolo della card). */
  purpose: string;
  /** Ore investite (sempre presente). */
  hours: number;
  /** Righe di codice — null se non disponibile (NON mostrare la riga). */
  lines: number | null;
}

export interface RepoCardProps extends RepoCardData {
  /** "988 h" già formattato dal padre (i18n-aware). */
  hoursLabel: string;
  /** "49.822 righe" già formattato dal padre, o null se lines mancante. */
  linesLabel: string | null;
  /** Frazione 0–1 delle ore rispetto al massimo del gruppo → larghezza barra. */
  hoursRatio: number;
}

export default function RepoCard({
  name,
  purpose,
  hoursLabel,
  linesLabel,
  hoursRatio,
}: RepoCardProps) {
  // Barra mai invisibile: minimo 8% per dare ritmo anche ai progetti più piccoli.
  const scaleX = Math.max(0.08, Math.min(1, hoursRatio));

  return (
    <article className="reveal group flex h-full flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:border-[var(--accent-muted)] hover:shadow-[0_8px_30px_var(--accent-glow)] sm:p-6">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold leading-snug text-[var(--text-primary)]">
          {purpose}
        </h3>
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--text-muted)]">
          {name}
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-3">
        {/* Micro-barra ore — compositor-friendly (scaleX), decorativa. */}
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-[var(--border)]"
          aria-hidden="true"
        >
          <div
            className="h-full origin-left rounded-full bg-[var(--accent)] opacity-70 transition-transform duration-300 ease-out group-hover:opacity-100"
            style={{ transform: `scaleX(${scaleX})` }}
          />
        </div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-xs text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--accent)]">{hoursLabel}</span>
          {linesLabel ? <span>{linesLabel}</span> : null}
        </div>
      </div>
    </article>
  );
}
