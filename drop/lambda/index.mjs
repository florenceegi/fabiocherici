/**
 * @package drop — Lambda di firma (i 4 step multipart che Uppy chiama) + auth token-cliente
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0
 * @purpose Browser→S3 diretto: il backend FIRMA soltanto, i file non passano mai da qui.
 *          Routes (API Gateway HTTP API, payload v2):
 *            GET    /me                                  -> { client }            (valida token)
 *            POST   /s3/multipart                        -> { key, uploadId }     (create)
 *            GET    /s3/multipart/{uploadId}/{part}?key= -> { url }               (sign part)
 *            GET    /s3/multipart/{uploadId}?key=        -> [ parts ]             (list parts)
 *            POST   /s3/multipart/{uploadId}/complete?key= -> { location }        (complete)
 *            DELETE /s3/multipart/{uploadId}?key=        -> {}                     (abort)
 *          Ogni richiesta richiede header `x-drop-token`. La key è SEMPRE ri-validata
 *          server-side contro il prefix del cliente (incoming/{slug}/): un cliente non
 *          può leggere/scrivere fuori dalla sua cartella.
 */
import {
  S3Client, CreateMultipartUploadCommand, UploadPartCommand,
  CompleteMultipartUploadCommand, AbortMultipartUploadCommand, ListPartsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { buildKey, keyBelongs, sha256Hex } from './lib.mjs';

const REGION = process.env.AWS_REGION;                 // auto-impostata da Lambda
const BUCKET = process.env.DROP_BUCKET;
const TABLE = process.env.DROP_TABLE;
const PREFIX = process.env.DROP_PREFIX || 'incoming';
// Allowlist origin (DROP_ORIGINS = lista separata da virgole). L'ACAO riflette l'origin
// chiamante se è in lista — così serviamo sia la pagina prod che la demo locale.
const ORIGINS = (process.env.DROP_ORIGINS || process.env.DROP_ORIGIN || '*')
  .split(',').map(s => s.trim()).filter(Boolean);
const PART_TTL = 3600;                                  // validità URL firmata di una parte (s)

const s3 = new S3Client({ region: REGION });
const ddb = new DynamoDBClient({ region: REGION });

function corsHeaders(origin) {
  const allow = ORIGINS.includes('*') ? '*'
    : (origin && ORIGINS.includes(origin) ? origin : ORIGINS[0]);
  return {
    'Access-Control-Allow-Origin': allow,
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'content-type,x-drop-token',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Max-Age': '86400',
  };
}
let CORS = corsHeaders(undefined);                     // riassegnato a ogni invocazione
const json = (status, body) => ({
  statusCode: status,
  headers: { ...CORS, 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

/** Risolve il token → cliente, via DynamoDB (PK = token_hash). null se assente/revocato/scaduto. */
async function resolveClient(token) {
  if (!token) return null;
  const out = await ddb.send(new GetItemCommand({
    TableName: TABLE,
    Key: { token_hash: { S: sha256Hex(token) } },
  }));
  const it = out.Item;
  if (!it) return null;
  if (it.active && it.active.BOOL === false) return null;
  if (it.expires_at && it.expires_at.N && Date.now() / 1000 > Number(it.expires_at.N)) return null;
  return { slug: it.slug.S, label: it.label ? it.label.S : it.slug.S };
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || 'GET';
  const path = event.rawPath || '/';
  const h = event.headers || {};
  CORS = corsHeaders(h.origin || h.Origin);            // riflette l'origin chiamante (se in allowlist)
  if (method === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  const token = h['x-drop-token'] || h['X-Drop-Token'];
  const client = await resolveClient(token);
  if (!client) return json(401, { error: 'invalid_or_expired_token' });

  const qs = event.queryStringParameters || {};
  let body = {};
  if (event.body) {
    try {
      body = JSON.parse(event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf8') : event.body);
    } catch { /* body non-JSON: ignora */ }
  }

  try {
    // GET /me — la pagina valida il token al load e mostra il nome cliente
    if (method === 'GET' && path === '/me') return json(200, { client: client.label, slug: client.slug });

    // POST /s3/multipart — create: il SERVER decide la key (confinata al cliente)
    if (method === 'POST' && path === '/s3/multipart') {
      const key = buildKey(PREFIX, client.slug, body.filename || 'file');
      const out = await s3.send(new CreateMultipartUploadCommand({
        Bucket: BUCKET, Key: key, ContentType: body.type || 'application/octet-stream',
      }));
      return json(200, { key, uploadId: out.UploadId });
    }

    // /s3/multipart/{uploadId}[/{sub}]
    const m = path.match(/^\/s3\/multipart\/([^/]+)(?:\/(.+))?$/);
    if (m) {
      const uploadId = decodeURIComponent(m[1]);
      const sub = m[2];
      const key = qs.key;
      if (!keyBelongs(key, PREFIX, client.slug)) return json(403, { error: 'key_forbidden' });

      // GET sign part: /{uploadId}/{partNumber}?key=
      if (method === 'GET' && sub && /^\d+$/.test(sub)) {
        const url = await getSignedUrl(s3, new UploadPartCommand({
          Bucket: BUCKET, Key: key, UploadId: uploadId, PartNumber: Number(sub),
        }), { expiresIn: PART_TTL });
        return json(200, { url, expires: PART_TTL });
      }
      // GET list parts: /{uploadId}?key=
      if (method === 'GET' && !sub) {
        const out = await s3.send(new ListPartsCommand({
          Bucket: BUCKET, Key: key, UploadId: uploadId,
        }));
        return json(200, (out.Parts || []).map(p => ({
          PartNumber: p.PartNumber, Size: p.Size, ETag: p.ETag,
        })));
      }
      // POST complete: /{uploadId}/complete?key=
      if (method === 'POST' && sub === 'complete') {
        const parts = (body.parts || []).map(p => ({ PartNumber: p.PartNumber, ETag: p.ETag }));
        const out = await s3.send(new CompleteMultipartUploadCommand({
          Bucket: BUCKET, Key: key, UploadId: uploadId, MultipartUpload: { Parts: parts },
        }));
        return json(200, { location: out.Location, key });
      }
      // DELETE abort: /{uploadId}?key=
      if (method === 'DELETE' && !sub) {
        await s3.send(new AbortMultipartUploadCommand({
          Bucket: BUCKET, Key: key, UploadId: uploadId,
        }));
        return json(200, {});
      }
    }

    return json(404, { error: 'not_found', path, method });
  } catch (err) {
    console.error('drop-signer error', { path, method, msg: err?.message });
    return json(500, { error: 'internal', detail: err?.message });
  }
};
