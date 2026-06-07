/**
 * @package tiff-viewer-experiment — App
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 2.0.0 (FlorenceEGI — R&D)
 * @date 2026-04-29
 * @purpose Gallery + OpenSeadragon viewer — tiles served live from original TIFF via pyvips server
 */

(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const safeHtml = (el, html) => { el.innerHTML = DOMPurify.sanitize(html); };

  const DOM = {
    gallery: $('#gallery'),
    loading: $('#loading'),
    stats: $('#stats'),
    viewer: $('#viewer'),
    viewerTitle: $('#viewerTitle'),
    viewerMeta: $('#viewerMeta'),
    viewerDetail: $('#viewerDetail'),
    osd: $('#osd'),
    btnClose: $('#btnClose'),
    btnZoomIn: $('#btnZoomIn'),
    btnZoomOut: $('#btnZoomOut'),
    btnHome: $('#btnHome'),
    btnFullscreen: $('#btnFullscreen'),
    zoomBadge: $('#zoomBadge'),
  };

  let osdViewer = null;
  let manifest = null;
  let currentWork = null;

  // Base del tiling service. Vuoto = same-origin (server.py locale). Online = drop-tiles.florenceegi.com (config.js).
  const TILES = (window.DROP_TILES || '').replace(/\/+$/, '');

  function thumbUrl(work) {
    const thumbLevel = Math.max(0, work.maxLevel - 5);
    return `${TILES}/dzi/${work.slug}_files/${thumbLevel}/0_0.jpg`;
  }

  async function init() {
    try {
      // token-scoped: se c'è ?k=, la galleria mostra SOLO i file di quel cliente
      const k = new URLSearchParams(location.search).get('k');
      const url = TILES + '/api/manifest.json' + (k ? ('?token=' + encodeURIComponent(k)) : '');
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      manifest = await res.json();
      renderGallery();
      bindEvents();
    } catch (err) {
      DOM.loading.remove();
      safeHtml(DOM.gallery, `<div class="gallery__error">
        <p><strong>Errore:</strong> ${escapeHtml(err.message)}</p>
      </div>`);
    }
  }

  function renderGallery() {
    DOM.loading.remove();

    const received = manifest.mode === 'received';

    if (manifest.error === 'invalid_token') {
      safeHtml(DOM.gallery, `<div class="gallery__error">Link non valido o scaduto — non posso mostrare i file.</div>`);
      return;
    }

    const works = manifest.works.filter(w => !w.error);
    const errors = manifest.works.filter(w => w.error);
    const totalSize = works.reduce((sum, w) => sum + (w.fileSizeBytes || 0), 0);

    const pending = manifest.pending || 0;
    if (received) {
      safeHtml(DOM.stats, `I tuoi file &middot; ${works.length}${pending ? ' (' + pending + ' in preparazione)' : ''} &middot; ${formatBytes(totalSize)}`);
      const bar = document.createElement('div');
      bar.className = 'gallery__toolbar';
      safeHtml(bar, `<button class="card__btn" id="btnSync">&#8635; Aggiorna</button>
        <span class="gallery__hint">${pending ? 'Preparazione file in corso… la pagina si aggiorna da sola.' : 'I file che invii appaiono qui in deep-zoom.'}</span>`);
      DOM.gallery.appendChild(bar);
      bar.querySelector('#btnSync').onclick = function () { location.reload(); };
      if (pending > 0) setTimeout(function () { location.reload(); }, 6000);
    } else {
      safeHtml(DOM.stats, `${works.length} opere &middot; ${formatBytes(totalSize)} master &middot; <em>live from TIFF</em>`);
    }

    if (works.length === 0 && errors.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'gallery__loading';
      safeHtml(empty, received
        ? `<p>Nessun file ancora. Vai su <strong>Ricevi file</strong> e inviane uno — apparirà qui in deep-zoom.</p>`
        : `<p>Nessun file.</p>`);
      DOM.gallery.appendChild(empty);
      return;
    }

    works.forEach((work, i) => {
      const card = document.createElement('article');
      card.className = 'card';

      // File ricevuto ancora in download: card "in preparazione", niente deep-zoom
      if (work.status === 'preparing') {
        safeHtml(card, `
          <div class="card__preview">
            <div class="spinner"></div>
            <span class="card__badge">IN ARRIVO</span>
          </div>
          <div class="card__body">
            <h3 class="card__title">${escapeHtml(work.originalName.replace(/\.tiff?$/i, ''))}</h3>
            <dl class="card__meta">
              <dt>Stato</dt><dd>preparazione…</dd>
              <dt>Peso</dt><dd>${escapeHtml(work.fileSizeHuman || '—')}</dd>
            </dl>
          </div>
          <div class="card__footer"><button class="card__btn" disabled>In preparazione…</button></div>`);
        DOM.gallery.appendChild(card);
        return;
      }

      // RICEVUTO (modalità A): anteprima JPEG leggera + scarica originale da S3
      if (work.source === 'received') {
        if (work.status === 'file') {
          safeHtml(card, `
            <div class="card__preview"><span class="card__badge">FILE</span></div>
            <div class="card__body">
              <h3 class="card__title">${escapeHtml(work.originalName)}</h3>
              <dl class="card__meta"><dt>Peso</dt><dd>${escapeHtml(work.fileSizeHuman || '—')}</dd></dl>
            </div>
            <div class="card__footer"><a class="card__btn" href="${escapeHtml(work.downloadUrl || '#')}" download>Scarica</a></div>`);
        } else {
          safeHtml(card, `
            <div class="card__preview">
              <img class="card__thumb" src="${escapeHtml(TILES + (work.previewUrl || ''))}" alt="${escapeHtml(work.originalName)}" loading="lazy">
              <span class="card__badge">RICEVUTO</span>
            </div>
            <div class="card__body">
              <h3 class="card__title">${escapeHtml(work.originalName.replace(/\.[a-z0-9]+$/i, ''))}</h3>
              <dl class="card__meta"><dt>Peso</dt><dd>${escapeHtml(work.fileSizeHuman || '—')}</dd></dl>
            </div>
            <div class="card__footer"><a class="card__btn" href="${escapeHtml(work.downloadUrl || '#')}" download>Scarica originale</a></div>`);
        }
        DOM.gallery.appendChild(card);
        return;
      }

      // MASTER (galleria deep-zoom locale; non usata online)
      const sizeLabel = (work.fileSizeBytes || 0) > 500_000_000 ? 'MASTER' : 'TIFF';
      const dims = work.width ? `${work.width.toLocaleString('it')} × ${work.height.toLocaleString('it')}` : '—';
      safeHtml(card, `
        <div class="card__preview">
          <img class="card__thumb" src="${escapeHtml(thumbUrl(work))}" alt="${escapeHtml(work.originalName)}" loading="lazy">
          <span class="card__badge">${escapeHtml(sizeLabel)}</span>
        </div>
        <div class="card__body">
          <h3 class="card__title">${escapeHtml(work.originalName.replace(/\.tiff?$/i, ''))}</h3>
          <dl class="card__meta">
            <dt>Dimensioni</dt><dd>${escapeHtml(dims)}</dd>
            <dt>Peso</dt><dd>${escapeHtml(work.fileSizeHuman || '—')}</dd>
          </dl>
        </div>
        <div class="card__footer">
          <button class="card__btn" data-action="open" data-index="${i}">Apri Deep Zoom</button>
        </div>`);

      DOM.gallery.appendChild(card);
    });

    if (errors.length > 0) {
      const note = document.createElement('div');
      note.className = 'gallery__error';
      note.style.fontSize = '0.8rem';
      note.textContent = `${errors.length} file con errori di apertura.`;
      DOM.gallery.appendChild(note);
    }
  }

  function buildTileSource(work) {
    return `${TILES}/dzi/${work.slug}.dzi`;
  }

  function openViewer(index) {
    const work = manifest.works.filter(w => !w.error)[index];
    if (!work) return;

    currentWork = work;
    DOM.viewer.hidden = false;
    document.body.style.overflow = 'hidden';

    DOM.viewerTitle.textContent = work.originalName.replace(/\.tiff?$/i, '');
    DOM.viewerMeta.textContent = `${work.fileSizeHuman} · ${work.width}×${work.height} · ${work.bitsPerSample}-bit ${work.format}`;

    const details = [
      `Bande: ${work.bands}`,
      `Bit: ${work.bitsPerSample}`,
      `Formato pixel: ${work.format}`,
      `Interpretazione: ${work.interpretation}`,
      `DPI: ${work.dpi ? Math.round(work.dpi) : '—'}`,
      `Livelli zoom: ${work.maxLevel + 1}`,
    ];
    safeHtml(DOM.viewerDetail, details.map(d => `<span>${escapeHtml(d)}</span>`).join(''));

    const tileSource = buildTileSource(work);

    requestAnimationFrame(() => {
      if (osdViewer) {
        osdViewer.open(tileSource);
      } else {
        osdViewer = OpenSeadragon({
          id: 'osd',
          tileSources: tileSource,
          prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.1/images/',
          showNavigator: true,
          navigatorPosition: 'BOTTOM_RIGHT',
          navigatorSizeRatio: 0.15,
          animationTime: 0.3,
          blendTime: 0.1,
          minZoomImageRatio: 0.8,
          maxZoomPixelRatio: 800,
          visibilityRatio: 0.5,
          constrainDuringPan: true,
          showNavigationControl: false,
          gestureSettingsMouse: { scrollToZoom: true, clickToZoom: true, dblClickToZoom: true },
          gestureSettingsTouch: { pinchToZoom: true, flickEnabled: true },
        });
        osdViewer.addHandler('zoom', updateZoomBadge);
        osdViewer.addHandler('open', updateZoomBadge);
      }
    });

    DOM.btnZoomIn.onclick = () => osdViewer && osdViewer.viewport.zoomBy(1.5);
    DOM.btnZoomOut.onclick = () => osdViewer && osdViewer.viewport.zoomBy(0.67);
    DOM.btnHome.onclick = () => osdViewer && osdViewer.viewport.goHome();
    DOM.btnFullscreen.onclick = () => osdViewer && osdViewer.setFullScreen(!osdViewer.isFullPage());
  }

  function updateZoomBadge() {
    if (!osdViewer || !osdViewer.viewport || !currentWork) return;
    const viewportZoom = osdViewer.viewport.getZoom(true);
    const containerWidth = osdViewer.viewport.getContainerSize().x;
    const pixelRatio = (viewportZoom * containerWidth) / currentWork.width * 100;
    DOM.zoomBadge.textContent = `${pixelRatio.toFixed(0)}%`;
  }

  function closeViewer() {
    DOM.viewer.hidden = true;
    document.body.style.overflow = '';
  }

  function bindEvents() {
    DOM.gallery.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="open"]');
      if (btn) openViewer(parseInt(btn.dataset.index, 10));
    });
    DOM.btnClose.addEventListener('click', closeViewer);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !DOM.viewer.hidden) closeViewer();
    });
  }

  function formatBytes(bytes) {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GiB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MiB';
    return (bytes / 1024).toFixed(0) + ' KiB';
  }

  function escapeHtml(str) {
    const el = document.createElement('span');
    el.textContent = str;
    return el.innerHTML;
  }

  init();
})();
