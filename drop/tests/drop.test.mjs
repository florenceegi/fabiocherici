/**
 * @package drop — Test-First (P0-13) — RED prima dell'implementazione
 * @purpose Verifica la logica PURA della Lambda di firma: confinamento chiave per cliente,
 *          sanitizzazione filename, dimensionamento part (limite 10000 parti S3), hash token.
 *          La logica AWS (presign, dynamodb) è coperta end-to-end da infra/acceptance-test.sh.
 *
 * Nota: import risolto a runtime (path assemblato) — il modulo sotto test nasce DOPO il test.
 * Run: node --test tests/
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

// path assemblato a runtime: RED finché lambda/lib.mjs non esiste
const LIB = new URL('../lambda/' + 'lib.mjs', import.meta.url).href;
const { safeName, buildKey, keyBelongs, chunkSize, sha256Hex, S3_MAX_PARTS, S3_MIN_PART } =
  await import(LIB);

test('safeName: rimuove path traversal e caratteri pericolosi', () => {
  assert.equal(safeName('../../etc/passwd'), 'passwd');
  assert.equal(safeName('foto vacanza (1).JPG'), 'foto-vacanza-1-.JPG');
  assert.equal(safeName('a/b\\c:d*e?f'), 'c-d-e-f');
  assert.equal(safeName(''), 'file');
  assert.equal(safeName(undefined), 'file');
  assert.ok(!safeName('x/y/z').includes('/'));
});

test('buildKey: confina sempre dentro incoming/{slug}/', () => {
  const k = buildKey('incoming', 'acme-srl', 'logo.png');
  assert.match(k, /^incoming\/acme-srl\/[0-9a-f-]{36}__logo\.png$/);
});

test('keyBelongs: accetta solo chiavi del proprio prefix cliente', () => {
  assert.equal(keyBelongs('incoming/acme/abc__x.png', 'incoming', 'acme'), true);
  assert.equal(keyBelongs('incoming/altro/abc__x.png', 'incoming', 'acme'), false);
  assert.equal(keyBelongs('incoming/acme/../altro/x.png', 'incoming', 'acme'), false);
  assert.equal(keyBelongs('incoming/acme-evil/x.png', 'incoming', 'acme'), false);
  assert.equal(keyBelongs('', 'incoming', 'acme'), false);
  assert.equal(keyBelongs(undefined, 'incoming', 'acme'), false);
  assert.equal(keyBelongs('../../secret', 'incoming', 'acme'), false);
});

test('chunkSize: rispetta minimo S3 e tiene le parti sotto il limite 10000', () => {
  assert.equal(chunkSize(10 * 1024 * 1024), S3_MIN_PART);
  const big = 5 * 1024 * 1024 * 1024;           // 5 GB
  const cs = chunkSize(big);
  assert.ok(cs >= S3_MIN_PART);
  assert.ok(Math.ceil(big / cs) <= S3_MAX_PARTS);
  const huge = 200 * 1024 * 1024 * 1024;        // 200 GB
  const cs2 = chunkSize(huge);
  assert.ok(Math.ceil(huge / cs2) <= S3_MAX_PARTS, 'parti devono restare <= 10000');
});

test('sha256Hex: deterministico ed esadecimale (combacia con sha256sum del CLI)', () => {
  // printf %s "hello" | sha256sum
  assert.equal(
    sha256Hex('hello'),
    '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'
  );
});
