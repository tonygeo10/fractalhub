(function () {
  'use strict';
  var LIVE_EMBEDS = true;

  /* Fractal tree used as the logo mark */
  (function () {
    var d = [];
    (function branch(x, y, len, ang, depth) {
      var x2 = x + len * Math.sin(ang), y2 = y - len * Math.cos(ang);
      d.push('M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'L' + x2.toFixed(1) + ' ' + y2.toFixed(1));
      if (depth > 0) {
        branch(x2, y2, len * 0.74, ang - 0.52, depth - 1);
        branch(x2, y2, len * 0.74, ang + 0.52, depth - 1);
      }
    })(50, 96, 24, 0, 6);
    var p = document.getElementById('tree');
    if (p) p.setAttribute('d', d.join(''));
  })();

  var EMBEDS = {
    demi: {
      tiktok: { url: 'https://www.tiktok.com/@demi_acc15', id: 'demi_acc15', label: '@demi_acc15' },
      instagram: { url: 'https://www.instagram.com/demi_accountant/', label: '@demi_accountant' }
    },
    b2g: {
      tiktok: { url: 'https://www.tiktok.com/@b2gift', id: 'b2gift', label: '@b2gift' },
      instagram: { url: 'https://www.instagram.com/b2gift.gr/', label: '@b2gift.gr' }
    }
  };
  var NAMES = { tiktok: 'TikTok', instagram: 'Instagram' };

  var frame = document.getElementById('embed-frame');
  var openLink = document.getElementById('embed-open');
  var brandTabs = document.querySelectorAll('[data-brand]');
  var platTabs = document.querySelectorAll('[data-plat]');
  var state = { brand: 'demi', plat: 'tiktok' };

  function addScript(src, onload) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    if (onload) s.onload = onload;
    document.body.appendChild(s);
  }

  function mount(pane, brand, plat) {
    var e = EMBEDS[brand][plat];
    if (!LIVE_EMBEDS) {
      pane.innerHTML = '<a class="card-link" href="' + e.url + '" target="_blank" rel="noopener"><b>' + NAMES[plat] + ' ' + e.label + '</b><span>' + e.url.replace('https://', '') + '</span></a>';
      return;
    }
    if (plat === 'tiktok') {
      pane.innerHTML = '<blockquote class="tiktok-embed" cite="' + e.url + '" data-unique-id="' + e.id + '" data-embed-type="creator" style="max-width:780px;min-width:288px;"><section><a target="_blank" rel="noopener" href="' + e.url + '">' + e.label + ' στο TikTok</a></section></blockquote>';
      addScript('https://www.tiktok.com/embed.js');
    } else {
      pane.innerHTML = '<blockquote class="instagram-media" data-instgrm-permalink="' + e.url + '" data-instgrm-version="14" style="background:#fff;border:0;border-radius:3px;margin:0 auto;max-width:540px;min-width:288px;padding:0;width:100%;"><a href="' + e.url + '" target="_blank" rel="noopener">' + e.label + ' στο Instagram</a></blockquote>';
      if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process();
      else addScript('https://www.instagram.com/embed.js');
    }
  }

  function render() {
    var key = state.brand + '-' + state.plat;
    var panes = frame.querySelectorAll('.embed-pane');
    var found = null;
    panes.forEach(function (p) {
      var on = p.dataset.key === key;
      p.hidden = !on;
      if (on) found = p;
    });
    if (!found) {
      found = document.createElement('div');
      found.className = 'embed-pane';
      found.dataset.key = key;
      frame.appendChild(found);
      mount(found, state.brand, state.plat);
    }
    brandTabs.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.brand === state.brand)); });
    platTabs.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.plat === state.plat)); });
    var e = EMBEDS[state.brand][state.plat];
    openLink.href = e.url;
    openLink.textContent = 'Άνοιγμα στο ' + NAMES[state.plat] + ' ↗';
  }

  brandTabs.forEach(function (b) { b.addEventListener('click', function () { state.brand = b.dataset.brand; render(); }); });
  platTabs.forEach(function (b) { b.addEventListener('click', function () { state.plat = b.dataset.plat; render(); }); });

  /* Lazy-load the first embed when the split section is near the viewport */
  var started = false;
  function start() { if (!started) { started = true; render(); } }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { io.disconnect(); start(); } }, { rootMargin: '300px' });
    io.observe(frame);
  } else { start(); }

  /* ---------- Φόρμα επικοινωνίας (Formspree) ---------- */
  (function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = document.getElementById('form-status');
    var btn = form.querySelector('button[type="submit"]');
    function say(msg, cls) { status.textContent = msg; status.className = 'form-status ' + (cls || ''); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (f) {
        var ok = f.value.trim() !== '' && (f.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value.trim()));
        f.setAttribute('aria-invalid', String(!ok));
        if (!ok && !bad) bad = f;
      });
      if (bad) { say('Συμπληρώστε τα απαιτούμενα πεδία.', 'err'); bad.focus(); return; }
      if (/YOUR_FORM_ID/.test(form.action)) { say('Η φόρμα δεν έχει ακόμα συνδεθεί με το Formspree.', 'err'); return; }
      btn.disabled = true; say('Αποστολή…');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) { form.reset(); say('Ευχαριστούμε! Το μήνυμά σας εστάλη και θα επικοινωνήσουμε σύντομα.', 'ok'); }
          else { say('Κάτι πήγε στραβά. Δοκιμάστε ξανά ή γράψτε μας απευθείας.', 'err'); }
        })
        .catch(function () { say('Δεν ήταν δυνατή η αποστολή. Ελέγξτε τη σύνδεσή σας και δοκιμάστε ξανά.', 'err'); })
        .then(function () { btn.disabled = false; });
    });
  })();
})();
