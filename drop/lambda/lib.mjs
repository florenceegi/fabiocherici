/**
 * @package drop — Lambda pure logic (testabile, zero side-effect, zero AWS)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0
 * @purpose Confinamento chiave per cliente, sanitizzazione filename, dimensionamento
 *          part S3 (limite 10000), hash token. Separato da index.mjs per testabilità (P0-13).
 */
import { createHash, randomUUID } from 'node:crypto';

export const S3_MIN_PART = 5 * 1024 * 1024;   // 5 MiB — minimo S3 per parte (tranne l'ultima)
export const S3_MAX_PARTS = 10000;            // limite hard S3 di parti per upload multipart

/** sha256 esadecimale — DEVE combaciare con `printf %s "$tok" | sha256sum` del CLI admin. */
export function sha256Hex(s) {
  return createHash('sha256').update(String(s)).digest('hex');
}

/**
 * Rende un filename sicuro: niente path, niente separatori, solo nome piatto.
 * Prende SOLO l'ultima componente del path → impedisce traversal a monte
 * (oltre al gate keyBelongs a valle).
 */
export function safeName(name) {
  if (!name) return 'file';
  let n = String(name).split(/[/\\]/).pop();
  n = n.replace(/[^A-Za-z0-9.\-]+/g, '-').replace(/^-+|-+$/g, '');
  return n || 'file';
}

/** Costruisce la key S3 confinata: {prefix}/{slug}/{uuid}__{safeName}. */
export function buildKey(prefix, slug, filename) {
  return `${prefix}/${slug}/${randomUUID()}__${safeName(filename)}`;
}

/**
 * Verifica che una key appartenga ESATTAMENTE al prefix del cliente.
 * Blocca cross-cliente e path traversal. Gate server-side: mai fidarsi della key dal client.
 */
export function keyBelongs(key, prefix, slug) {
  if (typeof key !== 'string' || !key) return false;
  if (key.includes('..')) return false;
  return key.startsWith(`${prefix}/${slug}/`);
}

/**
 * Dimensione di parte: >= 5 MiB e tale da tenere il numero di parti <= 10000.
 * Per file enormi cresce la parte invece di sforare il limite S3.
 */
export function chunkSize(fileSize) {
  const needed = Math.ceil((Number(fileSize) || 0) / S3_MAX_PARTS);
  return Math.max(S3_MIN_PART, needed);
}
