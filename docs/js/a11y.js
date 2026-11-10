/* KBIS Records: keyboard and screen-reader support for the tappable cards
   (student rows, fee and stock class cards, term cards). Adds button/link roles,
   Tab focus, Enter/Space activation and aria-expanded to elements the app draws. */
(function () {
  'use strict';
  var TOGGLES = '.term-head, .class-head';
  var ROWS = '.stu-row';
  var queued = false;

  function sync(node) {
    var card = node.closest('.term-card, .class-card');
    if (card) node.setAttribute('aria-expanded', card.classList.contains('open') ? 'true' : 'false');
  }

  function enhance() {
    queued = false;
    var root = document.getElementById('app-root');
    if (!root) return;
    root.querySelectorAll(TOGGLES).forEach(function (n) {
      if (n.getAttribute('role')) return;
      n.setAttribute('role', 'button');
      n.setAttribute('tabindex', '0');
      sync(n);
    });
    root.querySelectorAll(ROWS).forEach(function (n) {
      if (n.getAttribute('role')) return;
      n.setAttribute('role', 'link');
      n.setAttribute('tabindex', '0');
    });
  }

  function queue() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(enhance);
  }

  document.addEventListener('keydown', function (e) {
    var node = e.target;
    if (!node || !node.matches) return;
    var isToggle = node.matches(TOGGLES);
    var isRow = node.matches(ROWS);
    if (!isToggle && !isRow) return;
    if (e.key === 'Enter' || (isToggle && e.key === ' ')) {
      e.preventDefault();
      node.click();
    }
  });

  document.addEventListener('click', function (e) {
    var head = e.target && e.target.closest ? e.target.closest(TOGGLES) : null;
    if (head) sync(head);
  });

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('app-root');
    if (root) new MutationObserver(queue).observe(root, { childList: true, subtree: true });
    queue();
  });
})();
