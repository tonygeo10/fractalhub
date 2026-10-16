(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* Reveal on scroll */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en, o) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); o.unobserve(x.target); } });
    }, { threshold: .1 });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  /* Lightbox for screenshots */
  var box = document.getElementById('lightbox');
  if (!box || typeof box.showModal !== 'function') return;
  var img = box.querySelector('img');
  document.querySelectorAll('.zoom').forEach(function (b) {
    b.addEventListener('click', function () {
      var src = b.getAttribute('data-full');
      img.src = src;
      img.alt = b.querySelector('img').alt;
      box.showModal();
    });
  });
  box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
  box.addEventListener('click', function (e) { if (e.target === box || e.target === img) box.close(); });
})();
