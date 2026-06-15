/**
 * @package fabiocherici.com — useNexusStream tests
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Test dell'hook SSE con fetch + ReadableStream MOCKATI (niente rete).
 *          Verifica: mappatura start/chunk/complete, gestione 429 (rate_limit),
 *          errore di rete. Throttle via rAF stubbato sincrono. M-017.
 * @mission M-017
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useNexusStream } from './useNexusStream';
import type { NexusStreamHandlers } from './useNexusStream';

/** Costruisce una Response mock con corpo SSE da una stringa. */
function sseResponse(body: string, init?: { ok?: boolean; status?: number }): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(body));
      controller.close();
    },
  });
  return {
    ok: init?.ok ?? true,
    status: init?.status ?? 200,
    body: stream,
  } as unknown as Response;
}

function makeHandlers(): NexusStreamHandlers & {
  contents: string[];
  errors: string[];
  completed: number;
} {
  const contents: string[] = [];
  const errors: string[] = [];
  let completed = 0;
  return {
    contents,
    errors,
    get completed() {
      return completed;
    },
    onContent: (full) => contents.push(full),
    onComplete: () => {
      completed += 1;
    },
    onError: (code) => errors.push(code),
  };
}

beforeEach(() => {
  // rAF sincrono per testare il flush throttlato in modo deterministico.
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useNexusStream', () => {
  it('mappa start/chunk/complete e accumula il testo', async () => {
    const sse =
      'event: start\ndata: {"session_id":"s9"}\n\n' +
      'event: chunk\ndata: {"content":"Ciao"}\n\n' +
      'event: chunk\ndata: {"content":" mondo"}\n\n' +
      'event: complete\ndata: {}\n\n';
    const fetchMock = vi.fn().mockResolvedValue(sseResponse(sse));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useNexusStream('https://nexus.example'));
    const h = makeHandlers();
    const onStart = vi.fn();

    await act(async () => {
      await result.current.send({
        body: { message: 'hi', session_id: 's0', conversation_history: [] },
        handlers: { ...h, onStart },
      });
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://nexus.example/chat',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(onStart).toHaveBeenCalledWith('s9');
    expect(h.contents.at(-1)).toBe('Ciao mondo');
    expect(h.completed).toBe(1);
    expect(h.errors).toEqual([]);
  });

  it('mappa HTTP 429 a rate_limit', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(sseResponse('', { ok: false, status: 429 })));
    const { result } = renderHook(() => useNexusStream('https://nexus.example'));
    const h = makeHandlers();
    await act(async () => {
      await result.current.send({
        body: { message: 'x', session_id: 's', conversation_history: [] },
        handlers: h,
      });
    });
    expect(h.errors).toEqual(['rate_limit']);
    expect(h.completed).toBe(0);
  });

  it('mappa un fetch rifiutato a network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const { result } = renderHook(() => useNexusStream('https://nexus.example'));
    const h = makeHandlers();
    await act(async () => {
      await result.current.send({
        body: { message: 'x', session_id: 's', conversation_history: [] },
        handlers: h,
      });
    });
    expect(h.errors).toEqual(['network']);
  });

  it('mappa HTTP 500 a server error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(sseResponse('', { ok: false, status: 500 })));
    const { result } = renderHook(() => useNexusStream('https://nexus.example'));
    const h = makeHandlers();
    await act(async () => {
      await result.current.send({
        body: { message: 'x', session_id: 's', conversation_history: [] },
        handlers: h,
      });
    });
    expect(h.errors).toEqual(['server']);
  });
});
