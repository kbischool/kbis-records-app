/* KBIS Records: update notice and install prompt. */
(function () {
  'use strict';
  var KEY = 'kbis_install_dismissed';
  var standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;

  function stored(v) {
    try { if (v === undefined) return localStorage.getItem(KEY); localStorage.setItem(KEY, v); } catch (e) { return null; }
    return null;
  }
  function make(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function bar(message, label, onAction, onClose) {
    var b = make('div', 'pwa-bar');
    b.setAttribute('role', 'status');
    b.appendChild(make('span', 'pwa-msg', message));
    if (label) {
      var a = make('button', 'pwa-btn', label);
      a.type = 'button';
      a.addEventListener('click', onAction);
      b.appendChild(a);
    }
    var x = make('button', 'pwa-x', 'Close');
    x.type = 'button';
    x.addEventListener('click', function () { b.remove(); if (onClose) onClose(); });
    b.appendChild(x);
    document.body.appendChild(b);
    return b;
  }

  /* Update flow: a new version waits until the user taps Refresh. */
  if ('serviceWorker' in navigator) {
    var hadController = !!navigator.serviceWorker.controller;
    var reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!hadController || reloading) return;
      reloading = true;
      window.location.reload();
    });
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').then(function (reg) {
        function offer(worker) {
          bar('A new version is ready.', 'Refresh', function () { worker.postMessage({ type: 'SKIP_WAITING' }); });
        }
        if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
        reg.addEventListener('updatefound', function () {
          var w = reg.installing;
          if (!w) return;
          w.addEventListener('statechange', function () {
            if (w.state === 'installed' && navigator.serviceWorker.controller) offer(w);
          });
        });
      }).catch(function () {});
    });
  }

  /* Install prompt: Android and desktop Chrome, shown after 20 seconds, remembers a dismissal. */
  var deferred = null;
  var installBar = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    if (standalone || stored()) return;
    setTimeout(function () {
      if (!deferred) return;
      installBar = bar('Install KBIS Records on this device.', 'Install', function () {
        var p = deferred;
        deferred = null;
        if (installBar) installBar.remove();
        p.prompt();
        p.userChoice.then(function () { stored('1'); });
      }, function () { stored('1'); });
    }, 20000);
  });
  window.addEventListener('appinstalled', function () {
    deferred = null;
    if (installBar) installBar.remove();
  });

  /* iPhone and iPad: Safari has no install event, so show the steps once. */
  var isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  if (isIOS && !standalone && !stored()) {
    setTimeout(function () {
      bar('To install: tap the Share button, then “Add to Home Screen”.', null, null, function () { stored('1'); });
    }, 20000);
  }
})();
