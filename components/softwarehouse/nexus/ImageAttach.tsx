/**
 * @package fabiocherici.com — ImageAttach
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Allega UNA immagine jpeg/png al messaggio: file picker accept,
 *          validazione client tipo/dimensione (UX, il server ri-valida — §2.2),
 *          anteprima thumbnail con width/height espliciti (no CLS — web.dev/cls
 *          §37), chip "rimuovi". Produce il data-URL per il campo image? del
 *          payload. Errore di validazione = messaggio i18n costruttivo (NN/g).
 * @mission M-017
 */

'use client';

import { useId, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ACCEPTED_IMAGE_TYPES,
  readFileAsDataUrl,
  validateImageFile,
} from '@/lib/nexus/image-validation';

export interface AttachedImage {
  name: string;
  dataUrl: string;
}

export interface ImageAttachProps {
  attached: AttachedImage | null;
  onAttach: (image: AttachedImage) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export default function ImageAttach({ attached, onAttach, onRemove, disabled }: ImageAttachProps) {
  const t = useTranslations('nexus');
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    // Reset value così lo stesso file può essere riselezionato dopo rimozione.
    e.target.value = '';
    if (!file) return;

    const result = validateImageFile(file);
    if (!result.ok) {
      setError(t(result.errorKey));
      return;
    }
    setError(null);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onAttach({ name: file.name, dataUrl });
    } catch {
      setError(t('image_error_read'));
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="sr-only"
        onChange={handleChange}
        aria-describedby={error ? errorId : undefined}
        tabIndex={-1}
      />
      {attached ? (
        <div
          className="flex items-center gap-2 rounded-lg border px-2 py-1.5"
          style={{ borderColor: 'var(--border-accent)', backgroundColor: 'var(--bg-card)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- data-URL locale */}
          <img
            src={attached.dataUrl}
            alt={t('attached_image_alt')}
            width={32}
            height={32}
            className="h-8 w-8 rounded object-cover"
          />
          <span className="max-w-[10rem] truncate text-xs text-[var(--text-secondary)]">
            {attached.name}
          </span>
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--accent)]"
            aria-label={t('remove_image_label')}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--accent)] transition-colors hover:bg-[var(--accent-glow)] disabled:opacity-40"
          aria-label={t('attach_image_label')}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
      )}
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-[var(--accent)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
