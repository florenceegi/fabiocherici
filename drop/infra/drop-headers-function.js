// CloudFront Function (viewer-response) — CSP di Drop SOLO per /drop/*.
// Sostituisce, per questo behavior, la security-headers function dell'apex (che vieta connect-src esterni).
// Consente: API Gateway (firma), S3 (PUT multipart), CDN Uppy.
function handler(event) {
  var h = event.response.headers;
  h['content-security-policy'] = { value:
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://releases.transloadit.com https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline' https://releases.transloadit.com; " +
    "img-src 'self' data: blob: https://cdnjs.cloudflare.com https://drop-tiles.florenceegi.com; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://nicq4pm10i.execute-api.eu-north-1.amazonaws.com https://fabiocherici-drop-incoming.s3.eu-north-1.amazonaws.com https://s3.eu-north-1.amazonaws.com https://drop-tiles.florenceegi.com; " +
    "worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" };
  h['x-content-type-options'] = { value: 'nosniff' };
  h['referrer-policy'] = { value: 'strict-origin-when-cross-origin' };
  h['strict-transport-security'] = { value: 'max-age=31536000; includeSubDomains; preload' };
  return event.response;
}
