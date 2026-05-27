/**
 * @package fabiocherici.com — EvidenceBox
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-27
 * @purpose Box prova autentica con citazioni letterali + risposta opzionale azienda.
 *          Pattern semantico <blockquote> + <cite>, stelle SVG inline, WCAG AA.
 *          Trasparenza: include risposte azienda dove esistono, nota assenza dove no.
 */

import type { ReactNode } from 'react';

export type EvidenceReply = {
  /** Testo risposta azienda */
  text: string;
  /** Data risposta (es. "17 mag 2026") */
  date?: string;
  /** Etichetta "Risposta {company}:" */
  label: string;
};

export type EvidenceReview = {
  stars: number;
  date: string;
  author: string;
  company: string;
  quote: string;
  /** URL profilo Trustpilot azienda (per blockquote cite) */
  sourceUrl?: string;
  /** Risposta azienda (presente o esplicito assente con nota) */
  reply?: EvidenceReply;
  /** Nota "nessuna risposta" se reply assente (es. "Nessuna risposta. Trustpilot segnala...") */
  noReplyNote?: string;
  /** Caption lingua originale (es. "(recensione in italiano, profilo Trustpilot italiano)") */
  languageCaption?: string;
};

export type EvidenceCtaLink = {
  label: string;
  url: string;
};

export interface EvidenceBoxProps {
  label: string;
  title: string;
  reviews: EvidenceReview[];
  ctaIntro: string;
  ctaTotal?: string;
  ctaLinks: EvidenceCtaLink[];
  ariaLabel?: string;
}

function StarRow({ count }: { count: number }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span
      aria-label={`${count} stelle su 5`}
      className="inline-flex gap-0.5 align-middle"
      role="img"
    >
      {stars.map((s) => (
        <svg
          key={s}
          viewBox="0 0 24 24"
          width="14"
          height="14"
          className={s <= count ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]/30'}
          fill="currentColor"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

export default function EvidenceBox({
  label,
  title,
  reviews,
  ctaIntro,
  ctaTotal,
  ctaLinks,
  ariaLabel,
}: EvidenceBoxProps) {
  return (
    <section
      aria-label={ariaLabel || label}
      className="reveal rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8"
    >
      <p className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[var(--accent)] mb-3">
        {label}
      </p>
      <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl text-[var(--text-primary)] leading-snug mb-8">
        {title}
      </h3>

      <ol className="space-y-8">
        {reviews.map((r, i) => (
          <li key={i} className="border-l-2 border-[var(--accent-muted)] pl-5 sm:pl-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
              <StarRow count={r.stars} />
              <span className="text-[10px] sm:text-xs font-mono text-[var(--text-muted)]">
                {r.date}
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-[var(--text-muted)]">
                —
              </span>
              <cite className="text-xs sm:text-sm not-italic text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">{r.author}</span>
                {', su '}
                {r.sourceUrl ? (
                  <a
                    href={r.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-2"
                  >
                    {r.company}
                    <span className="sr-only">, opens in new tab</span>
                  </a>
                ) : (
                  <span>{r.company}</span>
                )}
              </cite>
            </div>

            <blockquote
              cite={r.sourceUrl}
              className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed italic"
            >
              &ldquo;{r.quote}&rdquo;
            </blockquote>

            {r.languageCaption && (
              <p className="mt-2 text-[10px] sm:text-xs text-[var(--text-muted)]">
                {r.languageCaption}
              </p>
            )}

            {r.reply ? (
              <aside className="mt-4 pl-4 border-l-2 border-[var(--border-accent)] text-xs sm:text-sm">
                <p className="font-mono uppercase tracking-wider text-[10px] sm:text-xs text-[var(--text-muted)] mb-1">
                  {r.reply.label}
                  {r.reply.date && (
                    <span className="ml-2 normal-case tracking-normal">· {r.reply.date}</span>
                  )}
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  &ldquo;{r.reply.text}&rdquo;
                </p>
              </aside>
            ) : r.noReplyNote ? (
              <aside className="mt-4 pl-4 border-l-2 border-[#8B4A4A]/40 text-xs sm:text-sm">
                <p className="text-[var(--text-muted)] italic leading-relaxed">
                  {r.noReplyNote}
                </p>
              </aside>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-10 pt-6 border-t border-[var(--border)] text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
        <p>
          {ctaIntro}{' '}
          {ctaLinks.map((link, i) => (
            <span key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline underline-offset-4"
              >
                {link.label}
                <span className="sr-only">, opens in new tab</span>
              </a>
              {i < ctaLinks.length - 1 ? ' · ' : ''}
            </span>
          ))}
          {ctaTotal && <span className="text-[var(--text-muted)]"> {ctaTotal}</span>}
        </p>
      </div>
    </section>
  );
}
