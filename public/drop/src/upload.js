/**
 * @package tiff-viewer-experiment — Drop (sezione Ricevi file)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @purpose Uppy + aws-s3 multipart. Browser→S3 diretto, la Lambda firma soltanto.
 *          Token-cliente da ?k=. Stessa logica della pagina Drop prod, integrata nel viewer.
 * Dipende da: window.Uppy (UMD), window.DROP_API (config.js).
 */
(function () {
  'use strict';

  var API = (window.DROP_API || '').replace(/\/+$/, '');
  var TOKEN = new URLSearchParams(location.search).get('k') || '';

  var gate = document.getElementById('uploadGate');
  var clientEl = document.getElementById('uploadClient');
  var uppyEl = document.getElementById('uppy');

  function showGate(msg) {
    if (msg) gate.querySelector('strong').textContent = msg;
    gate.hidden = false;
    uppyEl.style.display = 'none';
  }

  function api(method, path, body) {
    return fetch(API + path, {
      method: method,
      cache: 'no-store',
      headers: Object.assign({ 'x-drop-token': TOKEN },
        body ? { 'content-type': 'application/json' } : {}),
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error('HTTP ' + r.status + ' ' + t); });
      return r.status === 204 ? {} : r.json();
    });
  }

  var S3_MIN_PART = 5 * 1024 * 1024, S3_MAX_PARTS = 10000;
  function chunkSize(size) { return Math.max(S3_MIN_PART, Math.ceil(size / S3_MAX_PARTS)); }

  function boot() {
    if (!API) { showGate('Configurazione mancante (DROP_API)'); return; }
    if (!TOKEN) { showGate('Link non valido o scaduto.'); return; }
    api('GET', '/me').then(function (me) {
      clientEl.textContent = 'Caricamento per: ' + me.client;
      clientEl.hidden = false;
      startUppy();
    }).catch(function () { showGate('Link non valido o scaduto.'); });
  }

  function startUppy() {
    var U = window.Uppy;
    var uppy = new U.Uppy({ autoProceed: false });
    uppy.use(U.Dashboard, {
      inline: true, target: '#uppy', height: 460,
      proudlyDisplayPoweredByUppy: false, theme: 'dark',
      note: 'Qualunque tipo di file. Nessun limite di dimensione. Upload ripristinabile.',
    });
    uppy.use(U.AwsS3, {
      shouldUseMultipart: function () { return true; },
      getChunkSize: function (file) { return chunkSize(file.size || 0); },
      createMultipartUpload: function (file) {
        return api('POST', '/s3/multipart', { filename: file.name, type: file.type })
          .then(function (r) { return { uploadId: r.uploadId, key: r.key }; });
      },
      signPart: function (file, o) {
        return api('GET', '/s3/multipart/' + encodeURIComponent(o.uploadId) + '/' + o.partNumber
          + '?key=' + encodeURIComponent(o.key)).then(function (r) { return { url: r.url }; });
      },
      listParts: function (file, o) {
        return api('GET', '/s3/multipart/' + encodeURIComponent(o.uploadId)
          + '?key=' + encodeURIComponent(o.key));
      },
      completeMultipartUpload: function (file, o) {
        return api('POST', '/s3/multipart/' + encodeURIComponent(o.uploadId) + '/complete'
          + '?key=' + encodeURIComponent(o.key), { parts: o.parts })
          .then(function (r) { return { location: r.location }; });
      },
      abortMultipartUpload: function (file, o) {
        return api('DELETE', '/s3/multipart/' + encodeURIComponent(o.uploadId)
          + '?key=' + encodeURIComponent(o.key));
      },
    });
    uppy.on('complete', function (res) {
      if (res.successful.length) {
        clientEl.textContent = '✓ ' + res.successful.length + ' file ricevuti. Grazie!';
      }
    });
  }

  boot();
})();
