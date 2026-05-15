/**
 * @package fabiocherici.com — Oracode Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Oracode paradigm deep-dive — pillars, P0 levels, 4 application tiers
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function OracodePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('oracode');

  const pillars = [
    { n: '1', name: 'Intenzionalita Esplicita', desc: 'Ogni file dichiara il suo scopo. Nessun codice esiste senza una ragione documentata.' },
    { n: '2', name: 'Semplicita Potenziante', desc: 'Nessuna astrazione prematura. Tre righe simili battono un pattern prematuro.' },
    { n: '3', name: 'Coerenza Semantica', desc: 'Terminologia unificata. Un concetto, un nome, ovunque.' },
    { n: '4', name: 'Circolarita Virtuosa', desc: 'Ogni bug diventa un test. Ogni feature diventa un pattern.' },
    { n: '5', name: 'Evoluzione Ricorsiva', desc: 'La documentazione si aggiorna automaticamente col codice.' },
    { n: '6', name: 'Sicurezza Proattiva', desc: 'GDPR, audit trail, gestione errori — integrati, non aggiunti dopo.' },
  ];

  const levels = [
    { level: '1', name: 'Applicazione singola', desc: 'Un progetto con regole P0, hook, firma. Gia significativo.' },
    { level: '2', name: 'Oracode in profondita', desc: 'Mission protocol, DOC-SYNC, agenti specializzati. Il progetto si auto-documenta.' },
    { level: '3', name: 'LSO mono-organo', desc: 'Sistema nervoso documentale. Il software conosce se stesso via RAG.' },
    { level: '4', name: 'LSO multi-organo', desc: 'Un ecosistema di progetti coordinati da un cervello centrale. FlorenceEGI.' },
  ];

  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            {t('subtitle')}
          </p>
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)] mb-8">
            {t('title')}
          </h1>
          <p className="reveal text-xl text-[var(--text-secondary)] leading-relaxed">
            {t('intro')}
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            I sei pilastri
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {pillars.map((p) => (
              <div key={p.n} className="reveal rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--accent)] text-sm font-mono text-[var(--accent)]">
                    {p.n}
                  </span>
                  <h3 className="text-base font-medium text-[var(--text-primary)]">{p.name}</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 levels */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-12">
            Quattro livelli di applicazione
          </h2>
          <div className="space-y-6">
            {levels.map((l) => (
              <div key={l.level} className="reveal flex items-start gap-6 border-l-2 border-[var(--accent-muted)] pl-6 py-2">
                <span className="text-3xl font-light font-mono text-[var(--accent)] flex-shrink-0">
                  {l.level}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-[var(--text-primary)] mb-1">{l.name}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGOLA ZERO */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            Regola Zero
          </h2>
          <p className="reveal font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-[var(--accent)] leading-relaxed">
            Se non sai, chiedi. Mai dedurre.
          </p>
          <p className="reveal mt-6 text-base text-[var(--text-secondary)]">
            La regola piu semplice e la piu violata. Un LLM che completa statisticamente inventa cio che non sa. Oracode lo blocca prima.
          </p>
        </div>
      </section>
    </div>
  );
}
