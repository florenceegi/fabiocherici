/**
 * @package fabiocherici.com — PadminChat
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Chat con Padmin: stato messaggi, invio + consumer SSE (useNexusStream),
 *          typing indicator, contatore. Log con aria-live="polite" che annuncia
 *          la risposta a COMPLETAMENTO (non per carattere → niente spam screen
 *          reader, MDN aria live regions). Streaming ancorato in fondo: il
 *          contenuto sopra non si sposta → no CLS (web.dev/cls). Feedback
 *          immediato al next-paint (INP): bolla utente + typing prima della rete.
 *          M-018: prompt-seed cliccabili nell'empty-state. Cliccare un seed
 *          INVIA subito il messaggio a Padmin (riusa handleSend) — azzera
 *          l'attrito "campo vuoto" (NN/g #6 recognition over recall). I seed sono
 *          veri <button> con label esplicita (a11y), wrappabili, tap-target ≥44px.
 * @mission M-018
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { AiDisclosureBanner } from '@/components/ai-act/AiDisclosureBanner';
import { useNexusStream } from './useNexusStream';
import type { AttachedImage } from './ImageAttach';
import type { ChatMessage as ChatMessageData, ConversationTurn, NexusErrorCode } from '@/lib/nexus/types';

const DAILY_LIMIT = 50;

function newId(): string {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function newSessionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export interface PadminChatProps {
  endpoint: string;
  /** Prompt-seed cliccabili mostrati nell'empty-state (M-018). Click = invio. */
  seeds?: readonly string[];
  /** Micro-invito sopra i seed (i18n nexus.seed_intro). */
  seedIntro?: string;
}

export default function PadminChat({ endpoint, seeds, seedIntro }: PadminChatProps) {
  const t = useTranslations('nexus');
  const locale = useLocale();
  const { send } = useNexusStream(endpoint);

  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [remaining, setRemaining] = useState(DAILY_LIMIT);
  const [attached, setAttached] = useState<AttachedImage | null>(null);
  const [liveStatus, setLiveStatus] = useState('');

  const sessionRef = useRef<string>(newSessionId());
  const logRef = useRef<HTMLDivElement>(null);
  const aiMsgIdRef = useRef<string | null>(null);

  // Scroll ancorato al fondo: il nuovo contenuto cresce in basso (no CLS sopra).
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isStreaming]);

  const errorText = useCallback(
    (code: NexusErrorCode): string =>
      code === 'rate_limit' ? t('rate_limit_message') : t('error_generic'),
    [t],
  );

  const handleSend = useCallback(
    (text: string): void => {
      // Feedback immediato (INP): bolla utente + typing PRIMA della rete.
      const userMsg: ChatMessageData = {
        id: newId(),
        kind: 'user',
        content: text,
        imageDataUrl: attached?.dataUrl,
      };
      const history: ConversationTurn[] = messages
        .filter((m) => m.kind !== 'error')
        .slice(-20)
        .map((m) => ({ role: m.kind === 'assistant' ? 'assistant' : 'user', content: m.content }));

      const aiId = newId();
      aiMsgIdRef.current = aiId;
      setMessages((prev) => [...prev, userMsg, { id: aiId, kind: 'assistant', content: '' }]);
      setIsStreaming(true);
      setLiveStatus(t('status_thinking'));
      const imageDataUrl = attached?.dataUrl;
      setAttached(null);

      void send({
        body: {
          message: text,
          session_id: sessionRef.current,
          conversation_history: history,
          ...(imageDataUrl ? { image: imageDataUrl } : {}),
        },
        handlers: {
          onStart: (sid) => {
            if (sid) sessionRef.current = sid;
          },
          onContent: (full) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === aiId ? { ...m, content: full } : m)),
            );
          },
          onComplete: () => {
            setIsStreaming(false);
            setRemaining((r) => Math.max(0, r - 1));
            setLiveStatus(t('status_replied'));
          },
          onError: (code) => {
            setIsStreaming(false);
            setLiveStatus('');
            setMessages((prev) =>
              prev
                .filter((m) => !(m.id === aiId && m.content.length === 0))
                .concat({ id: newId(), kind: 'error', content: errorText(code) }),
            );
            if (code === 'rate_limit') setRemaining(0);
          },
        },
      });
    },
    [attached, messages, send, t, errorText],
  );

  return (
    // Chat DOMINANTE (correzione CEO): area conversazione ampia e alta su desktop
    // e mobile. La colonna cresce per riempire l'altezza disponibile.
    <div className="flex h-full min-h-[32rem] flex-col sm:min-h-[34rem]">
      {/* Header Padmin */}
      <header className="mb-3 flex items-center gap-3 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full font-[family-name:var(--font-display)] text-lg"
          style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)' }}
        >
          P
        </span>
        <div>
          <p className="font-[family-name:var(--font-display)] text-base text-[var(--text-primary)]">
            {t('padmin_name')}
          </p>
          <p className="text-xs text-[var(--text-muted)]">{t('padmin_role')}</p>
        </div>
      </header>
      {/* AI Act Art. 50(1) — banner disclosure standard del kit (M-FABIOCHERICI-001), prima del primo input.
          Sostituisce la disclosure ad-hoc precedente; variant inline, link a /{locale}/ai-transparency. */}
      <AiDisclosureBanner
        locale={locale}
        variant="inline"
        transparencyUrl={`/${locale}/ai-transparency`}
        className="mb-3"
      />

      {/* Log chat — live region (annuncio a completamento, non per carattere) */}
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label={t('log_label')}
        className="flex-1 space-y-4 overflow-y-auto pr-1"
        style={{ minHeight: '22rem', maxHeight: '60vh' }}
      >
        {messages.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">{t('empty_prompt')}</p>
            {seeds && seeds.length > 0 ? (
              <div>
                {seedIntro ? (
                  <p className="mb-2 text-xs text-[var(--text-muted)]">{seedIntro}</p>
                ) : null}
                <ul className="flex flex-wrap gap-2">
                  {seeds.map((seed) => (
                    <li key={seed}>
                      <button
                        type="button"
                        onClick={() => handleSend(seed)}
                        disabled={isStreaming || remaining <= 0}
                        className="inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-left text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ borderColor: 'var(--border-accent)' }}
                      >
                        {seed}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          messages.map((m) => <ChatMessage key={m.id} message={m} />)
        )}
        {isStreaming && aiMsgIdRef.current && messages.find((m) => m.id === aiMsgIdRef.current)?.content === '' ? (
          <p className="text-sm text-[var(--text-muted)]" aria-hidden="true">
            {t('typing')}
          </p>
        ) : null}
      </div>

      {/* Annuncio non visivo dello stato (ridondante per screen reader) */}
      <span className="sr-only" role="status">
        {liveStatus}
      </span>

      <div className="mt-3">
        <ChatInput
          remaining={remaining}
          limit={DAILY_LIMIT}
          isStreaming={isStreaming}
          attached={attached}
          onAttach={setAttached}
          onRemoveImage={() => setAttached(null)}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
