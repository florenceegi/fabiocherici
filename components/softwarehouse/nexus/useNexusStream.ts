/**
 * @package fabiocherici.com — useNexusStream
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Hook che esegue POST {endpoint}/chat e legge lo stream SSE mappando
 *          i 4 eventi start/chunk/complete/error (contratto M-017). Isola la
 *          logica di rete (SRP). Gestione 429 (rate-limit) dedicata, abort su
 *          unmount, throttle del re-render via requestAnimationFrame per non
 *          saturare il main thread ad ogni chunk (INP — web.dev/inp input delay
 *          da long task). Nessuna PII nei log (GDPR-aware, design §4 ULM).
 * @mission M-017
 */

'use client';

import { useCallback, useEffect, useRef } from 'react';
import { SseParser } from '@/lib/nexus/sse-parser';
import type { ChatRequestBody, NexusErrorCode } from '@/lib/nexus/types';

/** Callback emessi dall'hook verso il componente chat. */
export interface NexusStreamHandlers {
  onStart?: (sessionId: string) => void;
  /** Chiamato (throttlato) col TESTO COMPLETO accumulato finora. */
  onContent: (fullText: string) => void;
  onComplete: () => void;
  onError: (code: NexusErrorCode) => void;
}

export interface SendArgs {
  body: ChatRequestBody;
  handlers: NexusStreamHandlers;
}

export interface UseNexusStreamResult {
  send: (args: SendArgs) => Promise<void>;
  abort: () => void;
}

/** Mappa lo status HTTP / errore di rete a un codice errore i18n. */
function classifyHttpError(status: number): NexusErrorCode {
  if (status === 429) return 'rate_limit';
  return 'server';
}

export function useNexusStream(endpoint: string): UseNexusStreamResult {
  const abortRef = useRef<AbortController | null>(null);
  const rafRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    cleanup();
  }, [cleanup]);

  useEffect(() => abort, [abort]);

  const send = useCallback(
    async ({ body, handlers }: SendArgs): Promise<void> => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const url = `${endpoint.replace(/\/$/, '')}/chat`;
      let response: Response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
      } catch (err) {
        if (controller.signal.aborted) return;
        handlers.onError('network');
        return;
      }

      if (!response.ok || !response.body) {
        handlers.onError(classifyHttpError(response.status));
        return;
      }

      const parser = new SseParser();
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let pendingFlush = false;
      let completed = false;
      let erroredCode: NexusErrorCode | null = null;

      // Throttle: applica gli aggiornamenti di testo al massimo una volta
      // per frame, evitando un re-render per singolo carattere (INP).
      const scheduleFlush = (): void => {
        if (pendingFlush) return;
        pendingFlush = true;
        rafRef.current = requestAnimationFrame(() => {
          pendingFlush = false;
          rafRef.current = null;
          handlers.onContent(fullText);
        });
      };

      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const events = parser.push(decoder.decode(value, { stream: true }));
          for (const ev of events) {
            switch (ev.event) {
              case 'start':
                handlers.onStart?.(ev.data.session_id);
                break;
              case 'chunk':
                fullText += ev.data.content;
                scheduleFlush();
                break;
              case 'complete':
                completed = true;
                break;
              case 'error':
                erroredCode = 'server';
                break;
            }
          }
        }
      } catch (err) {
        if (controller.signal.aborted) {
          cleanup();
          return;
        }
        handlers.onError('network');
        cleanup();
        return;
      }

      // Flush finale sincrono (non perdere l'ultimo testo se il raf non è scattato).
      cleanup();
      handlers.onContent(fullText);

      if (erroredCode) handlers.onError(erroredCode);
      else if (completed || fullText.length > 0) handlers.onComplete();
      else handlers.onError('server');
    },
    [endpoint, cleanup],
  );

  return { send, abort };
}
