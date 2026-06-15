/**
 * @package fabiocherici.com — image-validation tests
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Test della validazione client immagine (UX): tipo MIME e dimensione.
 *          Ritorna chiavi i18n, mai testo. M-017 §2.2.
 * @mission M-017
 */

import { describe, it, expect } from 'vitest';
import { validateImageFile, MAX_IMAGE_BYTES } from './image-validation';

describe('validateImageFile', () => {
  it('accetta jpeg sotto il limite', () => {
    expect(validateImageFile({ type: 'image/jpeg', size: 1024 })).toEqual({ ok: true });
  });

  it('accetta png sotto il limite', () => {
    expect(validateImageFile({ type: 'image/png', size: 1024 })).toEqual({ ok: true });
  });

  it('rifiuta pdf (tipo non ammesso) con chiave i18n', () => {
    expect(validateImageFile({ type: 'application/pdf', size: 1024 })).toEqual({
      ok: false,
      errorKey: 'image_error_type',
    });
  });

  it('rifiuta webp', () => {
    expect(validateImageFile({ type: 'image/webp', size: 1024 }).ok).toBe(false);
  });

  it('rifiuta immagine oltre il limite di dimensione', () => {
    expect(validateImageFile({ type: 'image/png', size: MAX_IMAGE_BYTES + 1 })).toEqual({
      ok: false,
      errorKey: 'image_error_size',
    });
  });

  it('controlla il tipo PRIMA della dimensione', () => {
    // pdf gigante → errore tipo, non dimensione
    expect(validateImageFile({ type: 'application/pdf', size: MAX_IMAGE_BYTES + 1 })).toEqual({
      ok: false,
      errorKey: 'image_error_type',
    });
  });

  it('accetta esattamente al limite', () => {
    expect(validateImageFile({ type: 'image/jpeg', size: MAX_IMAGE_BYTES }).ok).toBe(true);
  });
});
