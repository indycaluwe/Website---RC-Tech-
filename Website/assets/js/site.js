// RC-Tech — small vanilla JS (no jQuery)
(function () {
  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Diensten dropdown (click/tap + Escape)
  document.querySelectorAll('.nav-drop').forEach(function (d) {
    var b = d.querySelector('.nav-drop-btn');
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = d.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) { if (!d.contains(e.target)) { d.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { d.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); } });
  });

  // Lightbox for project galleries
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  if (links.length && window.HTMLDialogElement) {
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Foto vergroot');
    dlg.innerHTML = '<figure><img alt=""><p></p></figure>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="Vorige foto">‹</button>' +
      '<button class="lb-btn lb-next" type="button" aria-label="Volgende foto">›</button>' +
      '<button class="lb-close" type="button" aria-label="Sluiten">×</button>';
    document.body.appendChild(dlg);
    var img = dlg.querySelector('img'), cap = dlg.querySelector('p'), idx = 0, set = links;
    function show(i) {
      idx = (i + set.length) % set.length;
      var a = set[idx], t = a.querySelector('img');
      img.src = a.getAttribute('href');
      var c = a.getAttribute('data-caption') || (t ? t.alt : '');
      img.alt = c;
      cap.textContent = c;
    }
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var g = a.getAttribute('data-lightbox');
        set = links.filter(function (l) { return l.getAttribute('data-lightbox') === g; });
        show(set.indexOf(a));
        dlg.showModal();
      });
    });
    dlg.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
    dlg.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
    dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    document.addEventListener('keydown', function (e) {
      if (!dlg.open) return;
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  // YouTube: load the player only after a click (privacy + speed)
  document.querySelectorAll('.yt[data-id]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + btn.getAttribute('data-id') + '?autoplay=1&rel=0';
      f.title = btn.getAttribute('aria-label') || 'Video';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      btn.innerHTML = '';
      btn.appendChild(f);
    });
  });

  // Google Maps: load only after a click
  document.querySelectorAll('[data-map]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.className = 'map';
      f.title = 'Locatie RC-Tech op de kaart';
      f.loading = 'lazy';
      f.src = btn.getAttribute('data-map');
      btn.parentNode.replaceChild(f, btn.closest('.map-placeholder') ? btn.closest('.map-placeholder') : btn);
    });
  });

  // Quote form: opens the visitor's e-mail program with everything filled in
  var form = document.getElementById('offerte-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var lines = [
        'Offerteaanvraag via rc-techkotterwerk.be',
        '',
        'Naam: ' + d.get('naam'),
        'Bedrijf: ' + (d.get('bedrijf') || '-'),
        'Telefoon: ' + d.get('telefoon'),
        'E-mail: ' + d.get('email'),
        'Locatie van de machine: ' + d.get('locatie'),
        'Type machine: ' + d.get('machine'),
        'Merk / model: ' + (d.get('merk') || '-'),
        'Aantal draaipunten: ' + (d.get('aantal') || '-'),
        'Diameter (indien gekend): ' + (d.get('diameter') || '-'),
        'Gewenste timing: ' + d.get('timing'),
        '',
        'Omschrijving:',
        d.get('omschrijving'),
        '',
        '(Foto\'s van de versleten draaipunten als bijlage toevoegen helpt voor een snelle inschatting.)'
      ];
      var subject = 'Offerteaanvraag mobiel kotteren - ' + d.get('machine') + ' - ' + d.get('locatie');
      window.location.href = 'mailto:RC-tech@skynet.be?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      var ok = document.getElementById('form-ok');
      if (ok) ok.hidden = false;
    });
  }

  // Project filters
  var chips = document.querySelectorAll('.chip[data-filter]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) { var on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      document.querySelectorAll('.pcard').forEach(function (card) {
        var cats = (card.getAttribute('data-cat') || '').split(' ');
        card.hidden = !(f === 'all' || cats.indexOf(f) !== -1);
      });
    });
  });

  // Project videos open in a player dialog
  var vbtns = document.querySelectorAll('[data-video]');
  if (vbtns.length && window.HTMLDialogElement) {
    var vd = document.createElement('dialog');
    vd.className = 'video-dialog';
    vd.setAttribute('aria-label', 'Video');
    vd.innerHTML = '<video controls playsinline></video><button class="lb-close" type="button" aria-label="Sluiten">×</button>';
    document.body.appendChild(vd);
    var vel = vd.querySelector('video');
    function closeV() { vel.pause(); vd.close(); }
    vd.querySelector('.lb-close').addEventListener('click', closeV);
    vd.addEventListener('click', function (e) { if (e.target === vd) closeV(); });
    vd.addEventListener('close', function () { vel.pause(); });
    vbtns.forEach(function (b) {
      b.addEventListener('click', function () {
        vel.src = b.getAttribute('data-video');
        vd.showModal();
        var p = vel.play(); if (p && p.catch) p.catch(function () {});
      });
    });
  }

  // Hero video: make autoplay work on as many phones as possible
  var hv = document.querySelector('.hero--video video');
  if (hv) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    hv.muted = true; hv.defaultMuted = true; hv.setAttribute('muted', ''); hv.playsInline = true;
    var tryPlay = function () { if (reduce) return; var p = hv.play(); if (p && p.catch) p.catch(function () {}); };
    if (reduce) { hv.removeAttribute('autoplay'); hv.pause(); } else { tryPlay(); }
    // some phones (power saving) only allow playback after the first touch or scroll
    ['touchstart', 'scroll', 'click'].forEach(function (ev) {
      window.addEventListener(ev, function once() { if (hv.paused) tryPlay(); window.removeEventListener(ev, once); }, { passive: true });
    });
    document.addEventListener('visibilitychange', function () { if (!document.hidden && hv.paused) tryPlay(); });
  }

  // Homepage: hide the mobile call bar while the hero is visible
  var heroHome = document.querySelector('.hero--home');
  if (heroHome) {
    var updateCta = function () {
      // show the bar once most of the hero has scrolled out of view
      document.body.classList.toggle('cta-hidden', heroHome.getBoundingClientRect().bottom > 120);
    };
    updateCta();
    window.addEventListener('scroll', updateCta, { passive: true });
    window.addEventListener('resize', updateCta);
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
