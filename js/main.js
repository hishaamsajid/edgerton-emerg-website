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

    /* "Open now" badge — clinic hours are 9am–10pm UK time, every day */
    var status = document.getElementById('open-status');
    if (status && window.Intl) {
      var hour = parseInt(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Europe/London' }).format(new Date()), 10);
      var isOpen = hour >= 9 && hour < 22;
      status.classList.toggle('is-open', isOpen);
      status.querySelector('.status-text').textContent = isOpen
        ? 'Open now · until 10pm tonight'
        : 'Closed now · opens 9am · book online';
    }

    /* Fade sections in as they scroll into view */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(function (el) { observer.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* Track click-to-call taps as a conversion signal */
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (typeof gtag === 'function') {
          gtag('event', 'click_to_call', { event_category: 'phone' });
        }
      });
    });

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
            successMsg.scrollIntoView({ block: 'center' });
            successMsg.focus();
            if (typeof gtag === 'function') {
              gtag('event', 'generate_lead', { event_category: 'booking_form' });
            }
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
