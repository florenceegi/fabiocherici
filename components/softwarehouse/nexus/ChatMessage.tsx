/**
 * @package fabiocherici.com — ChatMessage
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Bolla singola della chat (user / assistant / error) con avatar
 *          monogramma "P" per Padmin (nessun volto, design M-017 §1.3) e
 *          render markdown-subset SICURO come albero React (mai assegnare HTML
 *          grezzo, design M-017 §6). Contenuto AI = testo non fidato →
 *          renderSafeMarkdown costruisce nodi React (escaping garantito dal runtime).
 * @mission M-017
 */

'use client';

import { useTranslations } from 'next-intl';
import { renderSafeMarkdown } from '@/lib/nexus/markdown';
import type { ChatMessage as ChatMessageData } from '@/lib/nexus/types';

export interface ChatMessageProps {
  message: ChatMessageData;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const t = useTranslations('nexus');
  const isAi = message.kind === 'assistant';
  const isError = message.kind === 'error';

  const avatarLabel = isAi ? t('avatar_padmin_label') : t('avatar_you_label');

  return (
    <div
      className={`flex gap-3 ${isAi || isError ? 'flex-row' : 'flex-row-reverse'}`}
      data-kind={message.kind}
    >
      <div
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full font-[family-name:var(--font-display)] text-sm"
        style={{
          backgroundColor: isAi ? 'var(--accent-glow)' : 'var(--bg-hover)',
          color: isAi ? 'var(--accent)' : 'var(--text-secondary)',
        }}
      >
        {isAi || isError ? 'P' : t('avatar_you_monogram')}
      </div>
      <div className="min-w-0 max-w-[85%]">
        <span className="sr-only">{avatarLabel}: </span>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isError ? 'border' : ''
          }`}
          style={{
            backgroundColor: isAi
              ? 'var(--bg-card)'
              : isError
                ? 'transparent'
                : 'var(--accent-muted)',
            color: 'var(--text-primary)',
            borderColor: isError ? 'var(--border-accent)' : undefined,
          }}
        >
          {message.imageDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- data-URL locale, niente ottimizzazione next/image
            <img
              src={message.imageDataUrl}
              alt={t('attached_image_alt')}
              width={160}
              height={120}
              className="mb-2 h-auto max-h-40 w-auto rounded-lg object-cover"
            />
          ) : null}
          {isAi ? (
            <div className="nexus-prose break-words">{renderSafeMarkdown(message.content)}</div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
