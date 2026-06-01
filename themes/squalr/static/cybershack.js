/* ============================================================
   CYBER-SHACK dynamic bits — pure JS, static-host friendly.
   visitor counter · guestbook · sparkle cursor · now-spinning
   ============================================================ */
(function () {
  'use strict';

  /* ---------- VISITOR COUNTER (odometer) ---------- */
  // Persists per-browser via localStorage; seeded with a fake "you're the
  // 133,742nd visitor" base so it always looks impressively well-trafficked.
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      odo.appendChild(d);
      if (reducedMotion) {
        d.textContent = ch;
        return;
      }
      // little roll-up animation
      d.textContent = '0';
      var target = parseInt(ch, 10);
      var step = 0;
      var iv = setInterval(function () {
        d.textContent = String((step) % 10);
        step++;
        if (step > target + 6) { clearInterval(iv); d.textContent = ch; }
      }, 40 + i * 8);
    });
  }

  /* ---------- NOW SPINNING (Last.fm) ---------- */
  var LFM_USER = 'squalrus';
  var LFM_KEY  = 'eeb057078d22855ccfe801b9a69fba67';
  function initNowPlaying() {
    var s   = document.getElementById('np-song'),
        a   = document.getElementById('np-artist'),
        art = document.getElementById('np-art'),
        eq  = document.getElementById('np-eq'),
        lbl = document.getElementById('np-label'),
        mq  = document.getElementById('mq-track');
    var hasWidget = !!(s && a);
    if (!hasWidget && !mq) return;

    function applyTrack(track) {
      var isNow = !!(track['@attr'] && track['@attr'].nowplaying === 'true');
      if (mq) mq.textContent = (isNow ? '▶ ' : '■ ') + track.name + ' — ' + track.artist['#text'];
      if (!hasWidget) return;
      s.style.opacity = 0; a.style.opacity = 0;
      setTimeout(function () {
        s.textContent = track.name;
        a.textContent = track.artist['#text'];
        var imgs = track.image || [];
        var src = '';
        for (var j = imgs.length - 1; j >= 0; j--) {
          if (imgs[j]['#text']) { src = imgs[j]['#text']; break; }
        }
        if (art) {
          if (src) { art.src = src; art.alt = track.album['#text'] || track.name; art.hidden = false; }
          else { art.hidden = true; }
        }
        if (eq)  { if (isNow) eq.classList.remove('paused'); else eq.classList.add('paused'); }
        if (lbl) {
          lbl.textContent = isNow ? '▶ playing' : '■ last played';
          lbl.className = 'wa-state' + (isNow ? '' : ' last-played');
        }
        // Adaptive marquee: only scroll when text actually overflows the clip container
        var wrap = s.parentElement;
        if (wrap) {
          s.classList.remove('wa-scrolling');
          void s.offsetWidth; // flush so scrollWidth reflects new text without animation
          var textW = s.scrollWidth;
          var wrapW = wrap.clientWidth;
          if (textW > wrapW) {
            var gap = Math.max(60, wrapW >> 1); // half-container gap between loops
            var shift = textW + gap;
            s.style.setProperty('--wa-pad', gap + 'px');
            s.style.setProperty('--wa-shift', '-' + shift + 'px');
            // ~50px/s scroll speed; hold+gap take 40% of total
            s.style.setProperty('--wa-dur', Math.max(7, shift / 50 / 0.6).toFixed(1) + 's');
            s.classList.add('wa-scrolling');
          } else {
            s.style.removeProperty('--wa-pad');
            s.style.removeProperty('--wa-shift');
            s.style.removeProperty('--wa-dur');
          }
        }
        s.style.transition = a.style.transition = 'opacity .3s';
        s.style.opacity = 1; a.style.opacity = 1;
      }, 200);
    }

    function fetchLfm() {
      fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + LFM_USER + '&api_key=' + LFM_KEY + '&limit=1&format=json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var tracks = data.recenttracks && data.recenttracks.track;
          if (!tracks) return;
          var track = Array.isArray(tracks) ? tracks[0] : tracks;
          if (track) applyTrack(track);
        })
        .catch(function () {});
    }

    fetchLfm();
    setInterval(fetchLfm, 30000);
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
    if (reducedMotion) return;
    if (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) return;
    window.addEventListener('mousemove', function (e) {
      if (!trailOn) return;
      var now = Date.now();
      if (now - lastSpawn < 32) return;
      lastSpawn = now;
      var s = document.createElement('div');
      s.className = 'spark';
      s.setAttribute('aria-hidden', 'true');
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
