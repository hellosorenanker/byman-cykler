# QA report: Byman Cykler placeholder (standalone build)

> **Gate 3 decisions by Søren (2026-10-09), added by the orchestrator:**
> - **S6:** keep "Vi er specialister i Specialized". Søren confirmed the wording.
> - **M1:** the shop owns the temporary photo, so it may be published. It is still low resolution, so replacing it with a ≥ 2400 px photo stays recommended (`PHOTO_FILE` in `build.mjs`).
> - **Path:** standalone page on Vercel at https://www.byman-cykler.dk/, committed and pushed to `main`.
> - **Later the same day (Søren's request):** Vercel Web Analytics was added. It is cookieless and served from the site's own address (`/_vercel/insights/script.js`), and it never loads on localhost. So it is still "no third-party requests", but the page now counts visits.


Written by A9 QA, 2026-10-09 (Wave 4). Reviewed: `placeholder/build/` (index.html generated 2026-10-09, styles.css, app.js, tokens.css, img/) against `design/ui-spec.md`, `design/section-map.md`, `design/tokens.css`, `research/theme-analysis.md`, `research/ux-research.md`, `research/data-sources.md` and `data/business.json`.

**In plain words (for Søren), after fix round 1:** the builder fixed everything I asked for, and I checked each fix in the browser. With the real Press fonts the page now looks like the theme. It still loads fast and only talks to its own address. Two things are left, and **both are yours**:
1. Swap in a real photo that the shop owns (M1).
2. Decide the wording "Vi er specialister i Specialized" (S6).

Apart from those, I would sign the page off for publishing.

> Lighthouse is **not installed** and wasn't installed. Speed, SEO and accessibility were checked by hand with headless Chrome (computed styles, the accessibility tree, the network log, `PerformanceObserver`, real Tab key presses, real JavaScript-off, and simulated slow 4G with 4× CPU slowdown). Lighthouse scores are **my estimates**, not measurements. Theme claims are **[unverified]** until the Baseline theme files arrive.

---

## Re-check after round 1 (2026-10-09, evening)

**What changed since my first review:**
- **The standalone page is the live path now:** `https://www.byman-cykler.dk/`, with `build/` as the web root.
- **`PAGE_URL` is set.**
- **The real fonts are self-hosted** in `build/fonts/`: Instrument Serif 400 and Space Mono 400/700, latin woff2, with the OFL licences.
- **What I checked:** every M/S/N item A8 reported, plus a regression pass.

### Status of the findings

| ID | Status | Evidence |
|---|---|---|
| **M1** temporary photo | **Open: Søren's action** | Still `facade-placeholder.png` (515 × 388). `og:image` is now this 514 px photo too. A real photo also gives a 1200 px share image. |
| **M2** footer target size | **Fixed** | 1280 (mouse): INSTAGRAM 77 × 24 at y 2086, FACEBOOK 69 × 24 at y 2110 (pitch 24 px, so 2.5.8 is met). Footer phone/email 24 px too, also at 768/1920. Instagram's focus ring no longer covers FACEBOOK (`qa-r1-focus.png`). Touch screens stay at 44 px. |
| **S1** Kontakt tap area | **Fixed** | 375 (touch): `elementFromPoint` hits the link in all 4 corners of the 284 × 45 px cell, at ±20 px and 60 px right of the text. The "Telefon"/"E-mail" label cell is not a link. With a mouse, `::before` is `none`, so nothing changes. The focus ring still sits on the link text. |
| **S2** pause focus ring | **Fixed** | The ring is now 3 px white + 2 px red around the visible 33 px circle, inside the 44 px button. The outline is transparent but still present for Windows high-contrast mode (`qa-r1-focus.png`, at 1280 and 375). The red now always touches white (3.72:1). |
| **S3** test switches on the live site | **Fixed** | Tested with Chrome's `--host-resolver-rules` mapping `www.byman-cykler.dk` (and `qa-test.example`) to the local server, so `location.hostname` was the real production name and no request left the machine. `?now=2026-10-12T10:00&special=2026-10-12,closed,Falsk besked` was **ignored**: the real clock was used and the notice stayed hidden. The same URL on `localhost` and `127.0.0.1` still works. `?nojs=1` works everywhere and is harmless. Code: `app.js` line 64 accepts only `file:`, `localhost`, `127.0.0.1`, `[::1]` and `*.localhost`; otherwise it reads an empty query string. |
| **S4** relative share/Google image | **Fixed** | `<link rel="canonical" href="https://www.byman-cykler.dk/">`, `og:url` the same, `og:image` = `https://www.byman-cykler.dk/img/photo-c60b4a91-514.jpg` (with width/height/alt). JSON-LD `url` and `image` are absolute `https`, and the JSON-LD parses. In a scratch copy with `PAGE_URL = null`, the build lists a Danish warning under "Advarsler" and leaves out `og:image`/JSON-LD `image` instead of writing relative URLs. |
| **S5** "Lukket" after a colon | **Fixed** | JS: "Bemærk: ændrede åbningstider mandag 12. oktober: lukket. God jul." No-JS (scratch build with a `specialHours` entry): "…onsdag 14. oktober: lukket. Lagerdag." The tables still say "Lukket". |
| **S6** "Vi er specialister i Specialized" | **Open: Søren's decision** (final gate) | Unchanged in `copy-da.md` `brands.intro`. |
| **N1** strip focus ring | **Done** | `.status` has 7 px side padding. The ring is clear of ● and ↓ (`qa-r1-focus.png`). |
| **N2** orphan words | **Done** | `text-wrap: pretty`. The brand intro now ends "…på tværs / af mærker." at 1280, and the 320 intro ends "og service.". |
| **N7** build cosmetics | **Done** | `<img width="514" height="388">` matches the file. The log says "with JPEG". The no-photo warning says "stor rød skrift". |
| **N10** footer e-mail overflow | **Done** | `.foot a { overflow-wrap: anywhere }`. At 320 px with 200% text the footer no longer overflows; only the hours table does (see below). |
| N3, N4, N5, N6, N8, N9, N11, N12, N13, N14 | Open (optional) | Not changed. N4–N6 are copy items for A5/Søren. |

### Regression pass

- **Layout at 320, 375, 768, 1280 and 1920** (`qa-r1-page-*.png`):
  - `scrollWidth` equals the viewport at every width, with no overlaps.
  - The h1 takes 2 / 2 / 1 / 2 / 1 lines. It now fits in 2 lines at 320 too, because Instrument Serif is narrower.
  - At 375 the buttons start at 557 px and the hours table at 795 px, unchanged.
  - The wordmark fills 86% of its row on one line at every width from 320 to 2560.
  - The scrolling name track (half = 1009 px mobile / 2463 px desktop) always covers the frame.
- **Brand grid, 7 logos:** 375 = 2 columns × 4 rows, 768/1280 = 4 × 2. Tile span 1, last row closed, logo sizes identical to before (`qa-r1-brands-7-{375,768,1280}.png`).
- **Status spot checks**, all correct:

  | Time | Status shown |
  |---|---|
  | Fri 10:30 | Åbent nu · lukker 16.00 |
  | Fri 16:00 | Lukket · åbner i morgen 11.00 |
  | Sat 14:00 | Lukket · åbner mandag 09.00 |
  | Sun 12:00 | Lukket · åbner i morgen 09.00 |
  | Wed 10:59 | Lukket · åbner i dag 11.00 |
  | Mon 00:00 | Lukket · åbner i dag 09.00 |
  | Special 10–12 day at 10:30 | Åbent nu · lukker 12.00 |
  | Special closed day | Lukket · åbner i morgen 09.00 |
  | Two specials | Table |
  | Special in 15 days | Hidden |
- **No-JS:**
  - With JavaScript really off: the "Åbningstider ↓" link, no today marker, one still name, no pause button, real fonts used (`qa-r1-nojs-real-375.png`).
  - Reduced motion: no animation, no pause button.
- **Focus and tap targets:**
  - Real Tab, 12 stops in the same order as before, all `:focus-visible` with a visible ring.
  - At 375 every button, strip, pause and footer link is ≥ 44 px tall. "Find vej" has the 44 px hit layer, and Kontakt is fixed (S1).
- **Accessibility tree:** unchanged. One h1, four h2, named regions and tables, "Fredag (i dag)", the logos named, the pause button `pressed="false"`.
- **Fonts and requests:**
  - `CSS.getPlatformFontsForNode` reports **Instrument Serif** for h1/h2/wordmark/tile/scrolling name and **Space Mono** for everything else (not installed on this Mac, so they come from `build/fonts/`).
  - Only "→" (U+2192, not in the latin subset) falls back to Menlo: 1 glyph per button and per "Find vej". "↓" is in Space Mono.
  - `document.fonts`: all 3 faces `loaded`. Each font file is requested once (the preload and `@font-face` match on `crossorigin`). Space Mono 700 loads only when JS bolds today's row.
  - **All 10 requests are same-origin**: index.html, 3 woff2, tokens.css, styles.css, photo AVIF, app.js, 2 logo PNGs.
  - `grep` finds no `googleapis`, `gstatic`, `@import` or external `url(http…)`.
  - The OFL licence texts are in `build/fonts/`.
- **Weight:**
  - 161 KB uncompressed (HTML 29.9 + CSS 38.5 + JS 10.3 + fonts 33.3 + photo AVIF 24.4 + logos 21.8). That is **about 105 KB transferred** with gzip/brotli (text about 26 KB gzipped; woff2/AVIF/PNG are already compressed). 10 requests.
  - The fonts add 33 KB. That's fine.
- **Speed under simulated slow 4G** (150 ms latency, 1.6 Mbit/s, 4× CPU, cache off):
  - FCP 0.97 s, LCP 1.0 s (the photo), **CLS 0** at 375 and 1280.
  - No layout shift from the font swap (preload + `font-display: swap`).
  - Estimated Lighthouse: Performance 95–100, Accessibility about 85–92 (the accepted red contrast), Best practices about 95 (the temporary photo's resolution), SEO about 100 (canonical present now).
- **Head and JSON-LD:**
  - Title 59 characters, description 141. `og:type/locale/site_name/title/description/url/image(+width/height/alt)` present.
  - JSON-LD parses; `@type` BikeStore; `url`, `image`, `hasMap` and `sameAs` are all absolute `https`.
  - No `[MANGLER]`. Facts unchanged.
- **Rebuild:** a scratch copy rebuilt to a **byte-identical** `index.html`, and identical `img/`, `fonts/` and `tokens.css`. Then deleted.

### The "hours table about 30 px too wide at 320 px with 200% text" claim: **acceptable** (now N18)

- **Measured:** at 320 px CSS width with the page text doubled (root 175% = 2 × the theme's 87.5%, so 28 px body text):
  - the hours table is 336 px wide in a 306 px cell (day 120 px + time 217 px; `qa-r1-320-text200.png`);
  - the page scrolls 30 px sideways;
  - nothing else overflows;
  - nothing is cut off or hidden, and all content can be reached.
- **Why it's acceptable:**
  1. **WCAG 1.4.10 Reflow** is tested at 320 px with *normal* text size (= 400% zoom on a 1280 px screen). That passes (`scrollWidth` 320).
  2. **WCAG 1.4.4 Resize text** is tested at 200% zoom on a normal screen. That passes at 640 px and at 1280 px with 200% text. 320 px *plus* 200% text is an 8× combination that WCAG doesn't ask for.
  3. The hours table is a genuine two-column **data table** (day ↔ time). 1.4.10 explicitly exempts content that needs a two-dimensional layout for its meaning.
  4. At **360 px**, the most common Android width, with 200% text it **fits** (`scrollWidth` 360). Only 320–340 px phones are affected.
- **Optional cheap improvement (N18):** let the time cell break after the en dash when space runs out, for example `<wbr>` after "–" plus `white-space: normal` on `.hours td`. Then even 320 px + 200% fits. Not required.

### New observations (Nice to have)

| ID | Where | What | Suggestion |
|---|---|---|---|
| N15 | fonts | "→" in buttons and "Find vej" is drawn in Menlo/Consolas, because the latin woff2 subset has no U+2192. It's barely visible at 14 px | Accept, or add the arrow to the subset if the font licence allows and the glyph exists |
| N16 | `index.html` / `styles.css` | `<html data-fonts="fallback">` is now misleading: the real fonts load and the stacks just name them first. `--wordmark-divisor: 5.2` is overridden in `styles.css` while `design/tokens.css` still says 5.8, so the token file no longer tells the truth | Rename or remove the attribute (keep the stack swap). Move the 5.2 into `design/tokens.css` with a note |
| N17 | wordmark | If the web font fails or is still swapping on **Windows/Linux**, the fallback Times New Roman is 107% of the row, so "Byman Cykler" wraps to 2 lines (measured: 2 lines, 665 px each at 1280). Bodoni 72 on Mac fits (96%). It's below the first screen, so there's no CLS | Accept. Or add a size-adjusted fallback `@font-face` for Times New Roman |
| N18 | `.hours td` | See the verdict above | `<wbr>` after "–" + `white-space: normal` |
| N19 | Søren / A10 guide | The page's canonical is `https://www.byman-cykler.dk/`, but `business.json` `website` and probably the Google Business Profile say `https://byman-cykler.dk` | When the domain moves: redirect apex → www in Vercel, and update the Google Business Profile website (and `business.json`) to the www address |

### Counts after round 1

**Must fix 1** (M1, Søren's action) · **Should fix 1** (S6, Søren's decision) · **Nice to have 15 open** (N3–N6, N8, N9, N11–N19; N1, N2, N7 and N10 done).

**Sign-off:** apart from M1 (the photo) and S6 (the wording), I sign the page off for publishing. These were outside what I could test, and are for Søren/A10:
- the Vercel/DNS setup (web root = `build/`, apex → www, HTTPS);
- a quick check on a real iPhone and a real Android phone.

---

## Original review (before fixes)

Kept unchanged below for the record. The statuses above supersede it.

## Summary

| Area | Status | Main findings |
|---|---|---|
| 1. Facts | **Pass** | Name, address, phone (text + 3 × `tel:`), email (text + 3 × `mailto:`), all 7 hours rows, CVR, legal name, Instagram, Facebook, Maps link and JSON-LD all match `business.json` and its sources. No `[MANGLER]`. No stale facts (no Instagram-bio hours, no "Byman Sport"). |
| 2. Accessibility | **Needs fixes** | **M2:** footer links fail WCAG 2.5.8 (target size) for mouse users. **S1:** the Kontakt phone/email rows look 44 px tall on phones, but only the 16 px text can be tapped. **S2:** the pause button's focus ring sits on the photo, not on a white base. Everything else passes: one h1, no skipped levels, landmarks, `lang="da"`, a real hours table, hidden "(i dag)", `aria-hidden` scrolling text, a working pause button, reduced motion respected, silent status updates, reflow at 320. |
| 3. Status logic | **Pass** | 31 `?now=` / `?special=` cases correct, including the midnight edges, Wednesday, Saturday after 14.00, Sunday, special closed today, and the 14-day window. It uses Copenhagen time even when the computer is set to Los Angeles or Tokyo. No-JS works (`?nojs=1` and with JavaScript really off). **S3:** the test switches also work on the live site. |
| 4. Layout | **Pass** | No sideways scrolling at 320, 375, 768, 1024, 1280 or 1920, and no overlaps. The brand grid closes the last row with 7, 12 and 25 logos at every width, and "…og mange flere" follows the spec. One orphan word in the brand intro (N2). |
| 5. Speed | **Pass** (est. Perf 95–100) | 7 requests, about 70 KB transferred with gzip (119 KB uncompressed), no external requests, CLS 0, the LCP image is 24 KB AVIF with `fetchpriority="high"`, and all sizes are set. |
| 6. Theme match | **Good** | Colours, 1 px lines, the grid-gap trick, radii, button shape, padding, uppercase labels, the 7 px dot and the → arrows all match the measured Press values. The footer menu is *tighter* than Press (17 px line pitch vs about 20.5 px), and fixing M2 brings it closer. The fonts can't match (accepted). |
| 7. Temporary photo | **Must replace** | M1, Søren's action. |
| 8a. Danish | **Good, small fixes** | Natural and calm. **S5:** a capital "Lukket" after a colon in the special-hours sentence. **S6:** the "specialister i Specialized" claim needs your confirmation. Typography: en dashes ✓, ellipsis character ✓. |
| 8b. JSON-LD / meta | **Pass, one fix** | Parses, `BikeStore`, hours correct, special dates follow Google's convention, `sameAs` correct. Title 59 characters, description 141. **S4:** `og:image` and the JSON-LD `image` are relative URLs. |
| 8c. Privacy / secrets | **Pass** | No secrets, trackers, fonts from Google, map embed or cookies. Only same-origin requests. |
| 8d. Rebuild | **Pass** | A rebuild of a scratch copy produced a **byte-identical** index.html and images. Adding a brand really is one entry + one logo + one command. Bad data stops the build with a clear Danish message. |

**Counts:** Must fix 2 · Should fix 6 · Nice to have 14.

---

## Must fix

### M1. Replace the temporary photo before going live: **Søren's action, not the builder's**
- **What:** `assets/img/facade-placeholder.png` (515 × 388 px), shown as `build/img/photo-c60b4a91-514.{avif,jpg}`.
- **Why:**
  1. It is low resolution. Even in the contained frame it is shown at 1.5× its size on desktop (772 × 582 px), and Lighthouse's "appropriate resolution" check would flag it.
  2. **We must own the rights** to any photo we publish. The origin of this one isn't documented as shop-owned.
- **What's needed:** a photo the shop owns, landscape, daylight, **at least 2400 px wide, ideally 3600 × 2025 (16:9)**, with the BYMAN sign and the door in the middle third. Remove the location data (Preview → Tools → Show Inspector → GPS → Remove Location Info).
- **Swap steps (tested in a scratch copy with a 3600 × 2025 test image; it worked):**
  1. Put the file in `assets/img/`.
  2. Change `PHOTO_FILE` in `build.mjs`.
  3. Rewrite `photo.alt` in `design/copy-da.md` so it describes the new photo.
  4. Run `node placeholder/build.mjs` on the Mac.

  The page then switches to full width by itself. It makes 800 / 1200 / 1600 / 2400 / 3200 versions, and a 375 px phone loads the 800 px AVIF (28 KB).
- **Verify:** the build log says `→ full`, and the photo looks sharp at 1280 and 1920.

### M2. Footer links are too close together for mouse users (WCAG 2.2 AA 2.5.8 Target Size)
- **File / selector:** `build/styles.css`, lines 287–290: `@media (pointer: fine) { .menu-link { min-height: 0; } .foot .inline-link { display: inline; min-height: 0; } }`
- **Evidence:**
  - At 1280 (mouse), INSTAGRAM is 76 × 17 px at y = 2059 and FACEBOOK is 67 × 17 px at y = 2076. That is a 17 px pitch with 0 px gap, so the 24 px spacing circles overlap. That fails 2.5.8.
  - The same applies to the footer phone and email (16 px tall, 17 px apart). Those two are saved by the "equivalent control" exception (the buttons), but should get the same fix.
  - Instagram's focus ring covers the top of the FACEBOOK text: `qa/screenshots/qa-focus-footer-1280.png`.
  - The Press demo's own footer menu has about a 20.5 px pitch, so ours is tighter than the theme.
- **Expected:** every footer link is at least 24 px tall (or 24 px apart) with a mouse. Touch screens stay at 44 px.
- **Fix (suggested):** replace those lines with:
  ```css
  @media (pointer: fine) {
    .menu-link { min-height: 24px; }
    .foot .inline-link { display: inline-flex; min-height: 24px; }
  }
  ```
- **Verify:**
  1. At 1280, `getBoundingClientRect()` of `.menu-link` and `.foot .inline-link` gives a height ≥ 24, with consecutive tops ≥ 24 px apart.
  2. Tab to INSTAGRAM: the ring no longer touches FACEBOOK.
  3. At 375 with touch, they are still 44 px.

---

## Should fix

### S1. Kontakt phone and email: the row is 44 px, but the tappable part is only the 16 px text
- **File / selector:** `build/styles.css`, lines 203–205 (`@media (pointer: coarse) { .details th, .details td { padding-block: … } }`). The padding is on the table cells, not on the link.
- **Evidence:** at 375 (touch), `a[href^=tel]` in `.details` is 93 × 16 px. `elementFromPoint` hits the link only within ±8 px of its centre, and ±15 px and ±21 px land on the `TD`. The same applies to the email link. By comparison, "Find vej →" (`.hit`) is hit across the full ±21 px. Spec §8.3 promises a 44 px target here. WCAG 2.5.8 still passes thanks to spacing, but phone and email are the page's main contact actions.
- **Expected:** the phone and email links can be tapped across the whole 44 px row height. Nothing moves visually.
- **Fix (suggested):** reuse the existing invisible-layer technique:
  - either add `hit` to these two links in `build.mjs` (line 595, `phoneLink`/`mailLink` for the Kontakt table only) together with `.details .hit { position: relative; display: inline-block; }`;
  - or write the equivalent `::before` rule inside the `pointer: coarse` block.
- **Verify:** at 375 `--mobile`, `elementFromPoint(cx, cy ± 20)` on both links returns the link, and the screenshot looks unchanged.

### S2. The pause button's focus ring is drawn on the photo, not on a white base
- **File / selector:** `build/styles.css`, `.hero__pause` (lines 122–142). The global `:focus-visible` outline goes around the invisible 44 px box, 3 px out, so it lands about 8 px outside the visible 33 px white circle, directly on the photo.
- **Evidence:** `qa/screenshots/qa-focus-pause-375-1280.png`. I sampled the pixels around the ring: red ring vs the photo is a median 3.3:1 at 375 and 3.7:1 at 1280, but the **minimum is 1.0:1 at 375 and 1.5:1 at 1280**, where the ring crosses the grey facade. The real photo may be darker. WCAG 1.4.11 asks for 3:1 against the colours next to the indicator.
- **Expected:** the ring hugs the visible white circle with a white gap, like the other buttons (3 px white + 2 px red), so its contrast never depends on the photo.
- **Fix (suggested):**
  ```css
  .hero__pause:focus-visible { outline-color: transparent; }   /* keeps an outline in Windows high-contrast mode */
  .hero__pause:focus-visible::before {
    box-shadow: 0 0 0 var(--focus-ring-offset) var(--color-bg),
                0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }
  ```
- **Verify:** Tab twice at 375 and 1280. The ring sits right around the white circle with a white gap, inside the 44 px box, and is not clipped by the photo's rounded corner.

### S3. The test switches `?now=` and `?special=` also work on the published page
- **File:** `build/app.js`, lines 59–78.
- **Evidence:** anyone can share a link like `…/index.html?special=2026-10-12,closed,<any text>`, and the page then shows that text in the official "Bemærk" / "SÆRLIGE ÅBNINGSTIDER" box (tested: `qa/screenshots/qa-special-375.png`). `?now=` can show a fake "Åbent nu". This is not a script injection, because `textContent` is used, but it lets people fake the shop's hours on its own page.
- **Expected:** the switches only work locally. `?nojs=1` can stay, since it's harmless.
- **Fix (suggested):** `var TEST = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || /\.localhost$/.test(location.hostname);`, then read `special` and `now` from the URL only when `TEST` is true. Update the comment block in `app.js` and `build.mjs`.
- **Verify:**
  1. On `http://localhost:3002/build/index.html?special=2026-10-12,closed&now=2026-10-12T10:00`, the notice still shows.
  2. Open the same URL through the Mac's network address (for example `http://192.168.x.x:3002/…`): no notice appears, and the status shows the real time.
  3. **Note for the orchestrator:** A10's Shopify Liquid version shouldn't carry these switches either.

### S4. `og:image` and the JSON-LD `image` are relative URLs
- **File:** `build/index.html` head (`<meta property="og:image" content="img/photo-c60b4a91-514.jpg">`) and JSON-LD `"image": "img/photo-c60b4a91-514.jpg"`. Cause: `PAGE_URL = null` in `build.mjs`, line 99.
- **Evidence:** the Open Graph protocol requires an absolute URL, so Facebook, Messenger and LinkedIn previews would show no picture. Google says image URLs "must be crawlable and indexable". `og:url` and the canonical link are missing for the same reason. The build only prints a "note", not a warning.
- **Expected:** absolute `https://…` image URLs plus canonical and `og:url`. The code already supports this once `PAGE_URL` is set.
- **Who:**
  - **Søren** decides the public address of the standalone page (for example the Vercel address or a domain).
  - **The builder** sets `PAGE_URL` then. Until that happens, the builder should move the `PAGE_URL` note into the "Advarsler / warnings" list, so it isn't missed.
  - If the standalone page is never published (Shopify-only), this item is moot.
- **Verify:** after setting it, `og:image` and JSON-LD `image` start with `https://`, and `<link rel="canonical">` and `og:url` are present.

### S5. Special-hours sentence: capital "Lukket" after a colon
- **Files:** `build/app.js` line 152 (`hoursText(x)` in the one-entry sentence) and `build.mjs` line 537 (`specialHoursText`).
- **Evidence:** `?now=2026-10-12T10:00&special=2026-10-12,closed` shows **"Bemærk: ændrede åbningstider mandag 12. oktober: Lukket"**. In Danish, a lower-case letter follows a colon when what comes after isn't a full sentence. The table cells should keep "Lukket", but in running text it should be "lukket". Two colons in one line also read a little stiffly.
- **Expected:** "Bemærk: ændrede åbningstider mandag 12. oktober: lukket", with the tables unchanged. Optionally A5 can rephrase the template, for example "Bemærk – ændrede åbningstider {date}: {hours}".
- **Fix:** in the one-entry sentence only, use the lower-cased closed word (`T.closed.toLowerCase()` / `S['hours.closed'].toLowerCase()`).
- **Verify:**
  1. The URL above shows "…: lukket".
  2. `?special=2026-10-12,closed&special=2026-10-13,10:00,13:00` (table form) still shows "Lukket".
  3. With JS off (build a test entry), the same applies.

### S6. Brand intro: confirm the claim "Vi er specialister i Specialized": **Søren's decision (final gate), not the builder's**
- **File:** `design/copy-da.md` `brands.intro`. A5 itself marked it "fra Sørens brief – bekræft før lancering".
- **Evidence:** the starting data says "Specialized is the main brand". "Specialister i Specialized" is a stronger claim, and it can read as an official dealer or specialist status. A2 couldn't confirm the shop in Specialized's dealer finder (data-sources.md). Also, "på tværs af mærker" sounds a little translated.
- **Expected:** Søren confirms or picks a softer wording, for example: *"Specialized er vores hovedmærke, og vi har stor erfaring med landevejscykler og elektroniske gearsystemer. Værkstedet servicerer cykler af alle mærker."* The builder only rebuilds if the string changes.
- **Verify:** the string in `copy-da.md` is confirmed, and the build has been rerun.

---

## Nice to have

| ID | Where | What and evidence | Suggested change | Verify |
|---|---|---|---|---|
| N1 | `styles.css` `.status` | The inset focus ring touches the ● dot and the ↓ arrow, because the link has 0 padding (`qa-focus-status-1280-375.png`) | `.status { padding-inline: var(--space-xs); }` | Tab once: the ring is clear of the dot and arrow |
| N2 | `styles.css` `.lede` | Orphan words: "mærker." alone on the last line of the brand intro at 768, 1280 and 1920; "service." alone at 320 (`qa-page-1280.png`, `qa-page-320.png`) | `.lede { text-wrap: pretty; }` (harmless where unsupported) | No single-word last line at those widths in Chrome |
| N3 | `styles.css` footer, touch | On touch screens the 44 px inline-flex links push the phone/email/social text about 14 px lower than the text in the neighbouring footer cells (`qa-page-375.png`, bottom) | `@media (pointer: coarse) { .foot ul { margin-block: calc((var(--tap-target) - 1em * var(--line-height-body)) / -2); } }` | The first link's text starts at the same distance from the cell's top line as the "Byman Cykler" text |
| N4 | `copy-da.md` `brands.more` | Danish convention (Retskrivningsordbogen, udeladelsesprikker) puts a space after the dots when whole words are left out: "… og mange flere". Now "…og mange flere". **A5 to confirm** | Possibly `… og mange flere` (non-breaking space) | Text in the tile |
| N5 | `copy-da.md` `photo.alt` (also `og:image:alt`) | "i en rund ramme": the BYMAN badge is a rounded rectangle, not round | "i en ramme med runde hjørner". It gets rewritten for the real photo anyway (M1) | alt text |
| N6 | `copy-da.md` hero strings | The eyebrow "Ny webshop på vej", the h1 "…Webshoppen er på vej." and the intro "…bygge en ny webshop" say the same thing three times in three lines | A5 could use a sourced eyebrow, for example "Cykelbutik og værksted på Østerbro" | Read-through |
| N7 | `build.mjs` cosmetic | `<img width="515">`, but the file is 514 px (even-cropped; harmless, since the frame sets the aspect ratio). The no-`sips` log says "photo … KB JPEG" for a PNG. The no-photo warning says "rødt bånd", but it's red text on white | Write the generated file's width; fix the two log texts | Build log / attributes |
| N8 | Vercel caching | Photo files are fingerprinted (`photo-<hash>-…`), so they can be cached forever. CSS/JS/logos aren't fingerprinted and should keep revalidating | A `vercel.json` header for `/placeholder/build/img/photo-*`: `Cache-Control: public, max-age=31536000, immutable` (only if/when published on Vercel) | `curl -I` on Vercel |
| N9 | `build.mjs` / `app.js` | Spec §6.4 says the status script is *inline* at the end of `<body>`. The build loads `app.js` as a file. On a slow connection the strip may briefly show "ÅBNINGSTIDER ↓" before the status. Not measurable here, because the local server is too fast | Inline `app.js` in the build, or accept | Throttled load in DevTools |
| N10 | `styles.css` footer | At 320 px with 175% text-only zoom, the footer e-mail overflows (page 369 px wide). Browser zoom/reflow passes, so this isn't a WCAG fail | `.foot a { overflow-wrap: anywhere; }` | 320 + `html { font-size: 175% }`: `scrollWidth` = 320 |
| N11 | Screen readers | Chrome exposes the CSS UPPERCASE in accessible names ("RING TIL OS", "ÅBENT NU · LUKKER 16.00"). Some voices may spell short all-caps words ("OS") or read the "·" aloud. **[unverified: no screen reader available]**. Press does the same | Check once with VoiceOver (Danish voice). Only act if it sounds wrong | VoiceOver |
| N12 | `data/brands.json` order | Specialized, the main brand, is the lightest-looking logo on phones (147 × 15 px vs Silca 147 × 29) because its long shape hits the width cap. Inherent to the logo | Søren may want it first (order in the file = order on the page) | By eye |
| N13 | Holidays | Past special dates stay in the no-JS notice and the JSON-LD until the next build (JS hides them correctly) | A10's guide: "rebuild after each holiday" | — |
| N14 | `index.html` `<link rel="icon" href="data:,">` | No favicon in the browser tab | Add one when the Byman logo file exists | — |

---

## Known and accepted (Søren's decisions)

These are **not defects**. They are listed so nobody "fixes" them by mistake.

| Decision | What I measured |
|---|---|
| **Press red #FF2E00 for all text** | 3.72:1 on white. All text under 24 px fails WCAG 1.4.3, and so do the 21.88 px headings below 1024 px. The offered fix was #E02800 (4.70:1). **Also covered by this decision:** the white "RING TIL OS →" text on the red button is 3.72:1 too (option B would have darkened the button). Passing as large text or non-text: the h1, the desktop headings, the red focus ring (3.72 ≥ 3:1), button borders, "Find vej" underline, notice box. The pink #FFBFBF lines (1.56:1) are decoration only. |
| Logos in Press red-orange | DT Swiss's guidelines allow only black/white/grey. Accepted at Gate 2. |
| MET as a full square badge, one colour, letters cut out | Renders 50 × 47 (phone) / 64 × 60 (desktop) / 57 × 54 (6-column grid), as specified. |
| No Google rating | Not on the page ✓ (3.6★ stays only in `business.json`). |
| No newsletter on the standalone page | Not on the page ✓. |
| ~~No font downloads, fallback stacks~~ **Superseded after round 1** | Søren approved self-hosting the real fonts. They now render as Instrument Serif / Space Mono (see the re-check), so this is no longer a known deviation. Before round 1: headings in Bodoni 72, everything else in Menlo. |
| "Byman Cykler" as text | Wordmark row and scrolling name ✓ (`translate="no"`). |
| Times shown as "09.00" | ✓ everywhere, with an en dash and no spaces ("09.00–16.00"). |
| The page will mainly be the Shopify password page | This build is the visual reference (path 2). The JSON-LD only matters here. |
| From the spec (accepted earlier) | 44 px buttons, strip and footer links on touch screens (Press is 33 / 32 / about 20 px). The contained temporary photo with white sides. DT Swiss below its 145 px minimum only at 320 px. With 12 (or 8, 16 …) logos the "…og mange flere" tile takes a whole row of its own. The pause button exists only on the standalone page. |

---

## Details by area

### 1. Facts

| Fact | On the page | `business.json` | Source |
|---|---|---|---|
| Name | Byman Cykler (strip, title, footer, wordmark, JSON-LD) | `name` | Google Maps, Krak, Facebook, Instagram |
| Legal name / CVR | "BYMAN CYKLER I/S · CVR 14579656" (footer), JSON-LD `legalName` | `legalName`, `cvr` | datacvr.virk.dk/enhed/virksomhed/14579656 |
| Address | Øster Farimagsgade 32, 2100 København Ø (Find os, footer, JSON-LD) | `address` | CVR + Krak (Google drops the "Ø"; noted in data-sources) |
| Phone | "35 42 51 56" × 2 as text, `tel:+4535425156` × 3 (button, Kontakt, footer), JSON-LD `+4535425156` | `phone` | Google, Krak, Facebook |
| Email | `bymancykler@gmail.com` × 2 as text, `mailto:` × 3, JSON-LD | `email` | byman-cykler.dk `mailto:`, Facebook, confirmed at Gate 1 |
| Hours | Mon/Tue/Thu/Fri 09.00–16.00, Wed 11.00–17.00, Sat 11.00–14.00, Sun Lukket. The `data-open`/`data-close` attributes match | `openingHours` | Google Business Profile, confirmed at Gate 1 |
| Social | instagram.com/byman.cykler/, facebook.com/byman.cykler.dk/ (footer + `sameAs`) | `social` | Linked from byman-cykler.dk |
| Maps | `google.com/maps/search/?api=1&query=Byman+Cykler+Øster+Farimagsgade+32+2100+København+Ø` (2 links + `hasMap`) | `google.mapsUrl` | Google Maps URLs format |
| Geo | 55.691656, 12.5766201 | `geo` | Google Maps URL |

- `grep` of `build/` found no `MANGLER`, no "Byman Sport", no Instagram-bio hours (09–15) and no rating.
- The JPEG's EXIF holds only an ExifIFD pointer, with **no GPS**.

### 2. Accessibility (WCAG 2.2 AA)

- **Structure (from Chrome's accessibility tree):**
  - one `h1` ("Butik og værksted er åbne. Webshoppen er på vej."), then h2: Åbningstider, Kontakt, Find os, Mærker vi forhandler. No skipped levels.
  - Landmarks: `main`, `contentinfo`, and 5 named regions. The status strip sits before `main`, outside a landmark. That's acceptable, since there's no nav.
  - `lang="da"` ✓.
- **Images:**
  - The photo alt is in Danish and descriptive.
  - The 7 logos are `role="img"` with the brand name (ENVE, Specialized, Silca, MET, Polymer Workshop, GripGrab, DT Swiss).
  - The CSS arrows have empty alt text (`content: "→" / ""`).
  - The scrolling "Byman Cykler." is `aria-hidden` and is not in the tree.
- **Hours table:**
  - a real `<table>` named "Åbningstider", with `th scope="row"` for each day;
  - today = bold + dot + hidden " (i dag)", exposed as rowheader "Fredag (i dag)". Exactly one row is marked, in all 31 cases.
- **Status line:**
  - it's a link, with no `aria-live`, so the 60-second refreshes are silent (no live-region spam);
  - its text is plain sentence case in the DOM ("Åbent nu · lukker 16.00"), and the capitals come from CSS;
  - without JS it is a neutral "Åbningstider ↓" link and never says "Åbent nu".
- **Scrolling text:**
  - pause button `aria-label="Sæt rulleteksten på pause"` with `aria-pressed`;
  - a click stops the animation (the position stayed at −31.9 px for 1.5 s) and a second click resumes it;
  - with `prefers-reduced-motion: reduce`: no animation, 1 centred copy, no pause button, no smooth scroll;
  - hover pause only on hover devices.
- **Focus** (real Tab presses, 13 stops at 1280):
  - Order: strip → pause → 3 buttons → phone → email → Find vej → footer ×4.
  - Every stop shows a 2 px red ring with 3 px offset (strip −2 px inset).
  - No fixed or sticky elements, so nothing hides focus (2.4.11 ✓).
  - Ring around the filled button: red + white gap, fine (`qa-focus-buttons-1280-375.png`).
  - Problems: footer (M2), pause ring (S2), strip ring touching the dot (N1).
- **Tap targets at 375 (touch):**

  | Element | Size | Result |
  |---|---|---|
  | Status strip | 228 × 44 | ✓ |
  | Pause button | 44 × 44 | ✓ |
  | 3 buttons | 361 × 44, 15 px apart | ✓ |
  | Kontakt phone / email | 93 × 16 / 177 × 16 (row 44) | S1 |
  | Find vej | 84 × 17 + 44 px invisible layer (hit across ±21 px) | ✓ |
  | Footer links | 44 tall | ✓ |

  At 768 with touch: same. At 1280/1920 with a mouse: buttons 33 px (Press), footer links 17 px (M2).
- **Reflow and text:**
  - 320 px: `scrollWidth` = 320, the h1 takes 3 balanced lines.
  - WCAG 1.4.12 text spacing at 320: no overflow, nothing clipped.
  - Root font 175% at 1280: no overflow.

### 3. Status logic

All results as expected. The clock is frozen with `?now=`. 2026-10-09 is a Friday.

| Case | `?now=` (+ `special`) | Status shown | Today row |
|---|---|---|---|
| Open | 2026-10-09T10:30 | Åbent nu · lukker 16.00 (● filled) | Fredag (i dag), 09.00–16.00 |
| Before opening | 2026-10-09T08:59 | Lukket · åbner i dag 09.00 (○ ring) | Fredag |
| Opening minute | 2026-10-09T09:00 | Åbent nu · lukker 16.00 | |
| Last minute / closing | 15:59 / 16:00 | Åbent nu · lukker 16.00 / Lukket · åbner i morgen 11.00 | |
| Saturday | 10-10T10:59 / 13:59 / 14:00 | åbner i dag 11.00 / Åbent nu · lukker 14.00 / **Lukket · åbner mandag 09.00** | Lørdag |
| Sunday | 10-11T12:00 and T23:59 | Lukket · åbner i morgen 09.00 | Søndag, Lukket |
| Midnight | 10-12T00:00 (Mon) / 10-13T23:59 (Tue) | Lukket · åbner i dag 09.00 / Lukket · åbner i morgen 11.00 (Wednesday) | |
| Wednesday | 10-14T09:30 / 11:00 / 16:30 / 17:00 | åbner i dag 11.00 / Åbent nu · lukker 17.00 / same / Lukket · åbner i morgen 09.00 | Onsdag |
| Special closed today | 10-12T10:00 & `2026-10-12,closed` | Lukket · åbner i morgen 09.00 | Mandag, **Lukket**. Notice shown |
| Special hours today | 10-12T09:30 / 10:30 / 13:00 & `2026-10-12,10:00,12:00` | åbner i dag 10.00 / Åbent nu · lukker 12.00 / Lukket · åbner i morgen 09.00 | Mandag, 10.00–12.00 |
| Closed tomorrow changes next opening | 10-09T17:00 & `2026-10-10,closed` | Lukket · åbner mandag 09.00 | |
| 7–14 days ahead | 10-09T17:00 & closed 10–16 Oct | Lukket · åbner lørdag 17. oktober 11.00 | |
| Nothing within 14 days | closed 10–24 Oct | Lukket i dag | |
| Special in exactly 14 days | `2026-10-23,closed` | Notice shown: "…fredag 23. oktober: Lukket" | |
| Special in 15 days | `2026-10-24,closed` | Notice hidden ✓ | |
| Past special / invalid times / bad date / bad now | `2026-10-01` / `14:00,10:00` / `2026-13-01` / `now=bad` | Ignored, with a console warning | |
| Two entries + note | `…12,closed,Lagerdag…&…13,10:00,13:00` | "SÆRLIGE ÅBNINGSTIDER" table, note on its own row (`qa-special-375.png`, `qa-special-1280.png`) | |
| Visitor in another time zone | real clock, Chrome set to Los Angeles / Tokyo | The same Copenhagen result as with Copenhagen | |

- **No JS:**
  - `?nojs=1` and **real JavaScript off** (`Emulation.setScriptExecutionDisabled`) give the same result: "ÅBNINGSTIDER ↓" link, no today marker, one still centred "Byman Cykler.", no pause button. `tel:`/`mailto:`/map links all work (`qa-nojs-real-375.png`).
  - A scratch build with 2 future and 1 past `specialHours` entry wrote both future dates into the no-JS notice, dropped the past one with a warning, and JS then narrowed it to 14 days.
- **Console:** no errors on load.

### 4. Layout

- **Full pages:** `qa-page-320.png`, `-375`, `-768`, `-1280`, `-1920` (1024 checked too).
  - `scrollWidth` equals the viewport width at every width.
  - No overlaps.
  - The h1 takes 3 / 2 / 1 / 2 / 1 lines at 320 / 375 / 768 / 1280 / 1920, with no orphan.
  - At 375 the buttons start at 557 px and the hours table at 795 px, exactly as the spec measured.
  - At 1280 the photo frame is 772 × 582 (the 1.5× cap) and the buttons start at 893 px (just below a 900 px screen).
  - The only wrapping issue is in the paragraph text (N2).
- **Brand grid** (scratch copy, real logos repeated; screenshots `qa-brands-{7,12,25}-{375,768,1280}.png`; 1024 and 1920 also measured):

  | Logos | 375 | 768 | 1024 | 1280 | 1920 |
  |---|---|---|---|---|---|
  | 7 | 2 col, 4 rows, tile span 1 | 4 col, 2 rows, tile span 1 | 4 col | 4 col | 4 col |
  | 12 (`--many`) | 2 col, tile = full row | 4 col, tile = full row | 4 col, 136 px cells | **6 col**, tile = full row | 6 col |
  | 25 (`--many`) | 13 rows, tile span 1 | tile span 3 | tile span 3 | tile span 5 | tile span 5 |

  - Every last row is closed, with no empty cells.
  - The tile text "…og mange flere" stays on 1 line everywhere.
  - Logo sizes match the spec table exactly. Examples: DT Swiss 146 × 24 at 375 and 148 × 24 in 6 columns (≥ 145 px ✓); MET 50 × 47 / 64 × 60 / 57 × 54; Specialized 295 × 31 at 1920 with 4 columns, as the spec notes.
  - MET reads as balanced next to the wordmarks, slightly small but clearly visible. Specialized looks lightest on phones (N12).
- **Other states:**
  - special-hours notice at 375 and 1280 ✓;
  - reduced motion (`qa-reduced-motion-1280.png`) ✓;
  - no photo + no email (scratch): name band, 2 buttons, the "E-mailen er på vej hertil…" line, no `mailto:`, no email in the JSON-LD ✓ (`qa-nophoto-noemail-375.png`).

### 5. Speed (manual; Lighthouse not available)

| File | Bytes (raw) | Notes |
|---|---|---|
| index.html | 29.0 KB | includes about 11 KB of inline SVG logos |
| tokens.css | 20.0 KB | render-blocking. Mostly comments, about 5 KB gzipped |
| styles.css | 17.2 KB | render-blocking |
| app.js | 9.5 KB | end of `<body>` |
| photo AVIF | 23.9 KB | the only photo loaded (JPEG fallback 61.2 KB) |
| logo-enve.png / logo-gripgrab.png | 14.7 / 7.0 KB | loaded as CSS masks. The fallback `<img>` (lazy, hidden) is not downloaded ✓ |
| **Total** | **119 KB raw, about 70 KB transferred with gzip** (text 25.1 KB gzipped) | 7 requests, all same-origin |

- **Photo markup:**
  - the hero `<img>` has `fetchpriority="high"`, `decoding="async"`, no lazy loading, and `width`/`height` set;
  - `sizes` = `min(100vw − 14 px, 772 px)`. Only one 514 w version exists, so every device loads the same 24 KB.
  - With the real photo (tested): 375 @2× loads 800 w, 1280 @1× loads 1600 w ✓.
- **Measured locally:** CLS 0 at 375 and 0.0005 at 1280. The LCP is the photo. FCP 136–252 ms locally (not meaningful for real networks). No web fonts, so no font swap.
- **Caching:** the local server sends no `Cache-Control`. On Vercel the defaults revalidate. The photo files are fingerprinted (N8).
- **Lighthouse estimate (mobile):**
  - **Performance 95–100.** Under 30 KB critical path, small LCP image, no third parties.
  - **Accessibility about 85–92.** The colour-contrast audit will fail because of the accepted red, and a desktop run would also flag M2.
  - **Best practices about 95.** The temporary photo's resolution warning disappears with M1.
  - **SEO about 100.** Title, description, `lang`, crawlable links, alt; no canonical until `PAGE_URL` is set.

### 6. Theme match (Press demo screenshots vs build; `qa-compare-press-1280-top.png`, `qa-compare-press-375-top.png`, `qa-compare-press-375-bottom.png`)

| Property | Press (tokens / theme-analysis) | Build (computed) | Match |
|---|---|---|---|
| Text / accent / button colour | #FF2E00 | rgb(255, 46, 0) | ✓ |
| Lines | 1 px #FFBFBF, grid = pink background + 1 px gap | 1 px rgb(255,191,191) on all 9 section bottoms; `.info` background pink, gap 1 px | ✓ |
| Body / labels | 14 px / 1.2, labels UPPERCASE, letter-spacing 0 | 14 px / 16.8 px, uppercase on the strip, eyebrow, buttons, Find vej, menu | ✓ |
| Headings | typed case, line-height 0.9, −0.025em; h1 34.17 / 66.75; standard 21.88 / 53.41; secondary 21.88 / 34.17 | h1 34.174 / 66.752; brands h2 21.88 / 53.41; info h2 21.88 / 34.17; −0.854 px at 34 px | ✓ |
| Buttons | pill 9999 px, 1 px border, 7 / 28 px padding, 33 px, " →" | identical; 33 px with a mouse, 44 px on touch (intentional) | ✓ |
| Media | 20 px corners, 7 / 14 px media padding | 20 px, frame inside 7 / 14 px | ✓ |
| Page padding | 7 / 14 px | 7 / 14 px | ✓ |
| Subheading dot | 7 px, 5.25 px gap | 7 px, 5.25 px | ✓ |
| Text link | 1 px bottom border, 3.5 px gap, " →" | same | ✓ |
| Section title row | 28 / 14 px, centred | 28 / 7–14 / 14 px, centred | ✓ |
| Footer menu pitch | about 20.5 px (demo footer ALL / POPULAR / FILTER) | 17 px with a mouse, 44 px on touch | ✗, see M2 |
| Hero | full bleed 16:9, text 104.31 px | contained 772 px, text 83.44 px (spec decision for the temporary photo) | by design |

- **What the fallback fonts can't match:**
  - **Bodoni 72** is about 11% wider than Instrument Serif, with stronger thick/thin contrast. Headings look more "fashion" and less condensed, and the wordmark and h1 take more width.
  - **Menlo** has the same width as Space Mono but looks like a coding font, without Space Mono's geometric quirks (round a, wide M).
  - On Windows (Times New Roman, 22% wider) and Android (Noto Serif), headings may take one more line.
  - All of this goes away on Shopify, where the theme loads the real fonts [unverified until the theme files arrive].

### 7. Temporary photo
See **M1**. Always "Must replace before going live".

### 8. Other checks

- **Danish proofreading.** Checked all visible text plus `alt`, `aria-label`, `title`, the meta description, `og:*` and the strings in `hours-data`.
  - Spelling and æøå are correct throughout ("åbne" plural, "Åbent nu", "E-mail", the comma after "Indtil den åbner,").
  - The tone is calm and not pushy.
  - Typography: en dash in time ranges ✓, spaced en dash in the title/description/footer ✓, the ellipsis character ✓, the middle dot as separator ✓.
  - Issues: S5 (capital L), S6 (claim wording), N4 (ellipsis spacing), N5 ("rund ramme"), N6 (repetition).
- **Meta:**
  - `<title>` is 59 characters ✓ and the description 141 ✓.
  - `og:type`, `og:locale da_DK`, `og:site_name`, `og:title`, `og:description`, `og:image` (+ width/height/alt) are present. The image is relative (S4), and there's no `og:url` until `PAGE_URL` is set.
  - `theme-color` #ffffff.
- **Privacy and security:**
  - `performance.getEntriesByType('resource')` and the CDP network log show only `localhost:3002` requests.
  - `grep` of `build/` found no API keys, tokens, analytics, pixels or `fonts.googleapis`.
  - No iframes or map embeds. Maps, Instagram and Facebook are plain links.
  - `build.mjs` removes scripts, styles and outside `href`s from SVGs, and escapes `<` in inline JSON. `app.js` writes notes with `textContent`. One issue: S3.
- **Rebuild** (scratch copy in my scratchpad; the real `data/brands.json` and `build/` were never touched):
  - `node build.mjs` → `index.html` **byte-identical**, `img/` identical, `tokens.css` = header + `design/tokens.css`.
  - Without `sips` (PATH without /usr/bin) and with cached images: identical output.
  - Without `sips` and without cached images: it falls back to the original 270 KB PNG and warns "Byg på Mac'en før udgivelse" ✓.
  - Adding a brand (one entry + one SVG + one command) gave 8 logos, a tile span of 4 and a correct `aria-label`.
  - A bad slug or missing file stops the build with "BYGGET STOPPEDE … index.html er ikke ændret" and leaves the old page intact ✓.
  - The scratch copy and its server (port 3009) were deleted and stopped afterwards.

- **JSON-LD (as built now):** parses ✓.
  - `@type` is `BikeStore`.
  - Google's required properties (`name`, `address`) are present.
  - Recommended ones present: `geo`, `openingHoursSpecification`, `telephone`, `url`.
  - `priceRange` (recommended) is missing. There's no source for it, so leave it out rather than invent it.
  - Sunday is left out, which means closed (Google's convention).
  ```json
  {
    "@context": "https://schema.org",
    "@type": "BikeStore",
    "name": "Byman Cykler",
    "legalName": "BYMAN CYKLER I/S",
    "url": "https://byman-cykler.dk",
    "image": "img/photo-c60b4a91-514.jpg",
    "telephone": "+4535425156",
    "email": "bymancykler@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Øster Farimagsgade 32",
      "postalCode": "2100",
      "addressLocality": "København Ø",
      "addressCountry": "DK"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": 55.691656, "longitude": 12.5766201 },
    "hasMap": "https://www.google.com/maps/search/?api=1&query=Byman+Cykler+%C3%98ster+Farimagsgade+32+2100+K%C3%B8benhavn+%C3%98",
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Thursday", "Friday"], "opens": "09:00", "closes": "16:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "11:00", "closes": "17:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "11:00", "closes": "14:00" }
    ],
    "sameAs": ["https://www.instagram.com/byman.cykler/", "https://www.facebook.com/byman.cykler.dk/"]
  }
  ```
  - **Special hours** (scratch build with `specialHours`): each future date is added as `{ "@type": "OpeningHoursSpecification", "validFrom": "2026-10-14", "validThrough": "2026-10-14", "opens": "00:00", "closes": "00:00" }` for a closed day, or with real `opens`/`closes` for changed hours. That matches Google's own holiday-closure example (validFrom/validThrough, 00:00–00:00, no dayOfWeek). Past dates are dropped at build time.

---

## What I tested (and what I couldn't)

- **Tools:**
  - the headless Chrome helper, with my own extended copy in the scratchpad that adds real Tab presses, real JS-off, `prefers-reduced-motion`, time-zone override, network log, console capture, the accessibility tree and platform fonts;
  - Python/PIL for crops and pixel contrast;
  - Node for parsing.
- **Widths:** 320 and 375 (mobile emulation, touch, 2×), 768 (both mouse and touch), 1024, 1280, 1920.
- **URLs:** `http://localhost:3002/build/index.html` with `?now=` and `?special=` (31 cases, including single, multiple, with-note and invalid special entries), `?nojs=1`, and real JS-off. A scratch copy on port 3009 was used for 7/12/25 brands, special hours in the data, a full-size test photo, no-`sips`, no-email/no-photo, adding a brand and the error path.
- **Screenshots saved:** `qa/screenshots/qa-*.png` (pages at 5 widths, brand grids 3 × 3, special hours, no-JS, reduced motion, focus rings, Press comparisons, no-photo/no-email).
- **Couldn't test:**
  - **Lighthouse** (not installed; estimates above);
  - a **real screen reader** (VoiceOver/NVDA; see N11);
  - **real iPhone Safari / Android / Windows** fonts and rendering (Chrome on macOS only; mobile was emulated);
  - Safari's AVIF and mask rendering (expected fine from Safari 16.4);
  - **Vercel** response headers, compression and the final public URL;
  - a slow-network flash of the status (N9);
  - the **Shopify password-page version** (no theme files; all theme-section claims stay [unverified]);
  - that the Google Maps search link lands on the exact pin (it opens Google, which wasn't browsed here because of its cookie consent).
