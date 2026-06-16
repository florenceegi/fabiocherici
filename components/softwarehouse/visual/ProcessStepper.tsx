/**
 * @package fabiocherici.com — ProcessStepper
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 1.0.0
 * @date 2026-06-16
 * @purpose Stepper visivo a 4 passi (sezione "Come lavoriamo"): il processo
 *          diventa una sequenza orizzontale con numeri grandi bronzo + connettori,
 *          non un elenco di prosa. Resta una <ol> semantica (ordine = significato,
 *          WCAG 1.3.1 struttura), i numeri grandi sono decorativi (aria-hidden) e
 *          il valore ordinale è già nella lista. Su mobile = colonna; da sm =
 *          griglia 4 colonne. Server component, zero JS, testo nell'HTML
 *          (P0-FC-2). Connettori = pseudo-bordo, no layout shift (P0-FC-5).
 */

export interface ProcessStep {
  /** Titolo corto del passo (es. "Ci racconti"). */
  title: string;
  /** Descrizione breve (1-2 righe). */
  desc: string;
}

export interface ProcessStepperProps {
  steps: readonly ProcessStep[];
}

export default function ProcessStepper({ steps }: ProcessStepperProps) {
  return (
    <ol data-sw="stepper" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="reveal relative flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6"
        >
          <span
            aria-hidden="true"
            className="font-[family-name:var(--font-display)] text-5xl font-light leading-none text-[var(--accent)]"
          >
            {i + 1}
          </span>
          <h3 className="text-base font-semibold leading-tight text-[var(--text-primary)]">
            {step.title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{step.desc}</p>
        </li>
      ))}
    </ol>
  );
}
