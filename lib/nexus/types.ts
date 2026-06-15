/**
 * @package fabiocherici.com — Nexus types
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Tipi condivisi del widget pubblico "Padmin" (Nexus). Contratto SSE
 *          POST {endpoint}/chat con eventi start/chunk/complete/error
 *          (design M-017 §2.1). Union discriminate, zero any.
 * @mission M-017
 */

/** Ruolo nel transcript di conversazione inviato al backend. */
export type ChatRole = 'user' | 'assistant';

/** Coppia ruolo/contenuto per `conversation_history` del payload /chat. */
export interface ConversationTurn {
  role: ChatRole;
  content: string;
}

/** Tipo discriminato del messaggio renderizzato in chat. */
export type MessageKind = 'user' | 'assistant' | 'error';

/** Messaggio nello stato locale della chat (UI). */
export interface ChatMessage {
  /** Id stabile per la key React (no index, no Math.random nel render). */
  id: string;
  kind: MessageKind;
  content: string;
  /** Data-URL dell'immagine allegata dall'utente, se presente. */
  imageDataUrl?: string;
}

/** Payload POST /chat — contratto backend M-017 (rispettato esatto). */
export interface ChatRequestBody {
  message: string;
  session_id: string;
  conversation_history: ConversationTurn[];
  /** Data-URL base64 (jpeg/png), opzionale, max ~5MB. */
  image?: string;
}

/* ── Eventi SSE (union discriminata sul campo `event`) ── */

/** `event: start` — apertura stream. */
export interface SseStartEvent {
  event: 'start';
  data: { session_id: string; rag_chunks?: number };
}

/** `event: chunk` — frammento di testo della risposta. */
export interface SseChunkEvent {
  event: 'chunk';
  data: { content: string };
}

/** `event: complete` — fine risposta + usage. */
export interface SseCompleteEvent {
  event: 'complete';
  data: { usage?: Record<string, number> };
}

/** `event: error` — errore lato stream. `code` NON va mostrato all'utente. */
export interface SseErrorEvent {
  event: 'error';
  data: { message: string; code?: string };
}

export type SseEvent = SseStartEvent | SseChunkEvent | SseCompleteEvent | SseErrorEvent;

/** Categorie di errore mappate a messaggi i18n costruttivi (NN/g). */
export type NexusErrorCode = 'rate_limit' | 'network' | 'server' | 'aborted';
