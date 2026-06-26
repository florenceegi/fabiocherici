/**
 * @package drop — test doc-sync runtime (M-FABIOCHERICI-003)
 * @purpose Asserisce che i riferimenti al runtime Lambda nei file dell'organo fabiocherici
 *          siano allineati al runtime realmente deployato su AWS (nodejs22.x), dopo l'upgrade
 *          EOL nodejs20.x. RED prima delle edit (i file citano ancora nodejs20.x) → GREEN dopo.
 *          NB: lo SSOT del drop vive in EGI-DOC (organo FlorenceEGI) → fuori scope di questo
 *          test per non accoppiare repo di organi diversi; allineato sotto mission FlorenceEGI.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const HOME = process.env.HOME;
const FILES = [
  `${HOME}/fabiocherici.com/drop/config.env`,
  `${HOME}/fabiocherici.com/drop/lambda/package.json`,
];

test('nessun riferimento residuo a nodejs20.x nei doc/config del drop', () => {
  for (const f of FILES) {
    const body = readFileSync(f, 'utf-8');
    assert.ok(!body.includes('nodejs20.x'), `${f} cita ancora nodejs20.x`);
  }
});

test('config.env dichiara LAMBDA_RUNTIME=nodejs22.x', () => {
  const body = readFileSync(FILES[0], 'utf-8');
  assert.match(body, /LAMBDA_RUNTIME="nodejs22\.x"/, 'LAMBDA_RUNTIME non e nodejs22.x');
});
