/**
 * @package fabiocherici.com — LiveSiteStats
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-11
 * @purpose Widget cantiere aperto LIVE (design M-015 §C). UNA fetch per mount
 *          (no polling: rate-limit 10r/m + cache 60s), stato discriminato
 *          loading/error/success, validazione difensiva della shape.
 *          Fallback testuale server-renderizzato SENZA numeri (P0-FC-2, vincolo
 *          CEO zero placeholder). Count-up GSAP via import() dentro useEffect
 *          (P0-FC-1), una tantum quando in viewport, disattivato con reduced
 *          motion. aria-live SOLO sul messaggio di stato (SC 4.1.3 AA), MAI
 *          sui counter: il valore finale è leggibile via sr-only.
 *          min-height riservata = anti-CLS (P0-FC-5).
 * @mission M-015
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const STATS_ENDPOINT = 'https://stat.florenceegi.com/api/public/site-stats';
const FETCH_TIMEOUT_MS = 8000;
const COUNTUP_DURATION_S = 1.2;
const IN_VIEW_THRESHOLD = 0.3;

interface SiteStats {
  generated_at: string;
  hours_total: number;
  hours_last_7_days: number;
  projects_total: number;
  projects_active_30d: number;
  lines_net_total: number;
  last_activity: string;
}

type StatsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; data: SiteStats };

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/** Validazione difensiva: campi mancanti o non numerici ⇒ null (mai NaN a schermo). */
function parseSiteStats(payload: unknown): SiteStats | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const p = payload as Record<string, unknown>;
  if (
    !isFiniteNumber(p.hours_total) ||
    !isFiniteNumber(p.hours_last_7_days) ||
    !isFiniteNumber(p.projects_total) ||
    !isFiniteNumber(p.projects_active_30d) ||
    !isFiniteNumber(p.lines_net_total) ||
    !isNonEmptyString(p.generated_at) ||
    !isNonEmptyString(p.last_activity)
  ) {
    return null;
  }
  return {
    generated_at: p.generated_at,
    hours_total: p.hours_total,
    hours_last_7_days: p.hours_last_7_days,
    projects_total: p.projects_total,
    projects_active_30d: p.projects_active_30d,
    lines_net_total: p.lines_net_total,
    last_activity: p.last_activity,
  };
}

function formatNumber(locale: string, value: number, decimals: number): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: decimals }).format(value);
}

function formatDate(locale: string, iso: string, withTime: boolean): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(
    locale,
    withTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' },
  ).format(date);
}

/** Singola stat: numero animato solo visivo, valore finale stabile per screen reader. */
function StatItem({
  label,
  value,
  decimals,
  locale,
  size,
}: {
  label: string;
  value: number;
  decimals: number;
  locale: string;
  size: 'lg' | 'md' | 'sm';
}) {
  const formatted = formatNumber(locale, value, decimals);
  const valueClass =
    size === 'lg'
      ? 'font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-light text-[var(--accent)]'
      : size === 'md'
        ? 'font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-light text-[var(--text-primary)]'
        : 'font-mono text-base text-[var(--text-secondary)]';

  return (
    <div role="group" aria-label={`${label}: ${formatted}`} className="flex flex-col gap-1">
      <span aria-hidden="true" data-countup={value} data-decimals={decimals} className={valueClass}>
        {formatted}
      </span>
      <span className="sr-only">{formatted}</span>
      <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
        {label}
      </span>
    </div>
  );
}

