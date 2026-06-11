(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.getElementById('site-nav');
    var hamburger = document.querySelector('.hamburger');
    var form = document.getElementById('booking-form');
    var successMsg = document.getElementById('form-success');

    /* Sticky nav shadow on scroll */
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });

    /* Hamburger toggle */
    if (hamburger && nav) {
      hamburger.setAttribute('aria-expanded', 'false');

      hamburger.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('nav-open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      /* Close nav on link click */
      document.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('nav-open');
          hamburger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* Form — AJAX submit to Formspree, stay on page */
    if (form && successMsg) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var submitBtn = form.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        })
        .then(function (res) {
          if (res.ok) {
            form.hidden = true;
            successMsg.hidden = false;
            successMsg.focus();
          } else {
            return res.json().then(function (data) {
              throw new Error(data.errors ? data.errors.map(function(err){ return err.message; }).join(', ') : 'Submission failed');
            });
          }
        })
        .catch(function (err) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit My Booking Request';
          alert('Sorry, something went wrong. Please try again or email us directly at edgertonemergencies@gmail.com\n\n' + err.message);
        });
      });
    }
  });
}());
