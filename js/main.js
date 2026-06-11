/* =========================================================
   Edgerton Emergency Services — Nav Script
   Vanilla JS, no dependencies
   ========================================================= */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.site-header');
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelectorAll('.site-nav a');

    if (!header || !hamburger) {
      return; // nothing to do on pages without a header/hamburger
    }

    /* Toggle nav open/closed when hamburger is clicked */
    hamburger.addEventListener('click', function () {
      var isOpen = header.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Close nav when any nav link is clicked (mobile UX) */
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (header.classList.contains('nav-open')) {
          header.classList.remove('nav-open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  });
}());
