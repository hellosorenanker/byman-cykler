# UI spec: Layout A ("Foto først") in the Press style

Written by A7 UI designer, 2026-10-09 (Wave 3, step 1), for the builder A8.

**Read with:** `design/tokens.css` (A1's measured Press values plus my new block at the end), `design/section-map.md` (which Shopify section builds what), `design/copy-da.md` (`## Strings`), `design/wireframe.html?layout=a`.

**Visual reference:** `design/ui-tests/page.html` applies this spec to the whole page, and `design/ui-tests/grid.html` to the brand grid. Open them over http (see §11). If a test page and this document disagree, **this document wins**.

> **Theme claims are unverified.** We still don't have the Baseline theme files. Anything below about what a Shopify section can or can't do is **[unverified]** until the files arrive (re-check list: `research/theme-analysis.md` §7). The measured values in `tokens.css` come from the Press demo store.

---

## 0. In plain words (for Søren)

- The page keeps the Press look: red text on white, thin pink lines between everything, a big serif for headings, a typewriter-style font for everything else, round buttons, rounded photo corners.
- **The temporary photo is shown smaller** (at most 772 px wide on a computer) so it doesn't look blurry. When you drop in the real photo (at least 2400 px wide), the page switches to the full-width Press look by itself. No design change is needed.
- **Today's opening hours are in bold with a small dot.** At the top, a thin strip says "● ÅBENT NU · LUKKER 16.00" or "○ LUKKET · ÅBNER I MORGEN 09.00".
- **Brand logos sit in equal boxes with thin lines** (2 per row on phones, 4 on tablets and computers, 6 on wide screens once there are 12 or more logos). The last box always says "…og mange flere".
- **Three things need your decision:** (1) the red text is a bit too light for small text by accessibility rules (§10); (2) a small pause button on the moving "Byman Cykler." text (§4.6); (3) times written "09.00" in the Danish style instead of "09:00" (§6.2).

### Key decisions

| Topic | Decision | § |
|---|---|---|
| Temporary photo | **Contained**: natural shape, never more than 1.5× its file width (515 px → max 772 px), never taller than 75% of the screen, centred | 4 |
| Real photo | **Automatic rule**: file ≥ 2400 px wide **and** landscape (≥ 1.3:1) → full-bleed, 16:9 from 1024 px; otherwise contained | 4.3 |
| Photo colour | **Colour, no filter**, like the Press demo | 4.1 |
| Scrolling name | **Kept**, red, `aria-hidden`, 12 s per copy, stops and centres under reduced motion and without JS, plus a pause button | 4.6 |
| Brand grid | 2 / 4 / 4 columns (< 768 / 768–1023 / ≥ 1024); **6 from 1280 px** when there are ≥ 12 logos | 5 |
| Logo size | height = base × `scale` × 1.2 for square badges, capped at 85% / 80% of the cell width, never stretched | 5.3 |
| "…og mange flere" | **Always shown**, as the last cell, stretched over the rest of the last row | 5.4 |
| Today | **Bold (700) + 7 px dot** before the day name, plus hidden "(i dag)" | 6.3 |
| Status before JS | Neutral link "ÅBNINGSTIDER ↓" (`hours.heading`). Never "Åbent nu" without JS | 6.4 |
| Fallback fonts | `"Instrument Serif", "Bodoni 72", "Times New Roman", …` and `"Space Mono", ui-monospace, Menlo, Consolas, …`. No size changes | 2 |
| Standalone newsletter | **Left out.** The slot holds the big "Byman Cykler" wordmark instead | 1.5 |
| Contrast | Press red on white is **3.72:1**. Fails AA for text under 24 px. One-token fix ready, **needs Søren** | 10 |

---

## 1. Text and spacing

### 1.1 Page order (standalone HTML)

```html
<html lang="da" data-fonts="fallback" class="no-js">   <!-- a tiny inline script in <head> swaps no-js → js -->
<body>
  <div class="sec strip">…</div>                        <!-- A1 status strip -->
  <main>
    <section class="sec hero hero--contained|hero--full">…</section>   <!-- A2 -->
    <section class="sec intro" aria-labelledby="h1">…</section>        <!-- A3 -->
    <div class="grid ctas">…3 cells…</div>                            <!-- A4 buttons -->
    <div class="sec grid info">…3 <section> cells…</div>              <!-- A4 hours, contact, address -->
    <section aria-labelledby="maerker">title row + brand grid</section> <!-- A5 -->
    <div class="sec wordmark-row">…</div>                             <!-- A6 (standalone) -->
  </main>
  <footer>footer grid + CVR line</footer>                              <!-- A7 -->
```

Headings: exactly one `h1` (the headline, A3). `h2` for Åbningstider, Kontakt, Find os, Mærker vi forhandler. The scrolling name and the wordmark are not headings.

### 1.2 Type table

Token names are from `tokens.css`. "m" = below 1024 px, "d" = from 1024 px (the theme's `lg`). Colour tokens are explained in §10: today `--color-text-small` and `--color-text` are both `#FF2E00`.

| Element | Font | Size m / d | Weight | Line height | Letter spacing | Case | Colour |
|---|---|---|---|---|---|---|---|
| Status strip text | `--font-label` | `--font-size-base` 14 / 14 | 400 | 1.2 | `--letter-spacing-label` (0) | UPPERCASE | `--color-text-small` |
| Status dot / ring | 7 × 7 px (`--status-dot-size`), gap `--space-2xs` 5.25 px | | | | | | currentColor |
| Scrolling name "Byman Cykler." | `--font-heading` | `--hero-scroll-text-size` 34.17 / 104.31; **contained photo, d: `--hero-scroll-size-contained` 83.44** | 400 | 0.9 | −0.025em | typed | `--color-text` |
| Eyebrow "Ny webshop på vej" | `--font-label` | 14 / 14 | 400 | 1.2 | 0 | UPPERCASE, 7 px dot before | `--color-text-small` |
| Headline h1 | `--font-heading` | `--heading-feature-size` 34.17 / 66.75 | 400 | 0.9 | −0.025em | typed | `--color-text` |
| Intro (`hero.intro`) | `--font-body` | 14 / 14 | 400 | 1.2 | normal | typed | `--color-text-small` |
| Buttons | `--button-font` | `--button-font-size` 14 / 14 | 400 | 1.2 | normal | UPPERCASE, " →" from CSS | primary: `--color-button-text-primary` on `--color-button-bg-primary`; secondary: `--color-text-small`, 1px border currentColor |
| Info headings (Åbningstider, Kontakt, Find os) | `--font-heading` | `--heading-secondary-size` 21.88 / 34.17 | 400 | 0.9 | −0.025em | typed | m: `--color-text-small`, d: `--color-text` |
| Hours rows | `--font-body` | 14 | 400; **today 700** (`--today-weight`) | 1.2 | normal | Day capitalised ("Mandag"), times as typed | `--color-text-small` |
| "Åbningstider fra Google" | `--font-body` | `--font-size-sm` 11.2 | 400 | 1.2 | normal | typed | `--color-text-small` |
| Special-hours notice | `--font-body` | 14; title 14 UPPERCASE | 400 | 1.2 | normal | typed | `--color-text-small` |
| Contact rows (Telefon / E-mail) | `--font-body` | 14 | 400 | 1.2 | normal | typed; links underlined | `--color-text-small` |
| Address | `--font-body` | 14 | 400 | 1.2 | normal | typed | `--color-text-small` |
| "Find vej →" text link | `--font-label` | 14 | 400 | 1.2 | normal | UPPERCASE, 1px bottom border, 3.5 px gap, " →" | `--color-text-small` |
| Brand heading "Mærker vi forhandler" | `--font-heading` | `--heading-standard-size` 21.88 / 53.41 | 400 | 0.9 | −0.025em | typed | m: `--color-text-small`, d: `--color-text` |
| Brand intro | `--font-body` | 14 | 400 | 1.2 | normal | typed | `--color-text-small` |
| Logo cells | logos, see §5.3 | base 28 / 36 px high (32 for the "many" grid) | | | | | `--color-text` |
| "…og mange flere" tile | `--font-heading` | `--brand-more-size` 21.88 / 34.17 | 400 | 0.9 | −0.025em | typed, centred, `text-wrap: balance` | m: `--color-text-small`, d: `--color-text` |
| Newsletter (Shopify only, drawn by `main-password`) | heading `--font-heading`; text, field and button `--font-body` | heading `--heading-standard-size` 21.88 / 53.41; rest 14 | 400 | 0.9 / 1.2 | −0.025em / normal | heading typed; button UPPERCASE " →" | theme |
| Wordmark "Byman Cykler" (standalone A6) | `--font-heading` | `calc(100cqi / var(--wordmark-divisor))`, about 62 px at 375 and 216 px at 1280 | 400 | 0.9 | −0.025em | typed, centred | `--color-text` |
| Footer text and links | `--font-body` | 14 | 400 | 1.2 | normal | text typed; phone/email typed + underlined; Instagram/Facebook UPPERCASE, no underline (Press footer menu style) | `--color-text-small` |
| CVR line "BYMAN CYKLER I/S · CVR 14579656" | `--font-body` | 11.2 | 400 | 1.2 | normal | as in the data | `--color-text-small` |

Other text rules:
- `body`: `font-size: var(--font-size-base)` with the theme's `html { font-size: 87.5% }`, so 1rem = 14 px.
- Inline links (phone, email): `text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em`.
- `h1` and the tile get `text-wrap: balance` (harmless where unsupported).
- Times are shown as **"09.00–16.00"**: period, en dash (U+2013), no spaces (§6.2).

### 1.3 Spacing inside and between the parts

Sections never have margins between them. **The 1px pink bottom line of each section is the separator** (§3). Page padding is `--page-padding`: 7 px on mobile, 14 px from 1024 px.

| Part | Inside, mobile | Inside, from 1024 px | Between items inside |
|---|---|---|---|
| A1 status strip | `0 var(--page-padding)`, height 44 px on touch screens, 32 px (`--announcement-height`) with a mouse | same | dot → text `--space-2xs` 5.25 px |
| A2 hero | `var(--media-padding)` 7 px around the frame | 14 px | scrolling name sits `--hero-scroll-bottom` (17.5 / 24.5 px) above the frame bottom |
| A3 intro | `var(--space-md) var(--page-padding)` = 28 / 7 | 28 / 14 | eyebrow → h1 `--subheading-margin-bottom` 7 px; h1 → intro `--space-sm` 14 px. h1 max width `--text-width-feature` (100% / 75%). Intro max width 75ch (m) and `min(50%, 75ch)` (d) |
| A4 button row | each cell `var(--space-xs) var(--page-padding)` = 7 / 7 | 14 / 14 | 1 column below 768 px, 3 columns (2 without email) from 768 px |
| A4 info cells | `var(--space-md) var(--page-padding)` = 28 / 7 | 28 / 14 | h2 → content 14 px; table → source line 7 px; notice → table 14 px; address → "Find vej" 7 px. 1 column below 768; 2 columns at 768–1023 (hours on the left over two rows, Kontakt and Find os stacked on the right); 3 columns from 1024 |
| A5 brand title row | `var(--section-header-padding-top) var(--page-padding) var(--section-header-padding-bottom)` = 28 / 7 / 14 | 28 / 14 / 14 | h2 → intro 14 px |
| A5 brand grid | cell padding `--brand-cell-pad` 7 px | 14 px | 1 px gaps (§5) |
| A6 wordmark (standalone) | `var(--space-sm) var(--page-padding)`, plus 0.2em under the text for the "y" descenders | same | |
| A6 `main-password` (Shopify) | theme | theme | |
| A7 footer cells | `var(--space-sm) var(--page-padding) var(--space-md)` = 14 / 7 / 28 | 14 / 14 / 28 | 1 column below 768, 2 from 768, 4 from 1024 |
| CVR line | `var(--space-sm) var(--page-padding)` | same | last element: no bottom line |

Measured on `ui-tests/page.html` at 375 × 812 with the fallback fonts: the button row starts at 557 px and the hours table at 795 px (A6 predicted about 550 / 780).

### 1.4 The Byman name and the future logo file

- **Now:** the name is text. It appears as the scrolling name on the photo (decorative) and as the big wordmark row (A6) at the bottom, like the giant "Honestly Good Coffee." at the foot of the Press demo.
- **Later, one setting:** `site.logo` in the build config (empty now). When it holds a path (SVG preferred), the A6 row shows the file instead of the text. Inline SVG with `fill="currentColor"`, centred, `max-width: 100%; max-height: 40vh; height: auto`. The scrolling name on the photo stays text. Check the size by eye when the file arrives.
- **Shopify:** the logo goes into `main-password`'s own logo setting (image, width 20–450 px [from documentation]). Until a file exists, the section shows its heading or the shop name [unverified].

### 1.5 Newsletter slot on the standalone page: left out

**Decision: no newsletter and no replacement line.** The A6 slot shows only the wordmark. Reasons:
1. There is no mail service behind the standalone page, so a form would be a promise we can't keep. `newsletter.heading` ("Få besked, når webshoppen åbner") would also be untrue there.
2. Phone is in the buttons, the contact table and the footer, and Instagram/Facebook are in the footer. A pointer line would only repeat them.
3. A replacement line would need a new string that isn't in `copy-da.md`.
4. No personal data is collected, so there is nothing to consent to.

The Shopify page keeps the theme's newsletter in `main-password` (section-map A6).

---

## 2. Fonts for the standalone page

### 2.1 The rule

- **Shopify password page:** the theme's real fonts (Instrument Serif, Space Mono) through the theme. Don't set `data-fonts` there.
- **Standalone page:** `<html data-fonts="fallback">`. The rule at the end of `tokens.css` then points `--font-heading` and `--font-body` to the fallback tokens, and everything else follows (`--font-label` and `--button-font` refer to `--font-body`). **No font files are downloaded** (Gate 1).

### 2.2 The stacks (new tokens)

```css
--font-heading-fallback: "Instrument Serif", "Bodoni 72", "Times New Roman", Times, "Liberation Serif", Tinos, serif;
--font-body-fallback: "Space Mono", ui-monospace, Menlo, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace;
```

| Platform | Heading font that shows | Body font that shows |
|---|---|---|
| macOS / iOS | Bodoni 72 | Safari: SF Mono (`ui-monospace`). Chrome/Firefox: Menlo (Chrome ignores `ui-monospace`, measured) |
| Windows | Times New Roman | Consolas |
| Android | Noto Serif (generic `serif`) | Droid Sans Mono / Noto Sans Mono (generic) |
| Linux / ChromeOS | Liberation Serif / Tinos (same widths as Times New Roman) | Liberation Mono / DejaVu Sans Mono |

### 2.3 What I measured (headless Chrome, this Mac)

Reference: the Press demo's Feature text (Instrument Serif, 53.41 px) measured from `qa/screenshots/press-demo-1280.png`, compared with the same four lines drawn in each local font (`ui-tests/fonts.html`).

| Font | Width vs Instrument Serif | Note |
|---|---|---|
| Bodoni 72 | **1.11×** | Narrowest available. High contrast like Instrument Serif. **Chosen first** |
| Baskerville / Big Caslon | 1.21× | |
| Times New Roman | **1.22×** | Available almost everywhere. Chosen second |
| Georgia, Charter, PT Serif, Palatino, Iowan | 1.33–1.35× | Too wide |
| Menlo vs Space Mono | 0.98× | Practically the same width (Space Mono = 0.612em per character) |

Instrument Serif is also **taller**: cap height 0.71em and x-height about 0.55em, against Times New Roman's 0.66 / 0.45. Shrinking the fallback with `size-adjust` to match the width would make it look much smaller, so **no size adjustment is used**.

**Line breaks checked:** the h1 "Butik og værksted er åbne. Webshoppen er på vej." breaks into exactly 2 lines at 375 px in both Bodoni 72 (319 px for the first half) and Times New Roman (345 px). At 320 px it takes 3 balanced lines, which is fine. On desktop it takes 2 lines inside 75% width. **No token sizes change.**

---

## 3. Lines and dividers

All lines are **1 px solid**. Structure lines are **pink `--color-line` #FFBFBF**. Lines that belong to a control are **currentColor (red)**.

| Line | How it's made | Where |
|---|---|---|
| **Section bottom line** | `border-bottom: var(--border-width) solid var(--color-line)` on every section | Strip, hero, intro, button row, info row, brand title row, brand grid, wordmark row, footer grid. The sections stack like table rows, with no margins |
| **Grid look** | The container gets `background: var(--color-line); gap: var(--grid-gap)` (1 px), and every cell `background: var(--color-bg)`. The 1 px gaps show the pink as lines | Button row, info row, brand grid, footer grid. No outer left or right edge line: cells run to the window edges, as in Press |
| **Table rows** | `border-top` pink on every row and `border-bottom` on the last row. No vertical lines | Hours table, Kontakt table, the table inside the special-hours notice (no bottom line there: the box closes it) |
| **Control lines (red)** | currentColor | Button borders, "Find vej →" underline, inline link underlines, the special-hours box, the closed-status ring, the pause button circle, the newsletter field's bottom line (Shopify) |

**Lines are not used:**
- around the photo (it has 20 px corners and no border);
- around the page or above the first section (the strip starts at the window edge);
- inside text blocks (nothing between eyebrow, h1 and intro);
- under the CVR line, the last element;
- around single logos, apart from the grid gaps;
- as red structural lines (red lines only mark controls).
- The 2 px "double" line (`--border-width-double`) is not used. Press doesn't show it on the demo pages.

---

## 4. Photo

### 4.1 Shape, focal point, colour

- **Colour, no filter.** The Press demo uses natural colour photos, some dark and moody, with no duotone or greyscale. The facade is charcoal and white, close to neutral, so it sits calmly next to the red. A greyscale filter would be an effect the Shopify section can't apply without custom code, and the two versions would then differ. (The wireframe's greyscale was only a stand-in.)
- **Focal point:** the BYMAN sign and the entrance door. Crops use `object-position: var(--photo-focus)` (default `50% 50%`). The build setting `photoFocus` can override it, for example `"50% 35%"` if the real photo has the sign near the top.
- **Corners and placement:** `--radius-media` 20 px. The frame sits inside the section's `--media-padding` (7 / 14 px). While loading, the frame shows `--color-media-placeholder` (a 5% red tint).

### 4.2 The two treatments

| | **Contained** (temporary photo, and any photo under the threshold) | **Full-bleed** (the real photo) |
|---|---|---|
| Width | `min(100%, var(--photo-cap), calc(var(--photo-contained-max-h) * var(--photo-ratio)))`, centred | 100% of the section (window width − 2 × media padding) |
| `--photo-cap` | `floor(file width × 1.5)` px. Temporary photo: 515 × 1.5 = **772 px** | — |
| Shape | the file's natural shape (`--photo-ratio`, temporary: 515 / 388), **never cropped** | mobile: natural, but cropped to 3:2 if the photo is wider than 3:2 (`--photo-ratio-mobile`). From 1024 px: `--hero-aspect` **16:9**, `object-fit: cover` at `--photo-focus` |
| Max height | `--photo-contained-max-h` 75vh | none (16:9, like Press) |
| Scrolling name size, desktop | 83.44 px (`--hero-scroll-size-contained`), so it keeps Press's proportion of about 14% of the frame height | 104.31 px (`--hero-scroll-text-size`) |
| Sides | white. The section line and padding stay | — |

Measured on `ui-tests/page.html`:
- 1280 × 900: frame 772 × 582 (1.5×). The headline starts inside the first screen, which full-bleed doesn't manage.
- 1024 × 768: 765 × 576. The 75vh limit applies.
- 768: 754 px wide (1.46×).
- 375: 361 × 272.
- Full-bleed simulated with the temporary photo at 1280 (`?photo=full`) is visibly soft (2.4×). That confirms the rule.

### 4.3 The automatic rule (build script)

The build reads the photo file's pixel size and picks the treatment. Swapping the photo is then: replace one file, rebuild. No design change.

```
w, h = pixel width and height of the photo file
if w >= 2400 and w / h >= 1.3:   mode = "full"        # 1.3 lets a 4:3 phone photo (4032 × 3024) through
else:                            mode = "contained"
photoCap         = floor(w * 1.5)                      # only used when contained
photoRatio       = "w / h"
photoRatioMobile = (w / h > 1.5) ? "3 / 2" : "w / h"   # only used when full
```

- The build writes the class (`hero--full` or `hero--contained`) and the three custom properties into the section's `style` attribute, for example `style="--photo-ratio: 515 / 388; --photo-cap: 772px"`.
- **Read the size in plain Node:** PNG bytes 16–23, or the JPEG SOF marker, about 30 lines. `sips -g pixelWidth -g pixelHeight` works on the Mac, but Vercel builds on Linux, where `sips` doesn't exist.
- Also print the chosen mode in the build log, for example `photo: 515×388 → contained (cap 772px)`.
- **Real photo for Søren:** landscape, daylight, at least 2400 px wide, ideally **3600 × 2025 (16:9)**. Keep the sign and the door in the middle third, so the 3:2 mobile crop and the 16:9 desktop crop both keep them.

### 4.4 `srcset` and `sizes`

**Widths to generate:** from `[800, 1200, 1600, 2400, 3200]`, keep only those **≤ the file width**. Add the file width itself if it's under 3200 and not already in the list. **Never make a version larger than the file.**

| File | Widths generated |
|---|---|
| Temporary 515 × 388 | **515** only |
| 2000 wide | 800, 1200, 1600, 2000 |
| 3600 × 2025 | 800, 1200, 1600, 2400, 3200 |

**Formats:** `<picture>` with an AVIF `<source>` and a JPEG `<img>`.
- On this Mac, `sips` can write AVIF and JPEG, but **not WebP** (checked with `sips --formats`).
- Make the versions on the Mac and commit them. Nothing gets installed.
- The temporary PNG (276 KB) should also become a JPEG at quality about 82.

**`<img>` attributes:**
- `width` and `height` = the file's pixel size;
- `alt` = `photo.alt`;
- `fetchpriority="high"`, `decoding="async"`, and **no** `loading="lazy"`.

**`sizes`:**
- full: `(min-width: 1024px) calc(100vw - 28px), calc(100vw - 14px)`
- contained: `(min-width: 1024px) min(calc(100vw - 28px), {cap}px), min(calc(100vw - 14px), {cap}px)`

### 4.5 Scrolling name over the photo (Press "Image with scrolling text")

**Kept**, also over the contained photo: checked at 1280, 768 and 375, and it reads well (see `ui-tests/page.html`).
- **Text:** "Byman Cykler." with a gap of 0.3em after each copy. 12 copies in one track, as two identical halves of 6.
- **Look:** `--color-text` red straight on the photo, no shadow (as in Press). Font and size per §1.2.
- **Position:** `position: absolute; left: 0; right: 0; bottom: var(--hero-scroll-bottom)`, clipped by the frame's rounded corners (`overflow: hidden` on the frame).
- **Motion:** moves left. `@keyframes { to { transform: translateX(-50%) } }`, `linear infinite`. Duration = `--hero-scroll-unit` (12 s) × 6 = **72 s**, so one copy passes in 12 s (the demo's `--base-scrolling-items-speed`). Measured speed: about 38 px/s at desktop (contained), about 15 px/s on mobile.
  - 6 copies always cover the frame: the shortest track is 6 × 183 px at 375; at 2560 px it is 6 × 560 px against a 2532 px frame.
- **The animation runs only** when `html.js` is set **and** `prefers-reduced-motion: no-preference` matches.
- **Otherwise** (no JS, or reduced motion): one copy, centred, not moving. That is what Press does under reduced motion.
- **Pauses on hover**, on devices that can hover (Press does this too).
- **`aria-hidden="true"`** on the whole scroll layer. The real `h1` is in A3. The photo's `alt` describes the photo.

### 4.6 Pause button (WCAG 2.2.2, needs OK)

- **Why:** WCAG 2.2.2 (level A) says moving content that runs for more than 5 seconds next to other content needs a way to pause it. Hover alone doesn't help keyboard or touch users. Press seems to offer only hover [unverified].
- **What:** a `<button type="button" aria-pressed="false" aria-label="{hero.scroll.pause}">`, top-left of the frame. Its 44 × 44 px tap box sits `calc(var(--media-content-padding) - 5.5px)` from the edges. The visible part is a **33 px circle** (`--button-height`): white fill, 1px red border, and a red pause icon (two 3 px bars, 12 px tall) that turns into a play triangle when pressed.
- **Top-left** keeps it off the scrolling text and off the BYMAN sign in the temporary photo.
- **When it shows:** only when the text moves (with `.js`, without reduced motion). Clicking it toggles `aria-pressed` and the class `is-paused` on the hero (`animation-play-state: paused`).
- **New string needed** (A5): `hero.scroll.pause = Sæt rulleteksten på pause` (proposal). It is used as the `aria-label`, with `aria-pressed` giving the state.
- **Shopify:** the theme section draws its own scrolling text, so this button only exists on the standalone page. That is a known limitation [unverified].

### 4.7 No photo

If no photo file is configured, the hero section is left out. In its place comes a **static name band**:
- "Byman Cykler.", centred, `--hero-scroll-text-size`, `--color-text`;
- padding `--space-sm` `--page-padding`, 1px pink bottom line, `aria-hidden`;
- no motion, so no pause button is needed.

There is never a grey box. The build log warns.

---

## 5. Brand grid

### 5.1 Columns and cells

| Window | Columns | Cell height | Cell padding | Base logo height | Width cap |
|---|---|---|---|---|---|
| < 768 px | 2 | 104 px | 7 px | 28 px | 85% |
| 768–1023 px | 4 | 120 px | 7 px | 28 px | 85% |
| ≥ 1024 px, up to 11 logos | 4 | 160 px | 14 px | 36 px | 80% |
| ≥ 1024 px, 12+ logos (`brand-grid--many`) | 4 | 136 px | 14 px | 32 px | 80% |
| ≥ 1280 px, 12+ logos | **6** | 136 px | 14 px | 32 px | 80% |

- **Breakpoints:** 768 (`md`) and 1024 (`lg`) are the theme's. **1280 is Tailwind's default `xl`.** Baseline's CSS uses Tailwind-style classes (`lg:aspect-[16/9]`, `motion-reduce:`), so it probably has `xl` too [unverified].
- **Why 1280 and not 1024 for 6 columns:** at 1024, 6 columns make cells 170 px wide. DT Swiss then shrinks to 113 px, below its official minimum of 145 × 23 px. From 1280 it is 148 px.
- **The build sets the class `brand-grid--many`** when the list has 12 or more logos. This needs no `:has()`.

Markup: `<ul class="grid brand-grid">` with one `<li class="cell brand">` per logo and the tile last. Logos are **not links** (section-map §6.4.7).

### 5.2 CSS (as in the test pages)

```css
.brand-grid { display: grid; gap: var(--grid-gap); background: var(--color-line);
  grid-template-columns: repeat(var(--brand-cols), minmax(0, 1fr)); list-style: none; padding: 0; margin: 0; }
.brand { background: var(--color-bg); height: var(--brand-cell-h); padding: var(--brand-cell-pad);
  display: flex; align-items: center; justify-content: center; min-width: 0; }
.logo { --h: calc(var(--brand-logo-h) * var(--scale, 1) * var(--badge, 1));
  flex: none; width: min(calc(var(--h) * var(--ratio)), var(--brand-logo-max-w)); height: auto;
  aspect-ratio: var(--ratio); color: var(--color-text); }
.logo--badge { --badge: var(--brand-badge-factor); }
@media (min-width: 1024px) { .brand-grid--many { --brand-cell-h: var(--brand-cell-h-many); --brand-logo-h: var(--brand-logo-h-many); } }
@media (min-width: 1280px) { .brand-grid--many { --brand-cols: var(--brand-cols-many); } }
```

### 5.3 Logo sizing

- **Height = base × `scale` (from `brands.json`) × badge factor.** The width follows the logo's own shape.
- **If that width is more than the cap**, the whole logo shrinks proportionally (`width: min(…)` together with `aspect-ratio`). Logos are **never stretched**.
- The build writes per logo:
  - `--scale` = `brands.json` scale;
  - `--ratio` = the SVG viewBox width/height, or the PNG pixel width/height;
  - the class `logo--badge` when `--ratio` < 1.6.
- **Square badges:** MET (283.69 × 266.28) is a solid block with the letters cut out, so it carries a lot more ink than an outlined wordmark of the same size.
  - I compared badge factors 1.0, 1.2 and 1.4 at 1280: 1.0 looks small, 1.4 heavier than SILCA next to it, and **1.2 balances**.
  - So MET is 36 × 1.4 × 1.2 ≈ 60 px tall on desktop (64 × 60) and 50 × 47 on mobile, centred with air around it. **Don't change `brands.json`**: the factor is a token.
- **Logo sizes rendered** (W × H px):

  | Logo | 375 (2 cols) | 768 (4 cols) | 1280 (4 cols) | 1280, 12+ (6 cols) |
  |---|---|---|---|---|
  | ENVE | 122 × 34 | 122 × 34 | 157 × 43 | 139 × 38 |
  | Specialized | 147 × 15 | 151 × 16 | 233 × 24 | 148 × 15 |
  | Silca | 147 × 29 | 147 × 29 | 189 × 38 | 148 × 30 |
  | MET | 50 × 47 | 50 × 47 | 64 × 60 | 57 × 54 |
  | Polymer | 147 × 31 | 151 × 32 | 222 × 47 | 148 × 31 |
  | GripGrab | 125 × 28 | 125 × 28 | 161 × 36 | 143 × 32 |
  | DT Swiss | 146 × 24 | 146 × 24 | 188 × 31 | 148 × 24 |

- **DT Swiss:** its official minimum (145 × 23 px digital) is met at every breakpoint.
- **DT Swiss clear space** (the logo's own height on all sides) is met on desktop. It is about 2 px short sideways on phones and tablets (20–22 px instead of 24).
- **DT Swiss colour:** its guidelines allow only black, white or grey. **The red logos are a known deviation that Søren accepted at Gate 2.** Don't change it.
- **ENVE** (`enve.png`) still has about 10% transparent margin; its `scale` 1.2 makes up for it. **GripGrab** (`gripgrab-original.png`) is cropped tight.

### 5.4 Last row and the "…og mange flere" tile

- **Always shown**, always last. The list will never cover everything the shop sells, and the workshop services all brands. The tile also closes the last row, so there are never empty cells.
- **It stretches over whatever is left of its row.** With N logos and C columns: `span = C − (N mod C)` (N mod C = 0 gives a full row). The build writes `style="--span-2:…; --span-4:…; --span-6:…"`. CSS: `grid-column: span var(--span-2)`, from 768 px `span var(--span-4)`, and in the 6-column grid `span var(--span-6)`.
  - In Liquid: `{{ section.blocks.size | modulo: 4 }}`.
  - A CSS-only alternative is the wireframe's `nth-child` rules.
- **Results:**

  | Logos | 2 columns | 4 columns | 6 columns |
  |---|---|---|---|
  | 7 | the tile is the 8th cell, span 1 | span 1 (2 full rows) | span 5 |
  | 12 | full row | full row | full row |
  | 25 | span 1 | span 3 | span 5 |

- Text: `brands.more`, heading font, centred, may wrap to 2 lines (`text-wrap: balance`). Never an image of the words.

### 5.5 PNG logos (ENVE, GripGrab): CSS mask

```html
<span class="logo logo--png" role="img" aria-label="ENVE"
      style="--scale:1.2; --ratio:3.6317; -webkit-mask-image:url(assets/logos/enve.png); mask-image:url(assets/logos/enve.png)">
  <img src="assets/logos/enve.png" alt="">
</span>
```
```css
.logo--png { background-color: currentColor; -webkit-mask-size: contain; mask-size: contain;
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; }
.logo--png img { display: none; }
@supports not ((-webkit-mask-image: none) or (mask-image: none)) {
  .logo--png { background: none; }
  .logo--png img { display: block; width: 100%; height: 100%; object-fit: contain; filter: brightness(0); }
}
```
- **Write the `mask-image` URL straight into the `style` attribute,** not through a custom property. A relative `url()` inside a custom property can resolve against the stylesheet's folder instead of the page's.
- **Fallback** (browsers without masks): the official PNG shown black through `filter: brightness(0)`. Black single-colour is allowed by the logo rule. Tested with `grid.html?nomask=1`: ENVE and GripGrab show black, the rest red.
- **SVG logos are inlined** (with `fill="currentColor"`), with `role="img"` and the brand name as the label (`<title>` or `aria-label`), and `focusable="false"`.
- **Masks fail on `file://`.** Always test over http.

### 5.6 What I tested

`ui-tests/grid.html?n=7|12|25`, real logos repeated in `brands.json` order, at **375, 768, 1024, 1280 and 1920**. Screenshots are in the scratchpad (`a7/grid/`).
- All three counts close the last row.
- 6 columns appear from 1280 only.
- MET balances at factor 1.2.
- **At 1920 with 4 columns, Specialized hits its full height (295 × 31) and becomes the biggest logo.** That's acceptable, since it's the main brand.
- At 25 logos on a phone the grid is 13 rows (about 1360 px). It sits low on the page, so this is accepted.

---

## 6. Opening hours

### 6.1 Markup

```html
<section class="cell cell--hours" aria-labelledby="aabningstider">
  <h2 id="aabningstider">Åbningstider</h2>
  <div class="notice" id="notice" role="note" hidden></div>
  <table class="table hours" id="hours" aria-labelledby="aabningstider">
    <tbody>
      <tr data-day="1" data-open="09:00" data-close="16:00"><th scope="row">Mandag</th><td><time>09.00</time>–<time>16.00</time></td></tr>
      …
      <tr data-day="0" data-closed><th scope="row">Søndag</th><td>Lukket</td></tr>
    </tbody>
  </table>
  <p class="small hours-source">Åbningstider fra Google</p>
</section>
```

- A real `<table>`. Each row has a row header (`th scope="row"`) for the day and a cell for the time. There is no `thead`, since "Dag / Tid" column headers would add nothing.
- Rows run Monday to Sunday. The build writes them from `business.json` `openingHours`.
- `data-day` follows JavaScript's `getDay()`: 0 = Sunday … 6 = Saturday. `data-open` and `data-close` keep the data format "HH:MM". **The table is the only place the weekly hours are written.** The status script reads them from it (the same as on Shopify, section-map §6.1).
- Day names: `day.*` with the first letter capitalised for the table ("Mandag"). In running text they stay lower case ("åbner mandag").
- The times column is right-aligned, `white-space: nowrap`, and has 14 px left padding.

### 6.2 Time format

**"09.00–16.00"**: a period (Danish standard, and what Google Maps shows in Danish), an en dash, no spaces. The same in the status strip: "LUKKER 16.00". The data keeps "09:00". This needs a light OK from Søren (section-map question 9).

### 6.3 Today's row

- **Bold** (`--today-weight` 700) on both cells, plus a **7 px filled dot** before the day name, with 5.25 px gap.
- The dot is the Press subheading/variant dot. It is not colour-only, because bold and the dot both change the shape.
- **An inverted row (white on red) was rejected:** white on red is only 3.72:1 at 14 px (§10).
- **Screen readers:** a visually hidden " (i dag)" is appended to the day name. **New string needed (A5):** `hours.today = i dag`. Until it exists, use `aria-current="date"` on the row instead.
- **On a special date**, today's row shows **today's real hours** (the special ones, or "Lukket"). The notice above explains why.
- **Without JS:** no highlight. The build can't know which day the visitor opens the page.

### 6.4 Status strip (A1)

- **HTML from the build** (no-JS state, and the state for the split second before the script runs): `<a class="status label" id="status" href="#aabningstider">Åbningstider</a>`. The text is `hours.heading` with " ↓" added by CSS. It is centred, has no dot, and is a working link to the table. **It never says "Åbent nu" without JS.**
- **With JS** (inline at the end of `<body>`, so it runs before first paint in practice), the text and `data-state` are replaced:

| Situation (Copenhagen time) | String | `data-state` → dot |
|---|---|---|
| open ≤ now < close | `hours.status.open` "Åbent nu · lukker {close}" | `open` → filled dot |
| today has hours, now < open | `hours.status.opensLater` "Lukket · åbner i dag {open}" | `closed` → 1px ring |
| next opening is tomorrow | `hours.status.opensTomorrow` "Lukket · åbner i morgen {open}" | `closed` |
| next opening is 2–6 days ahead | `hours.status.opensOn`, {day} = weekday ("åbner mandag 09.00") | `closed` |
| next opening is 7–14 days ahead | `hours.status.opensOn`, {day} = "mandag 5. januar" | `closed` |
| nothing open within 14 days | `hours.status.closedToday` "Lukket i dag" | `closed` |

Status rules:
- **"Now"** is read with `Intl.DateTimeFormat(…, { timeZone: 'Europe/Copenhagen', hourCycle: 'h23' })`, so a visitor whose phone is set to another time zone still sees Copenhagen's status.
- **Date arithmetic** is done in UTC (noon), which avoids daylight-saving surprises.
- **Special hours override the weekly hours** for their date, both for today and for finding the next opening.
- **The status refreshes** every 60 s and on `visibilitychange`.
- **If `Intl` is missing**, the neutral link stays.
- **Strip look:** the dot is the 7 px filled circle when open and a 1px ring in currentColor when closed (the Press variant-picker dots ● / ○). Text is UPPERCASE through CSS. A long text wraps centred on 2 lines.
- **Strip height:** 44 px on touch screens, 32 px with a mouse (`pointer: fine`). The whole text is the link.

Reference implementation: the "Page script" in `ui-tests/page.html` (`bymanHours`).

### 6.5 Special-hours notice

- **Data:** `business.json` `specialHours` (empty today). Expected entries: `{ "date": "YYYY-MM-DD", "open": "HH:MM", "close": "HH:MM", "closed": false, "note": "…" }`. `note` is optional free Danish text from Søren. **This schema is a proposal**, to be confirmed by A8/A2. The build writes the list into `<script type="application/json" id="special-hours">`.
- **When it shows:** for every entry where today ≤ date ≤ today + 14 days, from 14 days before until the end of that day.
- **Where:** in the hours cell, between the "Åbningstider" heading and the table, so it is read before the regular week.
- **Look:** a box with a 1px currentColor border, square corners, `--notice-padding` 7 px, 14 px below it, 14 px text.
  - **One entry:** one sentence, `hours.notice.special` "Bemærk: ændrede åbningstider {date}: {hours}". {date} = "onsdag 24. december" and {hours} = "10.00–13.00" or `hours.closed`. A `note` follows after a space.
  - **Two or more:** repeating "Bemærk: ændrede åbningstider" on every line was tested and reads badly. Instead the box shows a title in label style, `hours.special.heading` "SÆRLIGE ÅBNINGSTIDER", 7 px above a small table (date | hours, pink row lines, no last line). A `note` gets its own full-width row under its date, without a top line.
- **`role="note"`.** Nothing is truncated. The box grows.
- **Without JS:** the build writes every entry with date ≥ build date, visible. Showing it early is better than hiding it.

---

## 7. Special situations

| Situation | What the page does |
|---|---|
| **No photo** | No hero section. A static name band takes its place (§4.7). Nothing else moves. No grey box, a warning in the build log |
| **No email** | The "Skriv til os" button is left out. The button row becomes 2 columns from 768 px (`--cta-count: 2`). The E-mail row in Kontakt becomes `contact.email.missing` as a paragraph under the phone row. The footer and JSON-LD leave the email out. Tested with `?email=0` |
| **JavaScript off** | The strip shows the "ÅBNINGSTIDER ↓" link. No today highlight. The notice shows every upcoming entry. The scrolling name stands still, centred, with no pause button. Everything else works: `tel:`, `mailto:`, map link, table. Tested with `?nojs=1` |
| **25 brands** | The many-grid (§5.1): 2 / 4 columns, 4 columns at 136 px from 1024, 6 columns from 1280. The tile spans 1 / 3 / 3 / 5 cells. About 1360 / 850 / 960 / 690 px tall |
| **Long special-hours note** | The box grows and wraps (tested with 4 dates and a 2-line note at 375 and 1280). On desktop the hours cell gets taller, and the Kontakt and Find os cells stretch with it (grid rows), so the lines stay unbroken |
| **Long status text** | Wraps to 2 centred lines. The strip grows |
| **320 px screens** | The h1 takes 3 lines. Brand cells are 152 px, so DT Swiss drops to about 124 px (below its 145 px minimum). Accepted for this rare width |
| **Very wide screens (1920+)** | The contained photo stays at its cap. A full photo is 16:9 of the width (as in Press). Intro text stops at 75ch |
| **Other fallback fonts** (Windows, Android) | Times New Roman is 22% wider than Instrument Serif, and Noto Serif wider still. Headings may take one more line. The wordmark (sized for Times New Roman) wraps to two lines on Android if needed |

---

## 8. Interaction states

### 8.1 Hover

- **Buttons and links don't change colour on hover, as in Press.** The theme's hover colour is the accent, which in Press is the same #FF2E00. A1 confirmed this with a real mouse-over. Keeping it means the standalone page and the Shopify page behave the same.
- There are no transitions (Press uses `transition: all 0s`). The cursor is the normal pointer on links and the pause button.
- The scrolling name pauses on hover (Press).
- There is no image zoom, since the photo isn't a link. Logos aren't links either.

### 8.2 Focus (WCAG 2.2 AA)

```css
:focus-visible { outline: var(--focus-ring-width) solid var(--focus-ring-color); outline-offset: var(--focus-ring-offset); }
.status:focus-visible { outline-offset: calc(var(--focus-ring-width) * -1); }  /* the strip touches the window top */
```
- **The ring:** a 2 px red ring, 3 px away from the element (3 + 2 = 5 px, the theme's `--focus-outline-width`). It follows the round button shape.
- **Contrast:** red against white is 3.72:1, which meets the 3:1 needed for non-text (1.4.11). Against the red filled button, the 3 px white gap keeps it readable.
- **Never obscured** (2.4.11): nothing is sticky or fixed.
- **Room for the ring:** the ring never gets clipped. Button cells have at least 7 px padding, and the pause button sits 12 px inside the photo frame. The strip link uses an inset ring (−2 px), because an outside ring was cut off by the window top in testing.
- **Don't remove outlines.** Mouse clicks show no ring (`:focus-visible`).
- **Tab order** = page order: strip link → pause button → buttons → phone → email → Find vej → footer links.
- Checked with `page.html?focus=1` at 375 and 1280 (headless Chrome can't press Tab, so the switch draws all the rings at once).

### 8.3 Tap targets (44 px)

| Element | How it reaches 44 px |
|---|---|
| Status strip link | `min-height: var(--tap-target)` on touch screens (32 px with `pointer: fine`) |
| 3 buttons | `min-height: 44px` everywhere, except `(min-width: 1024px) and (pointer: fine)`, which uses the Press 33 px |
| Pause button | a 44 px button with a 33 px drawn circle |
| Phone and email in Kontakt | on `pointer: coarse`, row padding `calc((44px − 1.2em) / 2)`, so each row is 44 px |
| "Find vej →" | an invisible 44 px layer (`.hit::before`, `top/bottom: calc((100% − 44px) / 2)`). Nothing moves, and there's nothing next to it that it could cover |
| Footer links | each link `inline-flex; min-height: 44px` on touch screens, so stacked links never overlap. (An invisible layer would cover the neighbouring link, which was tested and rejected) |
| Logos | not interactive |

### 8.4 Reduced motion (`prefers-reduced-motion: reduce`)

- The scrolling name stands still: one copy, centred.
- The pause button is hidden.
- No smooth scrolling for the strip link (`scroll-behavior: smooth` only under `no-preference`).
- Nothing else on the page moves.
- Tested with `page.html?reduce=1`.

---

## 9. Mapping to the Shopify password page

Section numbers A1–A7 are from `section-map.md` §3. **"Theme"** means the section draws it by itself [unverified until the theme files arrive]. **"Liquid"** means our Custom liquid code must reproduce it from this spec. **"CSS"** means a few lines in the section's own "Custom CSS" field. Shopify offers that field for Online Store 2.0 themes [from Shopify documentation; unverified for Baseline].

| Element | Shopify | Notes |
|---|---|---|
| Fonts, colours, base size | Theme | Theme settings. Don't load the fallback stacks |
| A1 status strip: text, dot or ring, strings, link, script, 44 px | **Liquid ①** | Everything in §6.4. Reads the hours from the table in ② |
| A2 photo, 20 px corners, padding | Theme (Image with scrolling text) | |
| A2 contained treatment for the temporary photo | **Not in the theme.** Options: accept a soft full-width photo until the real one arrives (Gate 2 accepted this), or CSS on the section (`max-width: 772px; margin-inline: auto` on the media wrapper, selector unknown) | The automatic rule is standalone only. On Shopify, uploading the real photo fixes it |
| A2 scrolling name, speed, hover pause, reduced motion | Theme | Text "Byman Cykler.", speed: slow |
| A2 pause button | **Not possible without code**. A known limitation | Only on the standalone page |
| A3 eyebrow with dot, h1, intro, centred, width | Theme (Rich text) | Check that the heading is the only `h1` [unverified] |
| A4 three buttons, 44 px, no-email variant | **Liquid ②** | Use the theme's own button classes if they exist (check `snippets/` for `button`), so the look comes from the theme |
| A4 hours table, today highlight, notice, Kontakt and Find os cells | **Liquid ②** | §6.1–6.5. The table is the one place to type the hours |
| A5 heading and intro | Theme (Rich text) | |
| A5 equal cells, 1px lines | Logo list (Static) + **CSS**, or **Liquid ③** | Decide when the theme files show Logo list's markup |
| A5 per-logo `scale`, badge factor, single colour | **Liquid ③** (CSS mask, files from Content → Files via `file_url`), or pre-coloured red files in Logo list | `<img>` can't take `currentColor`. Red files mean recolouring PNGs, which Søren allowed (single colour) |
| A5 "…og mange flere" tile | **Liquid ③**, or section-map option (a): end the intro with "…og mange flere" | |
| A6 logo, heading, newsletter, password entry | Theme (`main-password`) | Standalone uses the wordmark (§1.4, §1.5) |
| A7 footer columns | Theme (Text columns with images, no images) | 1px lines between columns [unverified]. CSS if missing |
| CVR line | Theme (last column text or a small Rich text) | |
| Focus rings, hover | Theme for theme sections. Our Liquid blocks use the §8.2 rule scoped to their own wrapper | |
| Contrast option (§10) | Theme setting: colour scheme 1 text/accent/button | On Shopify, option B is simplest as one global colour change (headings too). The difference from #FF2E00 is hard to see |

---

## 10. Contrast (needs Søren's decision)

**Calculated** with the WCAG 2.x formula (relative luminance of #FF2E00 = 0.2321):

| Pair | Ratio | Normal text (needs 4.5) | Large text ≥ 24 px (needs 3) | Non-text (needs 3) |
|---|---|---|---|---|
| #FF2E00 on #FFFFFF | **3.72:1** | **fails** | passes | passes |
| #FFFFFF on #FF2E00 | **3.72:1** | **fails** | passes | passes |
| 60% red (`--color-text-muted`) on white | 2.43:1 | fails | fails | fails. **Never use it for text** |
| #000000 on #FF2E00 | 5.64:1 | passes | passes | passes |
| #FFBFBF lines on white | 1.56:1 | decoration only, no requirement | | |

**Result:** 14 px body text **fails WCAG AA** in the Press palette. So do all labels, buttons, table rows, the 11.2 px lines, the white text on the red button, and the 21.88 px headings below 1024 px (Instrument Serif 400 at 21.88 px isn't "large").

These pass: the h1 (34–67 px) and the headings from 1024 px (34–53 px) as large text; logos and the wordmark (logotypes are exempt); the scrolling name (decorative, `aria-hidden`); the lines and the focus ring (non-text, 3:1).

**Built-in switch:** all small text uses `--color-text-small`, the filled button `--color-button-bg-primary` and `--color-button-text-primary`, and headings below 1024 px use `--color-text-small` too. **Default = Press as measured** (all #FF2E00, white on red). Nothing changes until Søren decides.

| Option | Change | Result | Look |
|---|---|---|---|
| **0: keep Press** | none | fails AA for small text | exactly the theme |
| **A: in the Press palette** (black is in Press colour schemes 4 and 5) | `--color-text-small: #000000; --color-button-text-primary: #000000` | 21:1 text, black on red button 5.64:1 | red headings, black small text. Clearly a different look. Mobile h2s would turn black, unless they are raised to `--font-size-2xl` (27.34 px, large) |
| **B: closest look (recommended)** | `--color-text-small: #E02800; --color-button-bg-primary: #E02800` | 4.70:1 both ways. The lightest same-hue red that passes is #E52900 (4.52:1); #E02800 leaves a safety margin | almost the same red. Headings, logos and lines stay #FF2E00. See `page.html?small=b` |

**This is a palette change, so I haven't made it.** On Shopify, option B is a theme colour setting.

---

## 11. Test files (all in `design/ui-tests/`, open over http://localhost:3002/)

| File | What it checks | Switches |
|---|---|---|
| `fonts.html` | The fallback stacks: h1 at 375 and 320, Danish characters, width ratios against Instrument Serif and Space Mono | none |
| `grid.html` | Brand grid exactly as in §5 | `?n=7\|12\|25`, `&badge=1.2`, `&nomask=1`, `&label=1` |
| `page.html` | All of Layout A with this spec | `?photo=temp\|full\|none`, `&email=0`, `&n=…`, `&special=soon\|long\|today`, `&now=2026-10-09T10:30`, `&nojs=1`, `&reduce=1`, `&small=b\|a`, `&focus=1` |

**What I checked:**
- **Grid:** 7, 12 and 25 logos at 375, 768, 1024, 1280 and 1920.
- **Full page:** 375, 768, 1024 and 1280 with the contained photo; 1280 and 375 full-bleed.
- **Edge cases** (at 375 and 1280):
  - no photo plus no email plus 4 special dates on a Sunday ("Lukket · åbner i morgen 09.00");
  - special hours today ("Åbent nu · lukker 12.00", and the Friday row showing 10.00–12.00);
  - no JS, reduced motion, focus rings, and contrast options A and B.
- Screenshots are in the scratchpad (`a7/grid/`, `a7/page/`), not in the project.

---

## 12. Open items

**For Søren:**
1. Contrast (§10): keep Press, A or **B (recommended)**.
2. The pause button on the scrolling name (§4.6). It is needed for WCAG 2.2.2, but it is a small addition to the Press look.
3. Times as "09.00" (§6.2).
4. Information only: the contained temporary photo (§4.2) replaces the soft full-width photo from the wireframe, and switches back by itself when the real photo arrives.

**For A5 (copy), new strings:**
- `hours.today = i dag` (screen readers only);
- `hero.scroll.pause = Sæt rulleteksten på pause` (button label).

**For A8 (build):**
- Read the photo size in plain Node, since Vercel has no `sips`.
- Make the image versions on the Mac (AVIF and JPEG; `sips` can't write WebP).
- Confirm the `specialHours` entry shape (§6.5).
- Write `--scale`, `--ratio`, `logo--badge`, `brand-grid--many` and `--span-*` from the data.

**Re-check when the theme files arrive:**
- Whether 1280 (`xl`) exists in the theme CSS.
- Logo list's markup (cells, lines, image sizes).
- Image with scrolling text: speed values, direction, and any pause control.
- `main-password`'s look and heading level.
- The theme's button classes and focus style.
- Whether the "Custom CSS" field exists on Baseline sections.
