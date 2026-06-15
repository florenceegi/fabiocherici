/**
 * @package fabiocherici.com — ChatInput
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Riga di input chat: textarea autosize (max ~120px, ritmo da
 *          free-ai-chat.js), Enter invia / Shift+Enter a capo, allega immagine,
 *          bottone send disabilitato se vuoto/streaming/limite. Contatore
 *          "/50 messaggi rimanenti" con badge colore (visibilità di stato,
 *          NN/g #1). Il rate-limit è server-side: il contatore è solo UI.
 * @mission M-017
 */

'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import ImageAttach, { type AttachedImage } from './ImageAttach';

const MAX_TEXTAREA_PX = 120;

export interface ChatInputProps {
  remaining: number;
  limit: number;
  isStreaming: boolean;
  attached: AttachedImage | null;
  onAttach: (image: AttachedImage) => void;
  onRemoveImage: () => void;
  onSend: (text: string) => void;
}

function counterColor(ratio: number): string {
  if (ratio > 0.5) return 'var(--accent)';
  if (ratio > 0.2) return '#d4a55a';
  return '#d48050';
}

export default function ChatInput({
  remaining,
  limit,
  isStreaming,
  attached,
  onAttach,
  onRemoveImage,
  onSend,
}: ChatInputProps) {
  const t = useTranslations('nexus');
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const labelId = useId();

  const limitReached = remaining <= 0;
  const canSend = value.trim().length > 0 && !isStreaming && !limitReached;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_PX)}px`;
  }, [value]);

  function submit(): void {
    if (!canSend) return;
    onSend(value.trim());
    setValue('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const ratio = limit > 0 ? remaining / limit : 0;

  return (
    <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-end gap-2">
        <ImageAttach
          attached={attached}
          onAttach={onAttach}
          onRemove={onRemoveImage}
          disabled={isStreaming || limitReached}
        />
        <label id={labelId} htmlFor="nexus-chat-input" className="sr-only">
          {t('input_label')}
        </label>
        <textarea
          id="nexus-chat-input"
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={limitReached}
          placeholder={limitReached ? t('rate_limit_message') : t('input_placeholder')}
          className="min-h-11 flex-1 resize-none rounded-2xl border bg-transparent px-4 py-2.5 text-sm leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none disabled:opacity-50"
          style={{ borderColor: 'var(--border-accent)', maxHeight: MAX_TEXTAREA_PX }}
        />
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label={t('send_label')}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] transition-opacity hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
        <span
          className="inline-flex min-w-[1.5rem] justify-center rounded-full px-1.5 py-0.5 font-mono text-[0.7rem] font-semibold"
          style={{ color: counterColor(ratio), backgroundColor: 'var(--accent-glow)' }}
        >
          {remaining}
        </span>
        {t('counter_remaining', { limit })}
      </p>
    </div>
  );
}
