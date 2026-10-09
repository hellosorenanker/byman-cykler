/* =============================================================================
   app.js: the only JavaScript on the Byman Cykler placeholder page
   HAND-WRITTEN (build.mjs never changes this file). Everything on the page works
   without it; it only ADDS:
     1. the status strip at the top ("Åbent nu · lukker 16.00", ui-spec §6.4)
     2. today's row in the hours table (bold, a dot, hidden "(i dag)", §6.3)
     3. the special-hours notice, from 14 days before the date (§6.5)
     4. the pause button for the scrolling name (§4.6)
   The clock is always Copenhagen time (Intl, time zone Europe/Copenhagen), never
   the visitor's own time zone. Weekly hours are read from the hours table (as on
   the Shopify page); special hours and texts come from <script id="hours-data">,
   which build.mjs writes from data/business.json and design/copy-da.md.

   Test switches (add to the page address). ?now and ?special ONLY work on your own
   computer (localhost, 127.0.0.1, [::1], *.localhost or a file opened from disk), so a
   shared link can never show fake hours on the published page:
     ?now=2026-10-10T13:30              pretend it is this Copenhagen time (clock stands still)
     ?special=2026-10-10,10:00,12:00    add special hours for a date (repeat &special=… for more)
     ?special=2026-10-10,closed         a closed day; an optional note can follow: …,closed,Some note
     ?nojs=1                            the page without this script (handled in index.html).
                                        Works everywhere: it only shows the plain no-JS page.
   ========================================================================== */
