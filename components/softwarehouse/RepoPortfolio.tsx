/**
 * @package fabiocherici.com — RepoPortfolio (portfolio dei 23 progetti, dal cliente)
 * @author FlorenceEGI (engineer-frontend) — fabiocherici.com
 * @version 2.0.0 (riscrittura DAL CLIENTE — verdetto CEO M-016)
 * @date 2026-06-16
 * @purpose DIMOSTRARE a un imprenditore PMI non tecnico cosa ha costruito
 *          FlorenceEGI: i 23 progetti reali RAGGRUPPATI in 5 categorie che il
 *          cliente capisce (Piattaforme online · Intelligenza artificiale · Siti
 *          su misura · Strumenti con cui costruiamo · Fondamenta), ciascuna con
 *          una intestazione e il conteggio del gruppo. Le card mostrano la
 *          DESCRIZIONE in linguaggio cliente (titolo) + nome-codice secondario +
 *          ore/righe reali con micro-barra. In cima i totali animati count-up
 *          (23 progetti · ~2.331 ore). I dati progetto sono DATI di dominio
 *          (nome/ore/righe/categoria verificati da EGI-STAT), non stringhe-UI →
 *          vivono in una `const` tipizzata qui; descrizioni, label e intestazioni
 *          passano via i18n (P0-FC-4, 7 lingue). Client component perché ospita
 *          CountUp (GSAP). Stagger d'ingresso delle card via ScrollReveal globale
 *          (.reveal). P0-FC-2: card e numeri sono nel markup, leggibili senza JS;
 *          animazione = enhancement. P0-FC-5: count-up e barre rispettano
 *          reduced-motion. Numeri formattati per-locale con Intl.NumberFormat.
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import RepoCard from './RepoCard';
import CountUp from './CountUp';

interface RepoData {
  name: string;
  hours: number;
  lines: number | null;
  /** Chiave categoria (raggruppamento) → tradotta in render. */
  categoryKey: CategoryKey;
  /** Chiave descrizione cliente → tradotta in render. */
  purposeKey: string;
}

type CategoryKey = 'platforms' | 'ai' | 'client_sites' | 'tools' | 'foundations';

/** Ordine di presentazione delle categorie (dal più rilevante per il cliente). */
const CATEGORY_ORDER: readonly CategoryKey[] = [
  'platforms',
  'ai',
  'client_sites',
  'tools',
  'foundations',
];

/**
 * Dati reali dei 23 progetti dell'ecosistema FlorenceEGI (fonte: EGI-STAT).
 * Ore/righe NON inventate. Mappa categorie = verdetto CEO M-016.
 */
const REPOS: readonly RepoData[] = [
  { name: 'EGI', hours: 988, lines: 49822, categoryKey: 'platforms', purposeKey: 'EGI' },
  { name: 'EGI-DOC', hours: 297, lines: 157668, categoryKey: 'foundations', purposeKey: 'EGI-DOC' },
  { name: 'NATAN_LOC', hours: 271, lines: null, categoryKey: 'ai', purposeKey: 'NATAN_LOC' },
  { name: 'EGI-HUB', hours: 142, lines: 3795, categoryKey: 'platforms', purposeKey: 'EGI-HUB' },
  { name: 'EGI-HUB-HOME-REACT', hours: 93, lines: null, categoryKey: 'foundations', purposeKey: 'EGI-HUB-HOME-REACT' },
  { name: 'EGI-Credential', hours: 89, lines: 27701, categoryKey: 'platforms', purposeKey: 'EGI-Credential' },
  { name: 'os3-matrix', hours: 70, lines: 85322, categoryKey: 'tools', purposeKey: 'os3-matrix' },
  { name: 'Fucina', hours: 47, lines: 90343, categoryKey: 'tools', purposeKey: 'Fucina' },
  { name: 'oracode', hours: 45, lines: 25424, categoryKey: 'tools', purposeKey: 'oracode' },
  { name: 'fabiocherici', hours: 40, lines: 21567, categoryKey: 'ai', purposeKey: 'fabiocherici' },
  { name: 'EGI-SIGILLO', hours: 39, lines: null, categoryKey: 'platforms', purposeKey: 'EGI-SIGILLO' },
  { name: 'CREATOR-STAGING', hours: 39, lines: null, categoryKey: 'tools', purposeKey: 'CREATOR-STAGING' },
  { name: 'EGI-STAT', hours: 39, lines: 3301, categoryKey: 'tools', purposeKey: 'EGI-STAT' },
  { name: 'Pinocapasso', hours: 35, lines: 32493, categoryKey: 'client_sites', purposeKey: 'Pinocapasso' },
  { name: 'EGI-INFO', hours: 32, lines: null, categoryKey: 'platforms', purposeKey: 'EGI-INFO' },
  { name: 'LA-BOTTEGA', hours: 26, lines: null, categoryKey: 'platforms', purposeKey: 'LA-BOTTEGA' },
  { name: 'le-vespe-cafe', hours: 13, lines: 3271, categoryKey: 'client_sites', purposeKey: 'le-vespe-cafe' },
  { name: 'DeepDebug', hours: 11, lines: 92485, categoryKey: 'ai', purposeKey: 'DeepDebug' },
  { name: 'FABIO-GIANNI', hours: 6, lines: null, categoryKey: 'client_sites', purposeKey: 'FABIO-GIANNI' },
  { name: 'FORTINO', hours: 3, lines: 5108, categoryKey: 'foundations', purposeKey: 'FORTINO' },
  { name: 'EGI-SALES', hours: 3, lines: null, categoryKey: 'foundations', purposeKey: 'EGI-SALES' },
  { name: 'EGI-HUB-HOME', hours: 2, lines: null, categoryKey: 'foundations', purposeKey: 'EGI-HUB-HOME' },
  { name: 'FlorenceEGI', hours: 1, lines: null, categoryKey: 'foundations', purposeKey: 'FlorenceEGI' },
] as const;

