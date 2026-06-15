/**
 * @package fabiocherici.com — Nexus image validation
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-06-15
 * @purpose Validazione client (UX, NON sicurezza — il server ri-valida, mai
 *          fidarsi del client: MDN client-side-validation §18) di un file
 *          immagine: tipo MIME ∈ {jpeg,png} e dimensione ≤ 5MB. Funzione pura
 *          testabile con un File mockato. Messaggi = chiavi i18n (mai stringa).
 * @mission M-017
 */

/** Tipi accettati dal contratto M-017 (MAI pdf). */
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'] as const;

/** Limite dimensione client (~5MB, design M-017 §2.2). */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Chiave i18n del messaggio di errore (risolta dal componente). */
export type ImageValidationErrorKey = 'image_error_type' | 'image_error_size';

export type ImageValidationResult =
  | { ok: true }
  | { ok: false; errorKey: ImageValidationErrorKey };

/** Forma minima di File usata qui — facilita il mock nei test (ISP). */
export interface ValidatableFile {
  type: string;
  size: number;
}

/**
 * Valida tipo e dimensione. Ritorna la CHIAVE i18n dell'errore, non il testo,
 * così il componente lo traduce nelle 7 lingue (P0-FC-4).
 */
export function validateImageFile(
  file: ValidatableFile,
  maxBytes: number = MAX_IMAGE_BYTES,
): ImageValidationResult {
  const accepted: readonly string[] = ACCEPTED_IMAGE_TYPES;
  if (!accepted.includes(file.type)) {
    return { ok: false, errorKey: 'image_error_type' };
  }
  if (file.size > maxBytes) {
    return { ok: false, errorKey: 'image_error_size' };
  }
  return { ok: true };
}

/** Legge un File come data-URL base64 (per il campo `image?` del payload). */
export function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') resolve(result);
      else reject(new Error('FileReader did not return a string'));
    };
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(file);
  });
}
