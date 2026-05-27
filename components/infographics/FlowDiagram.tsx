/**
 * @package fabiocherici.com — FlowDiagram
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-27
 * @purpose Flowchart gerarchico 2 livelli (fasi → sotto-step numerati).
 *          Desktop: N colonne affiancate (una per fase) + connettori →.
 *          Mobile: stacked verticale con ↓.
 *          WCAG AA: ordered list semantico <ol><li>, screen reader legge sequenza.
 */

export type FlowStep = {
  /** Numero globale del sotto-step (es. 1, 2, ..., 11) */
  number: number;
  /** Testo del sotto-step */
  text: string;
};

export type FlowPhase = {
  /** Etichetta fase mono uppercase (es. "FASE 2 — PROGETTAZIONE") */
  label: string;
  /** Sotto-step della fase */
  steps: FlowStep[];
};

export interface FlowDiagramProps {
  phases: FlowPhase[];
  ariaLabel?: string;
}

export default function FlowDiagram({ phases, ariaLabel }: FlowDiagramProps) {
  return (
    <ol
      aria-label={ariaLabel}
      className="reveal flex flex-col gap-8 md:grid md:gap-6"
      style={{
        gridTemplateColumns: `repeat(${phases.length}, minmax(0, 1fr))`,
      }}
    >
      {phases.map((phase, phaseIdx) => (
        <li key={phaseIdx} className="flex flex-col gap-3">
          <h3 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[var(--accent)]">
            {phase.label}
          </h3>
          <ol className="flex flex-col gap-2 border-t border-[var(--border-accent)] pt-3">
            {phase.steps.map((step) => (
              <li
                key={step.number}
                className="flex items-start gap-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-snug"
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 font-mono font-bold text-[var(--accent)] w-5"
                >
                  {step.number}.
                </span>
                <span>{step.text}</span>
              </li>
            ))}
          </ol>
          {phaseIdx < phases.length - 1 && (
            <span
              aria-hidden="true"
              className="text-[var(--text-muted)] text-center text-xl md:hidden"
            >
              ↓
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