const PROJECT_COUNT = REPOS.length;
const TOTAL_HOURS = REPOS.reduce((sum, r) => sum + r.hours, 0);

/** Raggruppa i progetti per categoria nell'ordine di presentazione. */
const GROUPS: readonly { key: CategoryKey; repos: RepoData[]; maxHours: number }[] =
  CATEGORY_ORDER.map((key) => {
    const repos = REPOS.filter((r) => r.categoryKey === key);
    const maxHours = repos.reduce((m, r) => Math.max(m, r.hours), 1);
    return { key, repos, maxHours };
  });

function TotalCard({
  children,
  label,
  highlight = false,
}: {
  children: React.ReactNode;
  label: string;
  highlight?: boolean;
}) {
  const border = highlight ? 'border-[var(--accent-muted)] bg-[var(--accent-glow)]' : 'border-[var(--border)] bg-[var(--bg-card)]';
  return (
    <div className={`flex flex-col justify-center gap-1 rounded-2xl border ${border} p-6`}>
      <dd className="font-[family-name:var(--font-display)] text-4xl font-light leading-none tracking-tight text-[var(--accent)] sm:text-5xl">
        {children}
      </dd>
      <dt className="mt-2 text-sm text-[var(--text-secondary)]">{label}</dt>
    </div>
  );
}

export default function RepoPortfolio() {
  const t = useTranslations('softwarehouse');
  const locale = useLocale();

  const nf = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const formatInt = useCallback((n: number) => nf.format(n), [nf]);

  return (
    <section
      id="portfolio"
      className="py-24 bg-[var(--bg-elevated)]"
      aria-labelledby="portfolio-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <p className="reveal text-sm font-mono uppercase tracking-widest text-[var(--accent)] mb-4">
          {t('portfolio_label')}
        </p>
        <h2
          id="portfolio-heading"
          className="reveal font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[var(--text-primary)] mb-6"
        >
          {t('portfolio_title')}
        </h2>
        <p className="reveal mb-10 max-w-3xl text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
          {t('portfolio_intro')}
        </p>

        {/* Totali — count-up allo scroll (reduced-motion → valore finale statico) */}
        <dl className="reveal mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TotalCard label={t('portfolio_total_projects')}>
            <CountUp value={PROJECT_COUNT} format={formatInt} />
          </TotalCard>
          <TotalCard label={t('portfolio_total_hours')}>
            <CountUp value={TOTAL_HOURS} format={formatInt} prefix="~" />
          </TotalCard>
          <div className="flex flex-col justify-center gap-1 rounded-2xl border border-[var(--accent-muted)] bg-[var(--accent-glow)] p-6">
            <dd className="font-[family-name:var(--font-display)] text-2xl font-light leading-tight text-[var(--text-primary)] sm:text-3xl">
              {t('portfolio_total_alive')}
            </dd>
          </div>
        </dl>

        {/* Gruppi per categoria — heading + conteggio, poi griglia di card */}
        <div className="flex flex-col gap-14">
          {GROUPS.map((group) => (
            <div key={group.key}>
              <div className="reveal mb-6 flex items-baseline gap-3 border-b border-[var(--border)] pb-3">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-light tracking-tight text-[var(--text-primary)] sm:text-2xl">
                  {t(`portfolio_cat_${group.key}`)}
                </h3>
                <span className="rounded-full bg-[var(--accent-muted)] px-3 py-0.5 text-xs font-mono uppercase tracking-wider text-[var(--accent)]">
                  {t('portfolio_cat_count', { count: group.repos.length })}
                </span>
              </div>
              <ul data-sw="stagger" role="list" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.repos.map((repo) => (
                  <li key={repo.name}>
                    <RepoCard
                      name={repo.name}
                      purpose={t(`portfolio_purpose_${repo.purposeKey}`)}
                      hours={repo.hours}
                      lines={repo.lines}
                      hoursRatio={repo.hours / group.maxHours}
                      hoursLabel={t('portfolio_hours', { count: formatInt(repo.hours) })}
                      linesLabel={
                        repo.lines !== null
                          ? t('portfolio_lines', { count: formatInt(repo.lines) })
                          : null
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
