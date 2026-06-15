/**
 * @package fabiocherici.com — Nexus SSE parser
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Parser SSE puro e testabile: trasforma il testo grezzo dello stream
 *          (event:/data: riga per riga, ritmo da EGI/free-ai-chat.js) negli
 *          eventi tipizzati del contratto M-017. Nessuna dipendenza da DOM/rete
 *          → testabile in isolamento (SRP). Gestisce frame spezzati tra chunk
 *          via buffer interno.
 * @mission M-017
 */

import type { SseEvent } from './types';

const KNOWN_EVENTS = new Set(['start', 'chunk', 'complete', 'error']);

/**
 * Parser incrementale di un flusso SSE. Mantiene un buffer per i frame
 * spezzati tra letture successive. `push` ritorna gli eventi completi
 * riconosciuti finora; il residuo resta nel buffer.
 */
export class SseParser {
  private buffer = '';

  /**
   * Aggiunge un pezzo di testo decodificato e restituisce gli eventi
   * completi (terminati da riga vuota) riconosciuti.
   */
  push(text: string): SseEvent[] {
    this.buffer += text;
    const events: SseEvent[] = [];

    // I frame SSE sono separati da una riga vuota (\n\n). Processa solo i
    // frame completi; l'ultimo segmento (eventualmente parziale) resta nel buffer.
    let sepIndex = this.buffer.indexOf('\n\n');
    while (sepIndex !== -1) {
      const frame = this.buffer.slice(0, sepIndex);
      this.buffer = this.buffer.slice(sepIndex + 2);
      const parsed = parseFrame(frame);
      if (parsed) events.push(parsed);
      sepIndex = this.buffer.indexOf('\n\n');
    }

    return events;
  }
}

/** Parsa un singolo frame SSE (può contenere più righe field:value). */
function parseFrame(frame: string): SseEvent | null {
  let eventName = '';
  const dataLines: string[] = [];

  for (const rawLine of frame.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      // Per spec SSE lo spazio dopo `data:` è opzionale e va rimosso.
      dataLines.push(line.slice(5).replace(/^ /, ''));
    }
  }

  if (!KNOWN_EVENTS.has(eventName) || dataLines.length === 0) return null;

  const dataRaw = dataLines.join('\n');
  let data: unknown;
  try {
    data = JSON.parse(dataRaw);
  } catch {
    // Frame `data:` non-JSON: per `chunk` lo trattiamo come testo grezzo
    // (robustezza, come fallback in free-ai-chat.js); altrimenti scarta.
    if (eventName === 'chunk') return { event: 'chunk', data: { content: dataRaw } };
    return null;
  }

  return coerce(eventName, data);
}

/** Valida la forma del payload al confine (unknown + guard, no `as` per zittire). */
function coerce(eventName: string, data: unknown): SseEvent | null {
  const obj = isRecord(data) ? data : {};
  switch (eventName) {
    case 'start':
      return {
        event: 'start',
        data: {
          session_id: typeof obj.session_id === 'string' ? obj.session_id : '',
          rag_chunks: typeof obj.rag_chunks === 'number' ? obj.rag_chunks : undefined,
        },
      };
    case 'chunk':
      return { event: 'chunk', data: { content: typeof obj.content === 'string' ? obj.content : '' } };
    case 'complete':
      return { event: 'complete', data: { usage: isNumberRecord(obj.usage) ? obj.usage : undefined } };
    case 'error':
      return {
        event: 'error',
        data: {
          message: typeof obj.message === 'string' ? obj.message : '',
          code: typeof obj.code === 'string' ? obj.code : undefined,
        },
      };
    default:
      return null;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isNumberRecord(v: unknown): v is Record<string, number> {
  return isRecord(v) && Object.values(v).every((x) => typeof x === 'number');
}