(function () {
  'use strict';
  var html = document.documentElement;
  if (!html.classList.contains('js')) return;   // ?nojs=1 preview

  /* ---------- 4. Pause button ---------- */
  var hero = document.getElementById('hero');
  var pause = hero && hero.querySelector('.hero__pause');
  if (pause) {
    pause.addEventListener('click', function () {
      var paused = pause.getAttribute('aria-pressed') !== 'true';
      pause.setAttribute('aria-pressed', String(paused));
      hero.classList.toggle('is-paused', paused);
    });
  }

  /* ---------- Setup for the hours ---------- */
  var status = document.getElementById('status');
  var table = document.getElementById('hours');
  var box = document.getElementById('notice');
  var dataEl = document.getElementById('hours-data');
  if (!status || !table || !dataEl || !window.Intl || !Intl.DateTimeFormat) return; // the neutral link stays
  var data;
  try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var T = data.strings;
  var TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
  var YMD = /^\d{4}-\d{2}-\d{2}$/;
  function realDate(s) { var d = new Date(s + 'T12:00:00Z'); return YMD.test(s) && !isNaN(d) && d.toISOString().slice(0, 10) === s; }

  // Weekly hours from the table rows: data-day (0 = Sunday), data-open, data-close, data-closed.
  var rows = [].slice.call(table.querySelectorAll('tr[data-day]'));
  var week = {};
  var regular = [];                                  // each row's own time cell, to restore after a special day
  rows.forEach(function (r, i) {
    week[r.getAttribute('data-day')] = r.hasAttribute('data-closed') ? null
      : { open: r.getAttribute('data-open'), close: r.getAttribute('data-close') };
    regular[i] = r.querySelector('td').innerHTML;
  });

  // Test switches only on the local machine (QA S3). On the published page they are ignored.
  var host = location.hostname;
  var local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\]|::1)$/.test(host) || /\.localhost$/.test(host);
  var params = new URLSearchParams(local ? location.search : '');

  // Special hours from the build, plus any ?special= test entries (which win on the same date).
  var special = (data.special || []).slice();
  params.getAll('special').forEach(function (v) {
    var p = v.split(','), x;
    if (p[1] === 'closed') x = { date: p[0], closed: true, note: p.slice(2).join(',') };
    else x = { date: p[0], open: p[1], close: p[2], closed: false, note: p.slice(3).join(',') };
    if (!realDate(x.date) || (!x.closed && !(TIME.test(x.open) && TIME.test(x.close) && x.open < x.close))) {
      console.warn('Ignoring ?special=' + v + ' (use 2026-10-10,10:00,12:00 or 2026-10-10,closed)');
      return;
    }
    special = special.filter(function (s) { return s.date !== x.date; }).concat([x]);
  });

  // ?now=2026-10-10T13:30 (Copenhagen time) freezes the clock for testing.
  var testNow = null, nowParam = params.get('now');
  if (nowParam) {
    if (/^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/.test(nowParam) && realDate(nowParam.slice(0, 10))) testNow = { ymd: nowParam.slice(0, 10), hm: nowParam.slice(11, 16) };
    else console.warn('Ignoring ?now=' + nowParam + ' (use 2026-10-10T13:30)');
  }

  var clock;
  try {
    clock = new Intl.DateTimeFormat('en-GB', {
      timeZone: data.timeZone, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  } catch (e) { return; }                          // no time-zone support: the neutral link stays

  /* ---------- Small helpers ---------- */
  function nowCph() {                              // { ymd: "2026-10-09", hm: "10:30" } in Copenhagen
    if (testNow) return testNow;
    var o = {};
    clock.formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
    return { ymd: o.year + '-' + o.month + '-' + o.day, hm: (o.hour === '24' ? '00' : o.hour) + ':' + o.minute };
  }
  function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return k in o ? o[k] : m; }); }
  function dk(hhmm) { return hhmm.replace(':', '.'); }                           // 09:00 -> 09.00
  function utc(ymd) { return new Date(ymd + 'T12:00:00Z'); }                     // date maths at noon UTC: no DST surprises
  function addDays(ymd, k) { var d = utc(ymd); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); }
  function dow(ymd) { return utc(ymd).getUTCDay(); }
  function longDate(ymd) { var d = utc(ymd); return T.days[d.getUTCDay()] + ' ' + d.getUTCDate() + '. ' + T.months[d.getUTCMonth()]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function specialOn(ymd) { for (var i = 0; i < special.length; i++) if (special[i].date === ymd) return special[i]; return null; }
  function hoursOn(ymd) {                          // special hours win over the weekly hours
    var s = specialOn(ymd);
    if (s) return s.closed ? null : { open: s.open, close: s.close };
    return week[dow(ymd)] || null;
  }
  function hoursText(x) { return x.closed ? T.closed : dk(x.open) + '–' + dk(x.close); }        // table cells: "Lukket"
  function hoursInline(x) { return x.closed ? T.closed.charAt(0).toLowerCase() + T.closed.slice(1) : hoursText(x); } // after a colon: "lukket" (QA S5)
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* ---------- 1–3. Render status, today's row and notice ---------- */
  function render() {
    var now = nowCph(), today = hoursOn(now.ymd), text, state = 'closed';

    // 1. Status strip
    if (today && now.hm >= today.open && now.hm < today.close) { text = fill(T.open, { close: dk(today.close) }); state = 'open'; }
    else if (today && now.hm < today.open) text = fill(T.opensLater, { open: dk(today.open) });
    else {
      text = T.closedToday;                        // nothing open within 14 days
      for (var i = 1; i <= data.noticeDays; i++) {
        var d = addDays(now.ymd, i), h = hoursOn(d);
        if (!h) continue;
        text = i === 1 ? fill(T.opensTomorrow, { open: dk(h.open) })
          : fill(T.opensOn, { day: i <= 6 ? T.days[dow(d)] : longDate(d), open: dk(h.open) });
        break;
      }
    }
    status.textContent = text;
    status.setAttribute('data-state', state);

    // 2. Today's row: bold + dot + hidden "(i dag)". On a special date it shows that day's real hours.
    var todayDow = dow(now.ymd), sp = specialOn(now.ymd);
    rows.forEach(function (r, i) {
      var isToday = +r.getAttribute('data-day') === todayDow;
      var td = r.querySelector('td'), th = r.querySelector('th'), old = th.querySelector('.today-sr');
      if (old) th.removeChild(old);
      td.innerHTML = regular[i];
      r.classList.toggle('is-today', isToday);
      if (!isToday) return;
      if (sp) td.textContent = hoursText(sp);
      th.appendChild(el('span', 'visually-hidden today-sr', ' (' + T.today + ')'));
    });

    // 3. Special-hours notice: every special date from today to 14 days ahead, in date order.
    if (!box) return;
    var last = addDays(now.ymd, data.noticeDays);
    var soon = special.filter(function (x) { return x.date >= now.ymd && x.date <= last; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    box.textContent = '';
    if (soon.length === 1) {                       // one date: one sentence
      var x = soon[0];
      box.appendChild(el('p', '', fill(T.notice, { date: longDate(x.date), hours: hoursInline(x) }) + (x.note ? '. ' + x.note : ''))); // textContent: notes are never HTML
    } else if (soon.length > 1) {                  // several: a title and a small table
      box.appendChild(el('p', 'label notice__title', T.specialHeading));
      var t = el('table', 'table notice__table'), body = document.createElement('tbody');
      soon.forEach(function (x) {
        var tr = el('tr'), th = el('th', '', cap(longDate(x.date)));
        th.setAttribute('scope', 'row');
        tr.appendChild(th); tr.appendChild(el('td', '', hoursText(x))); body.appendChild(tr);
        if (x.note) {
          var nr = el('tr', 'notice__note'), nd = el('td', '', x.note);
          nd.colSpan = 2; nr.appendChild(nd); body.appendChild(nr);
        }
      });
      t.appendChild(body); box.appendChild(t);
    }
    box.hidden = soon.length === 0;
  }

  render();
  setInterval(render, 60000);                      // keep the status fresh if the page stays open
  document.addEventListener('visibilitychange', function () { if (!document.hidden) render(); });
})();
