/* ============================================================
   CYBER-SHACK dynamic bits — pure JS, static-host friendly.
   visitor counter · guestbook · sparkle cursor · now-spinning
   ============================================================ */
(function () {
  'use strict';

  /* ---------- VISITOR COUNTER (odometer) ---------- */
  // Persists per-browser via localStorage; seeded with a fake "you're the
  // 133,742nd visitor" base so it always looks impressively well-trafficked.
  function initCounter() {
    var odo = document.getElementById('odo');
    if (!odo) return;
    var BASE = 133742;
    var n = parseInt(localStorage.getItem('cybershack:visits') || '0', 10);
    n = n + 1;
    localStorage.setItem('cybershack:visits', String(n));
    var total = BASE + n;
    var str = String(total).padStart(8, '0');
    odo.innerHTML = '';
    str.split('').forEach(function (ch, i) {
      var d = document.createElement('span');
      d.className = 'd';
      d.textContent = '0';
      odo.appendChild(d);
      // little roll-up animation
      var target = parseInt(ch, 10);
      var step = 0;
      var iv = setInterval(function () {
        d.textContent = String((step) % 10);
        step++;
        if (step > target + 6) { clearInterval(iv); d.textContent = ch; }
      }, 40 + i * 8);
    });
  }

  /* ---------- NOW SPINNING (rotates the prog-metal flex) ---------- */
  var TRACKS = [
    ['The Dance of Eternity', 'Dream Theater'],
    ['Stream of Consciousness', 'Dream Theater'],
    ['Bleed', 'Meshuggah'],
    ['Cygnus....Vismund Cygnus', 'The Mars Volta'],
    ['Cassandra Gemini', 'The Mars Volta'],
    ['Schism', 'TOOL'],
    ['Ghost of Perdition', 'Opeth'],
    ['First Day of My Life... in 17/16', 'Glizzcore™']
  ];
  function initNowPlaying() {
    var s = document.getElementById('np-song'),
        a = document.getElementById('np-artist');
    if (!s || !a) return;
    var i = 0;
    setInterval(function () {
      i = (i + 1) % TRACKS.length;
      s.style.opacity = 0; a.style.opacity = 0;
      setTimeout(function () {
        s.textContent = TRACKS[i][0]; a.textContent = TRACKS[i][1];
        s.style.transition = a.style.transition = 'opacity .3s';
        s.style.opacity = 1; a.style.opacity = 1;
      }, 300);
    }, 4200);
  }

  /* ---------- GUESTBOOK (localStorage) ---------- */
  var SEED = [
    { who: 'xX_DialUpDan_Xx', mood: '☎ 56k', msg: 'sick site bro!! took 4 min to load on my modem but worth it. webring 4 life', when: 'Apr 22, 2021' },
    { who: 'glizzmaster99', mood: '🌭 hungry', msg: 'the Glizzy Relay scoreboard changed my LIFE. see u at regionals chad', when: 'Jun 09, 2023' },
    { who: 'webmaster_kelly', mood: '✨ stoked', msg: 'love the neon. added u to my links page! sign mine back ok??', when: 'Nov 30, 2024' },
    { who: 'prog_gandalf', mood: '🎸 in 7/8', msg: 'finally someone with TASTE. Dance of Eternity is the correct answer.', when: 'Feb 14, 2026' }
  ];
  function loadGB() {
    try {
      var raw = localStorage.getItem('cybershack:guestbook');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return SEED.slice();
  }
  function saveGB(list) {
    try { localStorage.setItem('cybershack:guestbook', JSON.stringify(list)); } catch (e) {}
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function renderGB() {
    var list = loadGB();
    var el = document.getElementById('gb-list');
    var cnt = document.getElementById('gb-count');
    if (!el) return;
    el.innerHTML = '';
    list.forEach(function (e) {
      var div = document.createElement('div');
      div.className = 'gb-entry';
      var mood = e.mood ? '<span class="mood">[' + esc(e.mood) + ']</span>' : '';
      div.innerHTML =
        '<div class="meta"><span class="who">' + esc(e.who) + '</span>' + mood +
        '<span class="when">' + esc(e.when) + '</span></div>' +
        '<div class="msg">' + esc(e.msg) + '</div>';
      el.appendChild(div);
    });
    if (cnt) cnt.textContent = '— ' + list.length + ' rad humans have signed —';
  }
  function initGuestbook() {
    var form = document.getElementById('gb-form');
    if (!form) return;
    renderGB();
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = document.getElementById('gb-name').value.trim();
      var mood = document.getElementById('gb-mood').value.trim();
      var msg = document.getElementById('gb-msg').value.trim();
      if (!msg) { document.getElementById('gb-msg').focus(); return; }
      var now = new Date();
      var when = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      var list = loadGB();
      list.unshift({ who: name || 'anonymous surfer', mood: mood, msg: msg, when: when });
      saveGB(list);
      renderGB();
      form.reset();
      // confetti-ish toast
      var btn = form.querySelector('.gb-send');
      var old = btn.textContent;
      btn.textContent = '✓ STAMPED!!';
      setTimeout(function () { btn.textContent = old; }, 1600);
    });
  }

  /* ---------- SPARKLE CURSOR TRAIL ---------- */
  var GLYPHS = ['✦', '✧', '★', '+', '·'];
  var trailOn = true;
  var lastSpawn = 0;
  function initSparkles() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.addEventListener('mousemove', function (e) {
      if (!trailOn) return;
      var now = Date.now();
      if (now - lastSpawn < 32) return;
      lastSpawn = now;
      var s = document.createElement('div');
      s.className = 'spark';
      s.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      var hue = (Math.random() * 360) | 0;
      s.style.color = 'hsl(' + hue + ',100%,65%)';
      s.style.left = e.clientX + (Math.random() * 14 - 7) + 'px';
      s.style.top = e.clientY + (Math.random() * 14 - 7) + 'px';
      s.style.fontSize = (10 + Math.random() * 10) + 'px';
      document.body.appendChild(s);
      var start = now, dur = 650 + Math.random() * 250;
      (function fall() {
        var t = (Date.now() - start) / dur;
        if (t >= 1) { s.remove(); return; }
        s.style.opacity = String(1 - t);
        s.style.transform = 'translate(-50%,-50%) translateY(' + (t * 18) + 'px) scale(' + (1 - t * 0.6) + ')';
        requestAnimationFrame(fall);
      })();
    }, { passive: true });
  }
  // exposed so a future tweaks panel can toggle it
  window.cybershack = {
    setTrail: function (on) { trailOn = !!on; },
    setTrailGlyphs: function (arr) { if (Array.isArray(arr) && arr.length) GLYPHS = arr; }
  };

  function boot() {
    initCounter();
    initNowPlaying();
    initGuestbook();
    initSparkles();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
