(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) {
    return;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var manifestUrl = 'manifest.webmanifest';
    var hasManifest = document.querySelector('link[rel="manifest"]');
    if (!hasManifest) {
      var link = document.createElement('link');
      link.rel = 'manifest';
      link.href = manifestUrl;
      document.head.appendChild(link);
    }

    navigator.serviceWorker.register('sw.js').catch(function () {
      // Silently fail if service worker registration is blocked
    });
  });
})();
