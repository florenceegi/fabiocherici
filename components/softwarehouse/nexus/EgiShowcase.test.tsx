/**
 * @package fabiocherici.com — EgiShowcase tests
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Test della vetrina opere reali (correzione CEO M-017 #2). fetch
 *          MOCKATO: verifica (1) che la shape {egis:[...]} renda card-link reali
 *          con immagine + titolo + autore e target _blank rel noopener; (2) lo
 *          stato vuoto dignitoso quando /showcase torna {egis:[]} o fallisce.
 *          getByRole, non getByTestId (testing-library best practice).
 * @mission M-017
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
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

describe('EgiShowcase', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => cleanup());

  it('rende le opere reali come link a share_url con immagine e autore', async () => {
    const egis = [
      {
        title: 'Aurora',
        image_url: 'https://media.florenceegi.com/aurora.jpg',
        share_url: 'https://florenceegi.com/egi/aurora',
        creator_name: 'Maria',
      },
    ];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ egis })));

    render(<EgiShowcase endpoint="https://nexus.example/showcase" opensNewTabLabel="new tab" />);

    const link = await screen.findByRole('link', { name: /open Aurora by Maria/ });
    expect(link).toHaveAttribute('href', 'https://florenceegi.com/egi/aurora');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    const img = screen.getByAltText('Aurora — Maria');
    expect(img).toHaveAttribute('src', 'https://media.florenceegi.com/aurora.jpg');
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
