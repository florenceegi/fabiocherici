/**
 * @package fabiocherici.com — EgiShowcase tests
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-16
 * @purpose Test della vetrina opere reali con AUTO-ROTAZIONE (M-017 #3). fetch
 *          MOCKATO: verifica (1) shape {egis:[...]} → card-link reali con
 *          immagine + titolo + autore, target _blank rel noopener; (2) stato
 *          vuoto dignitoso su {egis:[]} o errore; (3) auto-rotazione crossfade
 *          su timer (active index cicla) quando reduced-motion è OFF; (4) NESSUNA
 *          rotazione quando prefers-reduced-motion è ON (statico, a11y P0-FC).
 *          getByRole, non getByTestId (testing-library best practice). matchMedia
 *          è mockato qui: jsdom non lo implementa.
 * @mission M-017
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import EgiShowcase from './EgiShowcase';

// Mock next-intl: traduzioni identità con interpolazione minima per i test.
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, vars?: Record<string, string>) => {
    if (key === 'showcase_open_aria') return `open ${vars?.title} by ${vars?.creator}`;
    if (key === 'showcase_by') return `by ${vars?.creator}`;
    return key;
  },
}));

function jsonResponse(data: unknown, ok = true): Response {
  return { ok, status: ok ? 200 : 500, json: async () => data } as unknown as Response;
}

/** Mock matchMedia (jsdom non lo implementa): reduced = match su prefers-reduced-motion. */
function mockMatchMedia(reduced: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: reduced && query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

const TWO_EGIS = [
  {
    title: 'Aurora',
    image_url: 'https://media.florenceegi.com/aurora.jpg',
    share_url: 'https://florenceegi.com/egi/aurora',
    creator_name: 'Maria',
  },
  {
    title: 'Notturno',
    image_url: 'https://media.florenceegi.com/notturno.jpg',
    share_url: 'https://florenceegi.com/egi/notturno',
    creator_name: 'Luca',
  },
];

describe('EgiShowcase', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockMatchMedia(false);
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('rende le opere reali come link a share_url con immagine e autore', async () => {
    const egis = [TWO_EGIS[0]];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ egis })));

    render(<EgiShowcase endpoint="https://nexus.example/showcase" opensNewTabLabel="new tab" />);

    const link = await screen.findByRole('link', { name: /open Aurora by Maria/ });
    expect(link).toHaveAttribute('href', 'https://florenceegi.com/egi/aurora');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    const img = screen.getByAltText('Aurora — Maria');
    expect(img).toHaveAttribute('src', 'https://media.florenceegi.com/aurora.jpg');
  });

  it('auto-ruota le opere: il crossfade cambia la card attiva sul timer', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ egis: TWO_EGIS })));
    vi.useFakeTimers({ shouldAdvanceTime: true });

    render(<EgiShowcase endpoint="https://nexus.example/showcase" opensNewTabLabel="new tab" />);

    // Stato iniziale: prima opera attiva (opacity 1), seconda nascosta (opacity 0).
    // La card inattiva è aria-hidden + tabIndex -1 (non ruba focus): la
    // raggiungiamo via immagine/titolo, non via getByRole('link').
    await screen.findByText('Aurora');
    const firstCell = screen.getByAltText('Aurora — Maria').closest('li');
    const secondCell = screen.getByAltText('Notturno — Luca').closest('li');
    expect(firstCell).toHaveStyle({ opacity: '1' });
    expect(secondCell).toHaveStyle({ opacity: '0' });

    // Avanza il timer di rotazione: la card attiva diventa la seconda.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000);
    });
    expect(firstCell).toHaveStyle({ opacity: '0' });
    expect(secondCell).toHaveStyle({ opacity: '1' });
  });

  it('NON auto-ruota con prefers-reduced-motion: opere statiche e scorribili', async () => {
    mockMatchMedia(true);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ egis: TWO_EGIS })));
    vi.useFakeTimers({ shouldAdvanceTime: true });

    render(<EgiShowcase endpoint="https://nexus.example/showcase" opensNewTabLabel="new tab" />);

    // Entrambe restano link reali e attivabili (nessun aria-hidden/tabindex -1).
    const first = await screen.findByRole('link', { name: /open Aurora by Maria/ });
    const second = screen.getByRole('link', { name: /open Notturno by Luca/ });
    const firstCell = first.closest('li');
    const secondCell = second.closest('li');

    // Entrambe le card restano visibili (nessun crossfade inline): scroll-snap.
    expect(firstCell).not.toHaveStyle({ opacity: '0' });
    expect(secondCell).not.toHaveStyle({ opacity: '0' });

    // Anche dopo il timer nulla cambia: niente auto-rotazione.
    await act(async () => {
      vi.advanceTimersByTime(8000);
    });
    expect(first).toBeInTheDocument();
    expect(second).toBeInTheDocument();
  });

  it('mostra lo stato vuoto dignitoso quando /showcase torna {egis:[]}', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ egis: [] })));

    render(<EgiShowcase endpoint="https://nexus.example/showcase" opensNewTabLabel="new tab" />);

    await waitFor(() => {
      expect(screen.getByText('showcase_empty')).toBeInTheDocument();
    });
    const fallback = screen.getByRole('link', { name: /showcase_empty_cta/ });
    expect(fallback).toHaveAttribute('href', 'https://florenceegi.com');
  });

  it('mostra lo stato vuoto se il fetch fallisce (nessun crash)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

    render(<EgiShowcase endpoint="https://nexus.example/showcase" opensNewTabLabel="new tab" />);

    await waitFor(() => {
      expect(screen.getByText('showcase_empty')).toBeInTheDocument();
    });
  });

  it('senza endpoint resta nello stato vuoto senza chiamare fetch', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    render(<EgiShowcase opensNewTabLabel="new tab" />);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.getByText('showcase_empty')).toBeInTheDocument();
  });
});
