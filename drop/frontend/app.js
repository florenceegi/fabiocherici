/**
 * @package drop — Frontend uploader (Uppy + aws-s3 multipart)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0
 * @purpose Drag-drop, progress, retry, resume. Multipart OBBLIGATORIO. Browser→S3 diretto:
 *          il backend (Lambda) firma soltanto. Token-cliente letto da ?k= nella URL.
 *
 * Dipende da:
 *   - window.Uppy  (UMD bundle caricato in index.html)
 *   - window.DROP_API  (config.js generato da infra/setup.sh, es. https://xxxx.execute-api.eu-north-1.amazonaws.com)
 */
(function () {
  'use strict';

  var API = (window.DROP_API || '').replace(/\/+$/, '');
  var TOKEN = new URLSearchParams(location.search).get('k') || '';

  var gate = document.getElementById('gate');
  var clientEl = document.getElementById('client');
  var uppyEl = document.getElementById('uppy');

  function showGate(msg) {
    if (msg) gate.querySelector('strong').textContent = msg;
    gate.hidden = false;
    uppyEl.style.display = 'none';
  }

  // API helper — inietta sempre l'header del token-cliente
  function api(method, path, body) {
    return fetch(API + path, {
      method: method,
      cache: 'no-store',
      headers: Object.assign(
        { 'x-drop-token': TOKEN },
        body ? { 'content-type': 'application/json' } : {}
      ),
      body: body ? JSON.stringify(body) : undefined,
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error('HTTP ' + r.status + ' ' + t); });
      return r.status === 204 ? {} : r.json();
    });
  }

  var S3_MIN_PART = 5 * 1024 * 1024;
  var S3_MAX_PARTS = 10000;
  function chunkSize(size) {
    return Math.max(S3_MIN_PART, Math.ceil(size / S3_MAX_PARTS));
  }

  function boot() {
    if (!API) { showGate('Configurazione mancante (DROP_API)'); return; }
    if (!TOKEN) { showGate('Link non valido o scaduto.'); return; }

    // Valida il token e mostra il nome cliente
    api('GET', '/me').then(function (me) {
      clientEl.textContent = 'Caricamento per: ' + me.client;
      clientEl.hidden = false;
      startUppy();
    }).catch(function (err) {
      showGate('Link non valido o scaduto.');
      var dbg = document.createElement('p');
      dbg.style.cssText = 'margin-top:1rem;font-size:0.75rem;color:#ff8080;word-break:break-all';
      dbg.textContent = 'DEBUG: ' + (err && err.message ? err.message : String(err))
        + ' | API=' + API + ' | token=' + (TOKEN ? TOKEN.slice(0, 8) + '…' : '(vuoto)');
      gate.appendChild(dbg);
    });
  }

  function startUppy() {
    var Uppy = window.Uppy;
    var uppy = new Uppy.Uppy({ autoProceed: false, debug: false });

    uppy.use(Uppy.Dashboard, {
      inline: true,
      target: '#uppy',
      height: 460,
      proudlyDisplayPoweredByUppy: false,
      note: 'Qualunque tipo di file. Nessun limite di dimensione. Upload ripristinabile.',
      locale: { strings: {
        dropPasteFiles: 'Trascina i file qui o %{browseFiles}',
        browseFiles: 'sfoglia',
      } },
    });

    uppy.use(Uppy.AwsS3, {
      shouldUseMultipart: function () { return true; },   // multipart sempre (vincolo del brief)
      getChunkSize: function (file) { return chunkSize(file.size || 0); },

      createMultipartUpload: function (file) {
        return api('POST', '/s3/multipart', { filename: file.name, type: file.type })
          .then(function (r) { return { uploadId: r.uploadId, key: r.key }; });
      },
      signPart: function (file, opts) {
        var p = '/s3/multipart/' + encodeURIComponent(opts.uploadId) + '/' + opts.partNumber
              + '?key=' + encodeURIComponent(opts.key);
        return api('GET', p).then(function (r) { return { url: r.url }; });
      },
      listParts: function (file, opts) {
        var p = '/s3/multipart/' + encodeURIComponent(opts.uploadId)
              + '?key=' + encodeURIComponent(opts.key);
        return api('GET', p);
      },
      completeMultipartUpload: function (file, opts) {
        var p = '/s3/multipart/' + encodeURIComponent(opts.uploadId) + '/complete'
              + '?key=' + encodeURIComponent(opts.key);
        return api('POST', p, { parts: opts.parts })
          .then(function (r) { return { location: r.location }; });
      },
      abortMultipartUpload: function (file, opts) {
        var p = '/s3/multipart/' + encodeURIComponent(opts.uploadId)
              + '?key=' + encodeURIComponent(opts.key);
        return api('DELETE', p);
      },
    });

    uppy.on('complete', function (result) {
      if (result.successful.length) {
        clientEl.textContent = '✓ ' + result.successful.length + ' file ricevuti. Grazie!';
      }
    });
  }

  boot();
})();
