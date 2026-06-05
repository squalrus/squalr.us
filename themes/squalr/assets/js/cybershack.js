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
  var DISCOGS_USER = 'squalrus';
  function initNowPlaying() {
    var s     = document.getElementById('np-song'),
        a     = document.getElementById('np-artist'),
        art   = document.getElementById('np-art'),
        eq    = document.getElementById('np-eq'),
        lbl   = document.getElementById('np-label'),
        mq    = document.getElementById('mq-track');
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
        s.style.transition = a.style.transition = 'opacity .3s';
        s.style.opacity = 1; a.style.opacity = 1;
        // Adaptive marquee: defer measurement to next frame — avoids forced reflow
        var wrap = s.parentElement;
        if (wrap) {
          s.classList.remove('wa-scrolling');
          s.style.removeProperty('--wa-pad');
          s.style.removeProperty('--wa-shift');
          wrap.style.removeProperty('--wa-dur');
          requestAnimationFrame(function() {
            var textW = s.scrollWidth;
            var wrapW = wrap.clientWidth;
            if (textW > wrapW && !reducedMotion) {
              var gap = Math.max(60, wrapW >> 1); // half-container gap between loops
              var shift = textW + gap;
              s.style.setProperty('--wa-pad', gap + 'px');
              s.style.setProperty('--wa-shift', '-' + shift + 'px');
              // ~50px/s scroll speed; hold at start takes 20% of total, scroll takes 80%
              // Set --wa-dur on wrap (not span) so ::before can access it for fade-in sync
              wrap.style.setProperty('--wa-dur', Math.max(7, shift / 50 / 0.8).toFixed(1) + 's');
              s.classList.add('wa-scrolling');
            }
          });
        }
      }, 200);
    }

    function applyPlaylist(tracks) {
      var pl = document.getElementById('np-playlist');
      if (!pl) return;
      pl.innerHTML = '';
      var num = 1;
      tracks.forEach(function (track) {
        var isNow = !!(track['@attr'] && track['@attr'].nowplaying === 'true');
        var li = document.createElement('li');
        if (isNow) li.className = 'wa-pl-now';
        var idx = document.createElement('span');
        idx.className = 'wa-pl-idx';
        idx.textContent = isNow ? '▶' : (num++) + '.';
        var label = document.createElement('span');
        label.className = 'wa-pl-track';
        label.textContent = track.name + ' — ' + track.artist['#text'];
        li.appendChild(idx);
        li.appendChild(label);
        pl.appendChild(li);
      });
    }

    function fetchLfm() {
      fetch('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + LFM_USER + '&api_key=' + LFM_KEY + '&limit=5&format=json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var tracks = data.recenttracks && data.recenttracks.track;
          if (!tracks) return;
          var list = Array.isArray(tracks) ? tracks : [tracks];
          if (list[0]) applyTrack(list[0]);
          applyPlaylist(list);
        })
        .catch(function () {});
    }

    fetchLfm();
    setInterval(fetchLfm, 30000);

    var scrobbleEl = document.getElementById('lfm-scrobbles');
    if (scrobbleEl) {
      fetch('https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=' + LFM_USER + '&api_key=' + LFM_KEY + '&format=json')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var count = data.user && data.user.playcount;
          if (count) scrobbleEl.textContent = Number(count).toLocaleString();
        })
        .catch(function () {});
    }
  }

  /* ---------- GUESTBOOK (localStorage) ---------- */
  var SEED = [
    { who: 'prog_gandalf', mood: '🎸 in 7/8', msg: 'finally someone with TASTE.  is the correct answer.', when: 'Feb 14, 2026' },
    { who: 'webmaster_kelly', mood: '✨ stoked', msg: 'love the neon. added u to my links page! sign mine back ok??', when: 'Nov 30, 2024' },
    { who: 'glizzmaster99', mood: '🌭 hungry', msg: 'the Glizzy Relay scoreboard changed my LIFE. see u at regionals chad', when: 'Jun 09, 2023' },
    { who: 'xX_DialUpDan_Xx', mood: '☎ 56k', msg: 'sick site bro!! took 4 min to load on my modem but worth it. webring 4 life', when: 'Apr 22, 2021' }
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

  /* ---------- WINDOW CONTROLS (Win95 + WinAmp) ---------- */

  // Shared fixed taskbar — used by both window controls and WinAmp controls
  var _tbEl    = null;
  var _tbItems = {}; // key → { title, restoreFn }
  var _winReset = null; // set by initWindowControls — resets all .win states
  var _waReset  = null; // set by initWinampControls — resets WinAmp state

  function _tbAdd(key, title, restoreFn) {
    _tbItems[key] = { title: title, restoreFn: restoreFn };
    _tbRender();
  }

  function _tbRemove(key) {
    delete _tbItems[key];
    _tbRender();
  }

  function _tbRender() {
    var keys = Object.keys(_tbItems);
    if (!keys.length) {
      if (_tbEl) { _tbEl.remove(); _tbEl = null; }
      return;
    }
    if (!_tbEl) {
      _tbEl = document.createElement('div');
      _tbEl.id = 'win-taskbar';
      _tbEl.setAttribute('role', 'toolbar');
      _tbEl.setAttribute('aria-label', 'Taskbar');
      document.body.appendChild(_tbEl);

      // Start button (Win2000 style — favicon + bold label)
      var startBtn = document.createElement('button');
      startBtn.className = 'tb-start';
      startBtn.setAttribute('aria-label', 'Start');
      startBtn.setAttribute('aria-haspopup', 'true');
      startBtn.setAttribute('aria-expanded', 'false');
      var startImg = document.createElement('img');
      startImg.src = '/img/favicon.ico';
      startImg.alt = '';
      startImg.setAttribute('aria-hidden', 'true');
      startImg.width = 16;
      startImg.height = 16;
      startBtn.appendChild(startImg);
      var startText = document.createElement('span');
      startText.textContent = 'Start';
      startBtn.appendChild(startText);

      // Start menu popup
      var startMenu = document.createElement('div');
      startMenu.id = 'start-menu';
      startMenu.setAttribute('role', 'menu');
      startMenu.setAttribute('aria-label', 'Start menu');
      startMenu.hidden = true;
      document.body.appendChild(startMenu);

      function buildStartMenu() {
        startMenu.innerHTML = '';

        // Header strip
        var hdr = document.createElement('div');
        hdr.className = 'sm-header';
        hdr.textContent = '✦ SQUALRUS ✦';
        startMenu.appendChild(hdr);

        var body = document.createElement('div');
        body.className = 'sm-body';
        startMenu.appendChild(body);

        // Navigation items
        var navItems = [
          { icon: '📁', label: 'Blog',      url: '/blog/' },
          { icon: '📁', label: 'Projects',  url: '/projects/' },
          { icon: '📁', label: 'Tags',      url: '/tags/' },
          { icon: '📄', label: 'Changelog', url: '/changelog/' },
          { icon: '📄', label: 'Backlog',   url: '/backlog/' },
        ];
        navItems.forEach(function (item) {
          var a = document.createElement('a');
          a.className = 'sm-item';
          a.href = item.url;
          a.setAttribute('role', 'menuitem');
          a.innerHTML = '<span class="sm-icon" aria-hidden="true">' + item.icon + '</span><span>' + item.label + '</span>';
          body.appendChild(a);
        });

        // Separator
        var sep1 = document.createElement('div');
        sep1.className = 'sm-sep';
        body.appendChild(sep1);

        // Hidden/fun destinations
        var funItems = [
          { icon: '😎', label: 'Chillout',  url: '/chillout-with-chad/' },
        ];
        funItems.forEach(function (item) {
          var a = document.createElement('a');
          a.className = 'sm-item';
          a.href = item.url;
          a.setAttribute('role', 'menuitem');
          a.innerHTML = '<span class="sm-icon" aria-hidden="true">' + item.icon + '</span><span>' + item.label + '</span>';
          body.appendChild(a);
        });

        // Restore section — minimized/closed windows
        var restoreKeys = Object.keys(_tbItems);
        if (restoreKeys.length) {
          var sep2 = document.createElement('div');
          sep2.className = 'sm-sep';
          body.appendChild(sep2);

          restoreKeys.forEach(function (key) {
            var item = _tbItems[key];
            var btn = document.createElement('button');
            btn.className = 'sm-item';
            btn.setAttribute('role', 'menuitem');
            btn.innerHTML = '<span class="sm-icon" aria-hidden="true">▣</span><span>' + item.title + '</span>';
            btn.addEventListener('click', function () {
              item.restoreFn();
              closeStartMenu();
            });
            body.appendChild(btn);
          });
        }

        // Separator + Shut Down
        var sep3 = document.createElement('div');
        sep3.className = 'sm-sep';
        body.appendChild(sep3);

        var shutBtn = document.createElement('button');
        shutBtn.className = 'sm-item sm-shutdown';
        shutBtn.setAttribute('role', 'menuitem');
        shutBtn.innerHTML = '<span class="sm-icon" aria-hidden="true">⏻</span><span>Restore All</span>';
        shutBtn.addEventListener('click', function () {
          sessionStorage.clear();
          if (_winReset) _winReset();
          if (_waReset)  _waReset();
          closeStartMenu();
        });
        body.appendChild(shutBtn);
      }

      function openStartMenu() {
        buildStartMenu();
        startMenu.hidden = false;
        startBtn.classList.add('tb-start--active');
        startBtn.setAttribute('aria-expanded', 'true');
      }

      function closeStartMenu() {
        startMenu.hidden = true;
        startBtn.classList.remove('tb-start--active');
        startBtn.setAttribute('aria-expanded', 'false');
      }

      startBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!startMenu.hidden) { closeStartMenu(); return; }
        openStartMenu();
      });

      document.addEventListener('click', function (e) {
        if (!startMenu.hidden && !startMenu.contains(e.target)) closeStartMenu();
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !startMenu.hidden) closeStartMenu();
      });

      _tbEl.appendChild(startBtn);

      // Task area (window restore buttons go here)
      var taskArea = document.createElement('div');
      taskArea.className = 'tb-tasks';
      _tbEl.appendChild(taskArea);

      // System tray + clock
      var tray = document.createElement('div');
      tray.className = 'tb-tray';
      var clock = document.createElement('time');
      clock.className = 'tb-clock';
      tray.appendChild(clock);
      _tbEl.appendChild(tray);

      function tickClock() {
        var now = new Date();
        var h = now.getHours() % 12 || 12;
        var m = now.getMinutes();
        clock.textContent = h + ':' + (m < 10 ? '0' + m : m) + (now.getHours() >= 12 ? ' PM' : ' AM');
        clock.setAttribute('datetime', now.toTimeString().slice(0, 5));
      }
      tickClock();
      setInterval(tickClock, 1000);
    }

    // Rebuild only the task buttons — Start and clock stay intact
    var taskArea = _tbEl.querySelector('.tb-tasks');
    taskArea.innerHTML = '';
    keys.forEach(function (key) {
      var item = _tbItems[key];
      var btn = document.createElement('button');
      btn.className = 'tb-task';
      btn.textContent = '▣ ' + item.title;
      btn.addEventListener('click', function () { item.restoreFn(); });
      taskArea.appendChild(btn);
    });
  }

  function initWindowControls() {
    var wins = document.querySelectorAll('.win');
    if (!wins.length) return;
    var winData = [];

    function applyState(w, newState) {
      w.state = newState;
      if (newState) sessionStorage.setItem(w.key, newState);
      else sessionStorage.removeItem(w.key);

      w.el.classList.remove('win-minimized', 'win-maximized', 'win-closed');
      if (newState) w.el.classList.add('win-' + newState);

      var maxBtn = w.el.querySelector('.tb-btn[data-action="maximize"]');
      if (maxBtn) {
        maxBtn.textContent = newState === 'maximized' ? '❐' : '▢';
        maxBtn.setAttribute('aria-label', newState === 'maximized' ? 'Restore' : 'Maximize');
        maxBtn.setAttribute('title',      newState === 'maximized' ? 'Restore' : 'Maximize');
      }

      if (newState === 'minimized' || newState === 'closed') {
        _tbAdd(w.key, w.title, function () { applyState(w, ''); });
      } else {
        _tbRemove(w.key);
      }
    }

    // Phase 1: collect windows + saved state
    wins.forEach(function (winEl, idx) {
      var titleEl = winEl.querySelector('.tbar > span:first-child');
      var title = (titleEl ? titleEl.textContent.trim() : '') || ('Window ' + (idx + 1));
      var key = 'win:' + location.pathname + ':' + idx;
      winData.push({ el: winEl, title: title, key: key, state: sessionStorage.getItem(key) || '' });
    });

    // Phase 2: apply saved classes + seed taskbar entries
    winData.forEach(function (w) {
      w.el.classList.remove('win-minimized', 'win-maximized', 'win-closed');
      if (w.state) w.el.classList.add('win-' + w.state);
      var maxBtn = w.el.querySelector('.tb-btn[data-action="maximize"]');
      if (maxBtn && w.state === 'maximized') {
        maxBtn.textContent = '❐';
        maxBtn.setAttribute('aria-label', 'Restore');
        maxBtn.setAttribute('title', 'Restore');
      }
      if (w.state === 'minimized' || w.state === 'closed') {
        _tbAdd(w.key, w.title, function () { applyState(w, ''); });
      }
    });

    // Register global reset so the Start button can restore all windows
    _winReset = function () { winData.forEach(function (w) { applyState(w, ''); }); };

    // Phase 3: wire up button + dblclick handlers
    winData.forEach(function (w) {
      w.el.querySelectorAll('.tb-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var a = btn.dataset.action;
          if (a === 'minimize')      applyState(w, w.state === 'minimized' ? '' : 'minimized');
          else if (a === 'maximize') applyState(w, w.state === 'maximized' ? '' : 'maximized');
          else if (a === 'close')    applyState(w, 'closed');
        });
      });
      var tbar = w.el.querySelector('.tbar');
      if (tbar) {
        tbar.addEventListener('dblclick', function (e) {
          if (e.target.closest('.tb-btns')) return;
          applyState(w, w.state === 'maximized' ? '' : 'maximized');
        });
      }
    });
  }

  function initWinampControls() {
    var wa = document.querySelector('.wa');
    if (!wa) return;
    var wbtns = wa.querySelectorAll('.tb-btn');
    if (!wbtns.length) return;

    var TITLE = '♫ LAST.FM';
    var SK    = 'wa:s:' + location.pathname; // shaded key
    var CK    = 'wa:c:' + location.pathname; // closed key

    var shaded = sessionStorage.getItem(SK) === '1';
    var closed = sessionStorage.getItem(CK) === '1';

    function setState(newShaded, newClosed) {
      shaded = newShaded;
      closed = newClosed;
      sessionStorage.setItem(SK, shaded ? '1' : '');
      sessionStorage.setItem(CK, closed ? '1' : '');
      wa.classList.toggle('wa-shaded', shaded);
      wa.classList.toggle('wa-closed', closed);
      if (closed) _tbAdd(CK, TITLE, function () { setState(false, false); });
      else        _tbRemove(CK);
    }

    // minimize/maximize → toggle shade; close → close player
    wbtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.dataset.action === 'close') setState(false, true);
        else                                setState(!shaded, false);
      });
    });

    // Register global reset so the Start button can restore the player
    _waReset = function () { setState(false, false); };

    // Restore saved state on load
    if (closed)      setState(false, true);
    else if (shaded) setState(true,  false);
  }

  /* ---------- GALLERY LIGHTBOX (keyboard nav) ---------- */
  function initGalleryLightbox() {
    var boxes = document.querySelectorAll('.gallery-lightbox');
    if (!boxes.length) return;
    var count = boxes.length;

    function currentIndex() {
      var m = location.hash.match(/^#img-(\d+)$/);
      return m ? parseInt(m[1], 10) : -1;
    }

    document.addEventListener('keydown', function (e) {
      var idx = currentIndex();
      if (idx === -1) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        location.hash = '#img-' + ((idx + 1) % count);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        location.hash = '#img-' + ((idx - 1 + count) % count);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        location.hash = '#gallery';
      }
    });
  }

  /* ---------- DISCOGS COLLECTION PANEL ---------- */
  function initDiscogs() {
    var listEl = document.getElementById('discogs-list');
    if (!listEl) return;

    function fetchDiscogs() {
      fetch('https://api.discogs.com/users/' + DISCOGS_USER + '/collection/folders/0/releases?sort=added&sort_order=desc&per_page=5')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var releases = data.releases;
          if (!releases || !releases.length) return;
          listEl.innerHTML = '';
          releases.forEach(function (rel) {
            var info = rel.basic_information;
            var artist = (info.artists && info.artists[0])
              ? info.artists[0].name.replace(/\s*\(\d+\)$/, '')
              : 'Unknown';
            var li = document.createElement('li');
            li.className = 'dc-item';

            var img = document.createElement('img');
            img.className = 'dc-thumb' + (info.thumb ? '' : ' dc-thumb--blank');
            img.alt = '';
            img.width = 38;
            img.height = 38;
            img.src = info.thumb ||
              'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

            var meta = document.createElement('div');
            meta.className = 'dc-meta';

            var artistEl = document.createElement('span');
            artistEl.className = 'dc-artist';
            artistEl.textContent = artist;

            var titleEl = document.createElement('span');
            titleEl.className = 'dc-title';
            titleEl.textContent = info.title;

            meta.appendChild(artistEl);
            meta.appendChild(titleEl);

            if (info.year) {
              var yearEl = document.createElement('span');
              yearEl.className = 'dc-year';
              yearEl.textContent = info.year;
              meta.appendChild(yearEl);
            }

            li.appendChild(img);
            li.appendChild(meta);
            listEl.appendChild(li);
          });
        })
        .catch(function () {});
    }

    fetchDiscogs();
    setInterval(fetchDiscogs, 600000); // poll every 10 min — collection updates are infrequent
  }

  /* ---------- RETRO AD SLOT (random pick) ---------- */
  function initAdSlot() {
    var ads = document.querySelectorAll('.ad-banner');
    if (!ads.length) return;
    ads[(Math.random() * ads.length) | 0].style.display = 'block';
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
    initDiscogs();
    initGuestbook();
    initAdSlot();
    initSparkles();
    initWindowControls();
    initWinampControls();
    initGalleryLightbox();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
