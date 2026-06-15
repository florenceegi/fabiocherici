/**
 * @package fabiocherici.com — EgiShowcase
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 3.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-16
 * @purpose Vetrina "prova-del-lavoro": opere REALI dell'ecosistema vivo
 *          FlorenceEGI. Fa fetch('/showcase') sullo STESSO origin del chat
 *          (Nexus proxy alle opere EGI reali) e le mostra in CAROSELLO che GIRA
 *          automaticamente (richiesta CEO M-017 #3, rif. UX free-ai "fade 5s"):
 *          crossfade di UNA card alla volta su timer (~4s), in loop. Effetto
 *          scelto: crossfade su `opacity` (compositor, no layout shift,
 *          web.dev/cls §97) — non scroll della striscia — così la rotazione non
 *          entra in conflitto con lo scroll manuale né ruba il focus.
 *          A11Y: sotto prefers-reduced-motion NESSUNA auto-rotazione (P0-FC-2,
 *          WCAG 2.2 §2.3.3 Animation from Interactions AAA + §2.2.2 Pause/Stop
 *          AA): tutte le card statiche, l'utente scorre a mano (scroll-snap).
 *          Auto-rotazione in PAUSA su hover/focus-within (mouse e tastiera) così
 *          l'utente clicca un'opera senza che scivoli via. Le card restano link
 *          reali a share_url (target _blank rel noopener), alt = titolo+autore.
 *          Shape risposta: {egis:[{title,image_url,share_url,creator_name}]}.
 *          Immagini su media.florenceegi.com → <img> nativo con width/height +
 *          aspect-ratio per anti-CLS (web.dev/cls §37; NO next/image: lo static
 *          export richiederebbe un loader). loading lazy. Stato vuoto/errore
 *          dignitoso: link onesto a florenceegi.com, nessun crash.
 * @mission M-017
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const FLORENCEEGI_URL = 'https://florenceegi.com';
/** Intervallo crossfade (ms). Rif. UX free-ai EGI "fade carosello 5s". */
const ROTATE_INTERVAL_MS = 4000;

interface ShowcaseItem {
  imageUrl: string;
  title: string;
  creatorName: string;
  shareUrl: string;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/** Estrae le opere dalla shape {egis:[{title,image_url,share_url,creator_name}]}. */
function parseItems(data: unknown): ShowcaseItem[] {
  const raw = isRecord(data) && Array.isArray(data.egis) ? data.egis : Array.isArray(data) ? data : [];
  const items: ShowcaseItem[] = [];
  for (const entry of raw) {
    if (!isRecord(entry)) continue;
    const imageUrl = typeof entry.image_url === 'string' ? entry.image_url : '';
    const shareUrl = typeof entry.share_url === 'string' ? entry.share_url : '';
    if (!imageUrl || !shareUrl) continue;
    items.push({
      imageUrl,
      shareUrl,
      title: typeof entry.title === 'string' ? entry.title : '',
      creatorName: typeof entry.creator_name === 'string' ? entry.creator_name : '',
    });
  }
  return items;
}

/** true se l'utente preferisce ridurre le animazioni (guard jsdom/SSR-safe). */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface EgiShowcaseProps {
  /** URL completo del proxy showcase (es. {base}/showcase); assente → stato vuoto. */
  endpoint?: string;
  /** Label "apre in nuova scheda" (i18n footer). */
  opensNewTabLabel: string;
}

export default function EgiShowcase({ endpoint, opensNewTabLabel }: EgiShowcaseProps) {
  const t = useTranslations('nexus');
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!endpoint) return;
    const controller = new AbortController();
    fetch(endpoint, { headers: { Accept: 'application/json' }, signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: unknown) => {
        const parsed = parseItems(data);
        if (parsed.length === 0) setFailed(true);
        else setItems(parsed);
      })
      .catch(() => setFailed(true));
    return () => controller.abort();
  }, [endpoint]);

  // Sincronizza la preferenza reduced-motion e reagisce ai cambi a runtime.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const hasItems = items.length > 0 && !failed;

  // Auto-rotazione: timer JS in useEffect con cleanup (no GSAP necessario).
  // Disattivata se: reduced-motion, ≤1 opera, o stato vuoto. In pausa su
  // hover/focus-within tramite pausedRef (no re-render, niente focus rubato).
  useEffect(() => {
    if (!hasItems || reduceMotion || items.length <= 1) return;
    if (prefersReducedMotion()) return; // doppia guard runtime
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setActive((prev) => (prev + 1) % items.length);
    }, ROTATE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [hasItems, reduceMotion, items.length]);

  // Reset indice quando cambia il set di opere (chiavi/lunghezza stabili).
  useEffect(() => {
    setActive(0);
  }, [items]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  // Con reduced-motion (o ≤1 opera) NON ruotiamo: striscia statica con
  // scroll-snap, tutte le card visibili e scorribili a mano.
  const rotating = hasItems && !reduceMotion && items.length > 1;

  return (
    <section
      aria-labelledby="nexus-showcase-heading"
      className="rounded-xl border p-4"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}
    >
      <h3
        id="nexus-showcase-heading"
        className="mb-3 font-[family-name:var(--font-display)] text-base text-[var(--text-primary)]"
      >
        {t('showcase_title')}
      </h3>

      {hasItems ? (
        // Crossfade (opacity, compositor) quando ruota; scroll-snap statico
        // sotto reduced-motion. In entrambi i casi le card sono link reali.
        // Pausa su hover/focus-within: l'utente clicca senza che scivoli via.
        <ul
          className={
            rotating
              ? 'nexus-showcase__stack relative'
              : 'nexus-showcase__track flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2'
          }
          aria-label={t('showcase_title')}
          aria-live="off"
          onMouseEnter={rotating ? pause : undefined}
          onMouseLeave={rotating ? resume : undefined}
          onFocusCapture={rotating ? pause : undefined}
          onBlurCapture={rotating ? resume : undefined}
        >
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <li
                key={item.shareUrl}
                className={rotating ? 'nexus-showcase__cell' : 'snap-start shrink-0'}
                style={
                  rotating
                    ? {
                        gridArea: '1 / 1',
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 600ms ease-in-out',
                        pointerEvents: isActive ? 'auto' : 'none',
                      }
                    : undefined
                }
                aria-hidden={rotating && !isActive ? true : undefined}
              >
                <a
                  href={item.shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block w-40 sm:w-44"
                  tabIndex={rotating && !isActive ? -1 : undefined}
                  aria-label={t('showcase_open_aria', { title: item.title, creator: item.creatorName })}
                >
                  <div
                    className="relative overflow-hidden rounded-lg"
                    style={{ aspectRatio: '4 / 3', backgroundColor: 'var(--bg-hover)' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- CDN cross-origin media.florenceegi.com, fuori dal loader next/image (static export) */}
                    <img
                      src={item.imageUrl}
                      alt={`${item.title} — ${item.creatorName}`}
                      width={176}
                      height={132}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className="nexus-showcase__img h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-2 truncate text-sm text-[var(--text-primary)]">{item.title}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">
                    {t('showcase_by', { creator: item.creatorName })}
                    <span className="sr-only"> ({opensNewTabLabel})</span>
                  </p>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        // Stato vuoto dignitoso: link onesto a florenceegi.com, niente buco.
        <div>
          <p className="mb-3 text-sm text-[var(--text-secondary)]">{t('showcase_empty')}</p>
          <a
            href={FLORENCEEGI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            {t('showcase_empty_cta')}
            <span aria-hidden="true">→</span>
            <span className="sr-only"> ({opensNewTabLabel})</span>
          </a>
        </div>
      )}
    </section>
  );
}
