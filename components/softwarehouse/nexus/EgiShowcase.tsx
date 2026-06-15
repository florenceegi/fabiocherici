/**
 * @package fabiocherici.com — EgiShowcase
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Vetrina "prova-del-lavoro": opere REALI dell'ecosistema vivo
 *          FlorenceEGI (correzione CEO M-017 #2). Fa fetch('/showcase') sullo
 *          STESSO origin del chat (derivato dall'endpoint base in NexusWidget,
 *          Nexus fa da proxy alle opere EGI reali) e rende una STRISCIA/CAROSELLO
 *          che scorre: card con immagine (image_url), titolo (title), autore
 *          (creator_name) e link a share_url (target _blank rel noopener). Shape
 *          risposta: {egis:[{title,image_url,share_url,creator_name}]}.
 *          Immagini su media.florenceegi.com → <img> nativo con width/height +
 *          aspect-ratio per anti-CLS (web.dev/cls §37; NO next/image: lo static
 *          export richiederebbe un loader). loading="lazy", scorrimento CSS
 *          (transform/translateX → compositor, no layout shift; web.dev/cls §97),
 *          fermo sotto prefers-reduced-motion. Stato vuoto/errore dignitoso:
 *          link onesto a florenceegi.com, nessun crash, log a console silenzioso.
 * @mission M-017
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const FLORENCEEGI_URL = 'https://florenceegi.com';

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

  const hasItems = items.length > 0 && !failed;

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
        // Striscia che scorre: scroll-snap nativo (tastiera/touch) + drift CSS su
        // hover-pausa. Le card sono link reali a share_url. <img> nativo per lo
        // static export (no loader next/image), dimensioni esplicite → no CLS.
        <ul
          className="nexus-showcase__track flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
          aria-label={t('showcase_title')}
        >
          {items.map((item, i) => (
            <li key={item.shareUrl} className="snap-start shrink-0">
              <a
                href={item.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-40 sm:w-44"
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
          ))}
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
