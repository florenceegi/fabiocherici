/**
 * @package fabiocherici.com — StatCard
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 1.0.0
 * @date 2026-06-16
 * @purpose Card-stat visiva (numero grande + etichetta breve), modulo atomico
 *          del bento grid (direzione visiva 2026: "uno stat, un blocco"). Tre
 *          accenti: "bronze" = stat protagonista (riempita bronzo, usata per la
 *          leva 3-5 giorni), "outline" = stat di supporto (bordo), "ghost" =
 *          stat dentro un'altra card. Server component, zero JS: il numero è
 *          testo statico nell'HTML (P0-FC-2). Nessun elemento interattivo →
 *          target-size SC 2.5.8 (AA) non si applica qui. La classe .reveal è
 *          enhancement (GSAP), il contenuto è visibile di default.
 */

export interface StatCardProps {
  /** Numero/cifra protagonista (es. "30", "8", "3-5"). */
  value: string;
  /** Unità breve sotto il numero (es. "anni", "giorni"). Opzionale. */
  unit?: string;
  /** Etichetta breve sotto (1 riga, es. "di software dal 1995"). */
  label: string;
  /** Variante visiva. */
  variant?: 'bronze' | 'outline' | 'ghost';
}

export default function StatCard({ value, unit, label, variant = 'outline' }: StatCardProps) {
  const base = 'reveal flex flex-col gap-1 rounded-2xl p-6 sm:p-7';
  const skin =
    variant === 'bronze'
      ? 'bg-[var(--accent)] text-[var(--bg)]'
      : variant === 'ghost'
        ? 'bg-transparent'
        : 'border border-[var(--border)] bg-[var(--bg-card)]';

  const numberColor = variant === 'bronze' ? 'text-[var(--bg)]' : 'text-[var(--accent)]';
  const labelColor = variant === 'bronze' ? 'text-[var(--bg)]/80' : 'text-[var(--text-secondary)]';

  return (
    <div className={`${base} ${skin}`}>
      <p
        className={`font-[family-name:var(--font-display)] text-5xl font-light leading-none tracking-tight sm:text-6xl ${numberColor}`}
      >
        {value}
        {unit ? (
          <span className="ml-1.5 align-baseline text-2xl font-light sm:text-3xl">{unit}</span>
        ) : null}
      </p>
      <p className={`mt-2 text-sm leading-snug ${labelColor}`}>{label}</p>
    </div>
  );
}
