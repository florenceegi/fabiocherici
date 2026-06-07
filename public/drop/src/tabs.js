/**
 * @package tiff-viewer-experiment — Tab switcher (Galleria | Ricevi file)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @purpose Una sola app, due viste. Se l'URL ha un token (?k=) il default è "Ricevi file"
 *          (intento cliente); altrimenti "Galleria" (intento Fabio).
 */
(function () {
  'use strict';
  var tabs = document.querySelectorAll('.tab');
  var views = {
    gallery: document.getElementById('view-gallery'),
    upload: document.getElementById('view-upload'),
  };
  function show(name) {
    Object.keys(views).forEach(function (k) { views[k].hidden = (k !== name); });
    tabs.forEach(function (t) { t.classList.toggle('tab--active', t.dataset.tab === name); });
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { show(t.dataset.tab); });
  });
  // default in base alla presenza del token
  var hasToken = !!new URLSearchParams(location.search).get('k');
  show(hasToken ? 'upload' : 'gallery');
})();
