/**
 * @package fabiocherici.com — Prove Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Detailed evidence page — numbers, audit links, methodology
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function ProvePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('prove');

  const bigNumbers = [
    { value: '1.002.558', label: 'Righe di codice' },
    { value: '9', label: 'Piattaforme in produzione' },
    { value: '11', label: 'Linguaggi' },
    { value: '5.354', label: 'File' },
    { value: '8.686', label: 'Simboli pubblici catalogati' },
    { value: '1', label: 'Persona' },
  ];

  const projects = [
    {
      name: 'Sigillo',
      what: 'Certificazione blockchain di file — SHA-256 + Algorand + TSA RFC 3161',
      hours: '38-44h effettive',
      lines: '17.100 righe',
      integrations: 'Algorand, Stripe, IPFS, TSA, AI advisor',
      firstCommit: '23 marzo 2026',
      comparison: 'Un team tradizionale: 4-6 sviluppatori, 6-12 mesi.',
    },
    {
      name: 'EGI-Credential',
      what: 'Wallet credenziali professionali W3C — 11 standard (SD-JWT, OID4VCI, EdDSA, DID:web, eIDAS 2.0)',
      hours: '~78h 30min (54 sessioni misurate)',
      lines: '45.400 righe su 5 componenti',
      integrations: '11 standard implementati',
      firstCommit: '24 marzo 2026',
      comparison: 'Stesso livello di compliance di Microsoft Entra Verified ID — team 50-100 ingegneri, 3+ anni.',
    },
    {
      name: 'Gialloro Firenze',
      what: 'E-commerce luxury + CMS headless — Laravel + React + MariaDB',
      hours: '16h 17min (21 commit, 4 sessioni)',
      lines: '18.455 righe',
      integrations: 'SEO ottimizzato, WCAG AA, deploy completo',
      firstCommit: '3 giorni calendario',
      comparison: 'Due giorni per costruire. Un giorno per SEO, accessibility e deploy.',
    },
  ];

  return (
    <div className="pt-24">
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            {t('subtitle')}
          </p>
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)] mb-8">
            {t('title')}
          </h1>
        </div>
      </section>

      {/* Big numbers grid */}
      <section className="py-16 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {bigNumbers.map((n) => (
              <div key={n.label} className="reveal text-center">
                <span className="block text-4xl md:text-5xl font-light font-mono text-[var(--accent)]">
                  {n.value}
                </span>
                <span className="text-sm text-[var(--text-muted)] uppercase tracking-wider mt-2 block">
                  {n.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project details */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-6 space-y-16">
          {projects.map((p) => (
            <div key={p.name} className="reveal border-l-2 border-[var(--accent)] pl-8">
              <h3 className="text-2xl font-[family-name:var(--font-display)] text-[var(--accent)] mb-2">{p.name}</h3>
              <p className="text-base text-[var(--text-secondary)] mb-6">{p.what}</p>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div><span className="text-[var(--text-muted)]">Ore effettive:</span> <span className="text-[var(--text-primary)]">{p.hours}</span></div>
                <div><span className="text-[var(--text-muted)]">Codice:</span> <span className="text-[var(--text-primary)]">{p.lines}</span></div>
                <div><span className="text-[var(--text-muted)]">Integrazioni:</span> <span className="text-[var(--text-primary)]">{p.integrations}</span></div>
                <div><span className="text-[var(--text-muted)]">Primo commit:</span> <span className="text-[var(--text-primary)]">{p.firstCommit}</span></div>
              </div>
              <p className="mt-6 text-sm text-[var(--text-secondary)] italic">{p.comparison}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="py-24 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            Metodologia
          </h2>
          <div className="reveal space-y-4 text-base text-[var(--text-secondary)] leading-relaxed">
            <p>Tutte le ore sono misurate da sessioni git verificabili: primo commit — ultimo commit per sessione, con tolleranza di 15 minuti pre/post.</p>
            <p>Le righe di codice sono contate con cloc su codebase pulite (esclusi node_modules, vendor, build artifacts).</p>
            <p>I dati di confronto con team tradizionali sono stime conservative basate su industry benchmarks pubblici per progetti di complessita equivalente.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
