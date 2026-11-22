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
      img.alt = t ? t.alt : '';
      cap.textContent = t ? t.alt : '';
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

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
