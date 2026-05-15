/**
 * @package fabiocherici.com — Ecosistema Page
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose The 9 FlorenceEGI organs — what they do, how they connect
 */

import { getTranslations, setRequestLocale } from 'next-intl/server';

const organs = [
  {
    name: 'EGI',
    role: 'Cuore operativo',
    desc: 'Creator economy, asset blockchain Algorand, servizi core condivisi (auth, payment, Egili). Host di Sigillo e futuri prodotti.',
    stack: 'Laravel 12 · PHP 8.3 · PostgreSQL · Algorand',
    url: 'art.florenceegi.com',
  },
  {
    name: 'EGI-HUB',
    role: 'Cervello frontale',
    desc: 'Unico SSOT per configurazione di tutti gli organi. Nessun organo si auto-configura. Autorita gerarchica assoluta.',
    stack: 'Laravel 12 · React · PostgreSQL',
    url: 'hub.florenceegi.com',
  },
  {
    name: 'EGI-HUB-HOME',
    role: 'Vetrina pubblica',
    desc: 'Punto di accesso 3D world-class all\'ecosistema. Integra Sigillo come entrypoint secondario.',
    stack: 'React · Three.js · TypeScript',
    url: 'florenceegi.com',
  },
  {
    name: 'NATAN_LOC',
    role: 'Organo cognitivo documentale',
    desc: 'RAG su atti della Pubblica Amministrazione + assistente AI per Comuni italiani. 56.000 documenti, 190.000 chunks vettoriali.',
    stack: 'Laravel 12 · FastAPI · pgvector · Claude',
    url: 'natan-loc.florenceegi.com',
  },
  {
    name: 'EGI-Credential',
    role: 'Wallet credenziali W3C',
    desc: 'Competenze professionali certificate su Algorand. 11 standard (SD-JWT, OID4VCI, EdDSA, DID:web, eIDAS 2.0).',
    stack: 'Node.js · Express · SD-JWT · Algorand',
    url: 'egi-credential.florenceegi.com',
  },
  {
    name: 'Sigillo',
    role: 'Certificazione blockchain',
    desc: 'Certificazione SHA-256 + Algorand + TSA RFC 3161 di qualsiasi file. Prova opponibile a terzi.',
    stack: 'React · Laravel (backend EGI) · Algorand · IPFS',
    url: 'egi-sigillo.florenceegi.com',
  },
  {
    name: 'La Bottega',
    role: 'Strumenti per artisti',
    desc: 'Maestro AI, 12 strumenti, 3 percorsi. Sviluppo artista come brand + valutazione informata per collezionisti.',
    stack: 'Laravel · React · Claude',
    url: 'la-bottega.florenceegi.com',
  },
  {
    name: 'EGI-INFO',
    role: 'SPA informativa',
    desc: 'Pagina pubblica informativa FlorenceEGI. Zero backend.',
    stack: 'React · TypeScript',
    url: 'info.florenceegi.com',
  },
  {
    name: 'CREATOR-STAGING',
    role: 'Configuratore siti creator',
    desc: 'Il creator sceglie template, animazione, scena 3D, subdomain. FlorenceEGI costruisce il sito.',
    stack: 'Next.js 15 · Three.js · GSAP · Sanity',
    url: 'creator-staging.florenceegi.com',
  },
];

export default async function EcosistemaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ecosistema');

  return (
    <div className="pt-24">
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
            {t('subtitle')}
          </p>
          <h1 className="reveal font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--text-primary)]">
            {t('title')}
          </h1>
        </div>
      </section>

      <section className="py-16 bg-[var(--bg-elevated)]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organs.map((o) => (
              <div
                key={o.name}
                className="reveal rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 hover:border-[var(--accent-muted)] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-[var(--accent)]">{o.name}</h3>
                  <span className="text-xs text-[var(--text-muted)] font-mono">{o.role}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{o.desc}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] font-mono">{o.stack}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shared infrastructure */}
      <section className="py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-sm font-mono uppercase tracking-widest text-[var(--text-muted)] mb-8">
            Infrastruttura condivisa
          </h2>
          <div className="reveal space-y-4 text-base text-[var(--text-secondary)] leading-relaxed">
            <p>Un singolo database PostgreSQL (AWS RDS) condiviso da tutti gli organi. Schema <code className="font-mono text-[var(--accent)] text-sm">core.*</code> con tabelle utenti, wallet, transazioni Egili, GDPR.</p>
            <p>Un sistema nervoso documentale (149 SSOT) indicizzato in un RAG piattaforma consultabile da ogni organo via sidebar AI.</p>
            <p>Un sistema economico interno (Egili) MiCA-safe che attraversa tutto l'ecosistema.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