export default function LiveSiteStats() {
  const t = useTranslations('softwarehouse');
  const locale = useLocale();
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<StatsState>({ status: 'loading' });
  const gridRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  // UNA fetch per mount, cleanup ignore-stale (react.dev "You Might Not Need an Effect").
  useEffect(() => {
    let ignore = false;
    fetch(STATS_ENDPOINT, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<unknown>;
      })
      .then((payload) => {
        if (ignore) return;
        const data = parseSiteStats(payload);
        setState(data ? { status: 'success', data } : { status: 'error' });
      })
      .catch(() => {
        if (!ignore) setState({ status: 'error' });
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Count-up GSAP: solo su success, in viewport, una tantum, mai con reduced motion.
  useEffect(() => {
    if (state.status !== 'success' || hasAnimatedRef.current) return;
    if (reducedMotion) {
      hasAnimatedRef.current = true; // valori finali già renderizzati
      return;
    }
    const grid = gridRef.current;
    if (!grid) return;

    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        obs.disconnect();
        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;
        import('gsap').then(({ default: gsap }) => {
          if (cancelled) return;
          grid.querySelectorAll<HTMLElement>('[data-countup]').forEach((el) => {
            const target = Number(el.dataset.countup);
            const decimals = Number(el.dataset.decimals ?? '0');
            if (!Number.isFinite(target)) return;
            const counter = { value: 0 };
            el.textContent = formatNumber(locale, 0, decimals);
            gsap.to(counter, {
              value: target,
              duration: COUNTUP_DURATION_S,
              ease: 'power1.out',
              onUpdate: () => {
                el.textContent = formatNumber(locale, counter.value, decimals);
              },
              onComplete: () => {
                el.textContent = formatNumber(locale, target, decimals);
              },
            });
          });
        });
      },
      { threshold: IN_VIEW_THRESHOLD },
    );
    observer.observe(grid);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [state, reducedMotion, locale]);

  return (
    <div className="min-h-[26rem] sm:min-h-[20rem] md:min-h-[18rem] rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8">
      {/* Live region montata dall'inizio: SOLO messaggi di stato (SC 4.1.3 AA). */}
      <p aria-live="polite" className="text-sm text-[var(--text-muted)] italic min-h-[1.25rem]">
        {state.status === 'loading' && t('live_loading')}
        {state.status === 'error' && t('live_error')}
      </p>

      {state.status !== 'success' && (
        <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed">
          {t('live_fallback')}
        </p>
      )}

      {state.status === 'success' && (
        <div ref={gridRef} className="mt-4 flex flex-col gap-8">
          {/* Riga 1 — protagonista: ore (SSOT §3 r1, mai LOC-first) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatItem
              label={t('live_hours_label')}
              value={state.data.hours_total}
              decimals={1}
              locale={locale}
              size="lg"
            />
            <StatItem
              label={t('live_hours_week_label')}
              value={state.data.hours_last_7_days}
              decimals={1}
              locale={locale}
              size="lg"
            />
          </div>
          <p className="-mt-6 text-xs text-[var(--text-muted)]">{t('live_hours_note')}</p>

          {/* Riga 2 — progetti + ultima attività */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatItem
              label={t('live_projects_label')}
              value={state.data.projects_total}
              decimals={0}
              locale={locale}
              size="md"
            />
            <StatItem
              label={t('live_projects_active_label')}
              value={state.data.projects_active_30d}
              decimals={0}
              locale={locale}
              size="md"
            />
            <div className="flex flex-col gap-1">
              <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-light text-[var(--text-primary)]">
                {formatDate(locale, state.data.last_activity, false)}
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                {t('live_last_activity_label')}
              </span>
            </div>
          </div>

          {/* Riga 3 — SECONDARIA: righe nette, corpo minore, mai in apertura (SSOT §4.1) */}
          <div className="border-t border-[var(--border)] pt-4">
            <StatItem
              label={t('live_lines_label')}
              value={state.data.lines_net_total}
              decimals={0}
              locale={locale}
              size="sm"
            />
          </div>

          {/* Footer — trasparenza del dato (NN/g #1: visibility of system status) */}
          <p className="text-xs text-[var(--text-muted)]">
            {t('live_updated_label')}: {formatDate(locale, state.data.generated_at, true)}
          </p>
        </div>
      )}
    </div>
  );
}
