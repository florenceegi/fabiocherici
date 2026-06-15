/**
 * @package fabiocherici.com — SseParser tests
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Test del parser SSE puro: i 4 eventi del contratto M-017, frame
 *          spezzati tra chunk, data non-JSON, eventi sconosciuti scartati.
 * @mission M-017
 */

import { describe, it, expect } from 'vitest';
import { SseParser } from './sse-parser';

describe('SseParser', () => {
  it('parsa i 4 eventi del contratto in un singolo push', () => {
    const p = new SseParser();
    const text =
      'event: start\ndata: {"session_id":"s1","rag_chunks":3}\n\n' +
      'event: chunk\ndata: {"content":"Ciao"}\n\n' +
      'event: chunk\ndata: {"content":" mondo"}\n\n' +
      'event: complete\ndata: {"usage":{"tokens":12}}\n\n';
    const events = p.push(text);
    expect(events).toHaveLength(4);
    expect(events[0]).toEqual({ event: 'start', data: { session_id: 's1', rag_chunks: 3 } });
    expect(events[1]).toEqual({ event: 'chunk', data: { content: 'Ciao' } });
    expect(events[3]).toEqual({ event: 'complete', data: { usage: { tokens: 12 } } });
  });

  it('gestisce un frame spezzato tra due push (buffering)', () => {
    const p = new SseParser();
    expect(p.push('event: chunk\ndata: {"con')).toHaveLength(0);
    const events = p.push('tent":"x"}\n\n');
    expect(events).toEqual([{ event: 'chunk', data: { content: 'x' } }]);
  });

  it('mappa event: error con message e code', () => {
    const p = new SseParser();
    const events = p.push('event: error\ndata: {"message":"boom","code":"E_X"}\n\n');
    expect(events[0]).toEqual({ event: 'error', data: { message: 'boom', code: 'E_X' } });
  });

  it('scarta eventi sconosciuti', () => {
    const p = new SseParser();
    expect(p.push('event: memory_saved\ndata: {"x":1}\n\n')).toHaveLength(0);
  });

  it('tratta data non-JSON di un chunk come testo grezzo', () => {
    const p = new SseParser();
    const events = p.push('event: chunk\ndata: testo libero\n\n');
    expect(events[0]).toEqual({ event: 'chunk', data: { content: 'testo libero' } });
  });

  it('non emette nulla finché il frame non è terminato da riga vuota', () => {
    const p = new SseParser();
    expect(p.push('event: complete\ndata: {}')).toHaveLength(0);
    expect(p.push('\n\n')).toHaveLength(1);
  });
});
