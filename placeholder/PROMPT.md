# Prompt: Temporary front page for Byman Cykler

## How to use this (for Søren)

1. **Already done:** a temporary shop photo is in `placeholder/assets/img/facade-placeholder.png`. When you have the real photo, put it in the same folder and ask Claude to swap it in.
2. **Later, when you have the Press theme files:** Shopify admin → Online Store (Webshop) → Themes (Temaer) → `⋯` next to Baseline → *Download theme file*. Shopify emails you a ZIP. Unzip it into `placeholder/theme-export/` and ask Claude to "re-check the section map against the theme files". Until then, the Press demo store is the design reference.
3. Start a **new** Claude Code session in the `Byman-cykler` folder.
4. Copy everything between `PROMPT START` and `PROMPT END` and paste it as your first message.
5. Claude will stop **4 times** to ask you something. Everything else runs by itself.

## The setup at a glance

```
 Gate 0  You: email? where should the page live?
   │
 Wave 1  ┌─ A1 Theme analyst ─────── Press fonts, colours, lines + list of theme sections
 (5 in   ├─ A2 Google & data ─────── hours, address, phone, rating from Google + cross-check
 parallel├─ A3 Logos: ENVE, Specialized, Silca, MET
         ├─ A4 Logos: Polymer, GripGrab, DT Swiss
         └─ A5 UX research & Danish copy
   │
 Gate 1  You: are the facts right? which Polymer? all logos OK?
   │
 Wave 2  A6 UX architect ── 2 rough layouts + "which theme section builds what"
   │
 Gate 2  You: pick layout A or B
   │
 Wave 3  A7 UI designer ──► A8 Builder ── finished HTML, previewed on desktop + mobile
   │
 Wave 4  ┌─ A9 QA (facts, accessibility, mobile, speed, Danish)
 (2 in   └─ A10 Implementation guide (step by step in Shopify)
 parallel)   └─► A8 fixes QA findings (max 2 rounds)
   │
 Gate 3  You: approve → (optional) publish
```

---

## PROMPT START

You are the **orchestrator** for building a temporary front page (a "placeholder") for **Byman Cykler**, a high-end bike shop in Copenhagen. It stays up while the real Shopify webshop is being finished. You lead a team of 10 subagents, check their work, and stop at four gates for my approval.

I'm a coding beginner. Explain decisions in plain language, avoid jargon, and do the technical work for me.

### 1. The brief

The page must show:

1. **A photo of the shop from the outside**
2. **Opening hours**, taken from Google (the shop's Google Business Profile). Get as much useful data from Google as possible: normal hours, special/holiday hours, address, phone, map link, rating and number of reviews.
3. **Contact:** phone and email
4. **Address**, with a "Find vej" (directions) link
5. **Brands we carry:** ENVE, Specialized, Silca, MET, Polymer, GripGrab, DT Swiss, and more later. **Adding a brand must not require a redesign.** The layout has to work with 7 brands and with 25.

What the page should achieve, most important first:
1. Tell visitors that the shop and workshop are open and the webshop is coming
2. Get them to visit, call or write
3. Build trust by showing the brands

Optional: a newsletter signup ("Få besked, når webshoppen åbner"), but only if the theme supports it out of the box.

### 2. Fixed rules

- **Theme:** Shopify **Baseline** by Switch Themes, **Press** preset: https://themes.shopify.com/themes/baseline/presets/press. The style is inspired by brutalism: grids, graphic lines, modular dividers and single-colour palettes. The page must look like part of that theme, with the same fonts, colours, line weights, spacing, buttons and capitalisation.
- **I don't have the theme files yet.** Use the Press demo store as the reference for colours, fonts, spacing and layout patterns. Every claim about which theme sections exist or what they can do is *unverified* until I get the files. Label it that way, so it can be re-checked later.
- **Use the theme's own sections and blocks before custom code.** The final page should be buildable in the Shopify theme editor where possible. Use custom Liquid/HTML only as a last resort, and say clearly where and why.
- **Language:** all text visitors see is in **Danish**. Tone: knowledgeable, passionate about cycling, calm, never pushy.
- **No invented facts.** Every phone number, email, opening hour and address needs a source. If something is unknown, show a visible `[MANGLER: …]` placeholder and add it to my list. Never guess.
- **Photos:** don't copy photos from Google Maps, Street View or review sites (copyright and Google's terms).
  - **Temporary photo:** `placeholder/assets/img/facade-placeholder.png`. It is the shop front on Øster Farimagsgade: a charcoal grey facade with large windows, a white "BYMAN" wordmark in a rounded outlined badge, and "CYKLER" in small letters. It's only 515×388 px and is **temporary**. Use it in wireframes and the build, but don't optimise the design around its flaws.
  - **Real photo:** comes from me later. Swapping it in must mean replacing one file and rebuilding. State the size the real photo should be (aim for at least 2400 px wide, landscape, daylight).
  - **Theme colours stay in charge.** Press colours are the base. The facade's charcoal and white may be noted if they fit the Press palette, but don't change the palette without asking me.
- **Logos:** only from official sources (the brand's own website, press or media kit). Never redraw or stretch a logo. The only allowed change is making it a single colour (black/white).
- **Browsing:** when a cookie banner appears, decline anything non-essential. Never log in, create accounts or fill in forms.
- **Security:** the GitHub repo is **public**. Never write API keys, passwords or other secrets into any file. Don't commit or push without asking me. A push to `main` publishes the repo to Vercel automatically.
- **Starting data (check it, don't trust it):** Øster Farimagsgade 32, 2100 København Ø; phone 35 42 51 56 (from Krak/De Gule Sider). Email and opening hours are unknown. Specialized is the main brand. The workshop services all brands. The shop is especially strong in road bikes and electronic groupsets.

### 3. Workspace and handoff files

All work goes in `placeholder/`. **Agents hand off work through files, not chat.** Each agent writes only to its own files, so they never overwrite each other.

```
placeholder/
  research/       theme-analysis.md, ux-research.md, data-sources.md
  data/           business.json, brands-part-a.json, brands-part-b.json → brands.json (merged by you)
  design/         tokens.css, copy-da.md, wireframe.html, section-map.md, ui-spec.md
  assets/logos/   <slug>.svg (clean, single colour) + <slug>-original.svg/png + _contact-sheet.html
  assets/img/     facade-placeholder.png (temporary, 515×388) → real photo later
  build/          index.html, styles.css, app.js + optimised images
  build.mjs       small script that rebuilds build/index.html from the JSON files
  guide/          IMPLEMENTATION.md
  qa/             qa-report.md, screenshots/
  theme-export/   my unzipped theme files: NOT AVAILABLE YET; read only, never edit, when added
```

**`data/business.json`**
```json
{
  "name": "", "legalName": "", "cvr": "",
  "address": { "street": "", "postalCode": "", "city": "", "country": "DK" },
  "geo": { "lat": null, "lng": null },
  "phone": { "display": "35 42 51 56", "e164": "+4535425156" },
  "email": "",
  "website": "",
  "openingHours": [ { "day": "monday", "open": "10:00", "close": "17:30", "closed": false } ],
  "specialHours": [ { "date": "2026-12-24", "open": null, "close": null, "closed": true, "note": "" } ],
  "google": { "mapsUrl": "", "placeId": "", "rating": null, "reviewCount": null, "categories": [], "status": "OPERATIONAL" },
  "social": { "instagram": "", "facebook": "", "strava": "" },
  "sources": { "<field>": { "url": "", "retrieved": "YYYY-MM-DD", "confidence": "high|medium|low", "note": "" } },
  "missing": [ "email" ]
}
```

**`data/brands.json`** (an ordered list; order = display order)
```json
[
  {
    "name": "ENVE", "slug": "enve", "url": "https://www.enve.com",
    "category": "Hjul & komponenter",
    "logo": "assets/logos/enve.svg", "logoSource": "<url>",
    "scale": 1.0, "featured": true, "notes": "usage rules, if any"
  }
]
```
`scale` (0.6 to 1.4) evens out how big the logos look, so a thin wordmark and a heavy one feel the same size.

### 4. The team

Run the work in waves. **Agents in the same wave are started in one message so they run at the same time.** Give every agent this whole section 2 ("Fixed rules") plus its own brief. Use `model: "sonnet"` for A2–A5 (research and fetching). Use the default model for A1 and A6–A10 (judgement, design, building, review).

#### Gate 0: quick questions before starting

Ask me these with multiple choice and recommended defaults:
1. What email should visitors use? (Or: "find it online")
2. Where should the page live while the webshop is being built?
   - **Shopify password page** (recommended if the store isn't open yet): visitors see it instead of the store. Built in the theme editor.
   - **Standalone page on Vercel / own domain**: fully custom and visible on Google. Needs a domain change.
   - **Decide later**: build the HTML first, then compare the options in the guide.

Then confirm that `placeholder/assets/img/facade-placeholder.png` exists. Also check whether `placeholder/theme-export/` has appeared since this prompt was written; if it has, A1 should use it.

#### Wave 1: research (5 agents in parallel)

**A1 Theme analyst**
- Find the Press demo store (the "View demo store" link on the theme page). Open it with the browser tool (Claude in Chrome or Playwright) and **measure, don't guess** the computed styles:
  - fonts for headings, body text and small labels: size scale, weight, letter spacing, capitals
  - colours for background, text, lines, buttons and accent
  - line/border thickness and style, corner rounding
  - spacing rhythm, container width, grid columns
  - button styles including hover
  - how sections are separated (lines, boxes, grids)
- Take screenshots of the demo at 1280px and 375px for later comparison (`qa/screenshots/press-demo-*.png`).
- List the theme's sections as well as you can **without the theme files**. Use the Press demo (and the other Baseline preset demos), the theme store page, Switch Themes' help pages and Shopify Community threads. For each section give:
  - its name in the editor
  - what it does and which blocks it has
  - where the information came from: **seen in demo / from documentation / unverified**
  - whether it can probably be used on the password page
  
  Look especially for: image banner/hero, image with text, rich text, text columns/multicolumn, logo list, map, contact, newsletter, custom Liquid. A known fact: Baseline's built-in password section (`main-password`) only has a logo, a heading, a newsletter signup and social sharing.
- Write a short **"check when theme files arrive"** list. It should say which files settle the open questions: the `{% schema %}` in `sections/*.liquid`, especially `enabled_on`/`disabled_on`, plus `templates/password.json` and `layout/password.liquid`.
- Fonts: find out whether the Press fonts come from Google Fonts (free to use anywhere) or are licensed through Shopify only. If Shopify only, suggest the closest free font for the standalone HTML.
- **Output:** `research/theme-analysis.md` and `design/tokens.css` (CSS custom properties: `--font-heading`, `--color-text`, `--border-width`, `--space-*`, etc.).
- **Done when** every token has a measured value and every section has a source label.

**A2 Google & business data**
- Find the shop's Google Maps listing (search "Byman Cykler Øster Farimagsgade 32" in the browser tool). Record:
  - official name, address, phone, website
  - **hours for each day**, special/holiday hours, and whether the listing is marked temporarily closed
  - categories, rating, number of reviews
  - the Maps link, the place ID if visible, and coordinates
- Check against at least 2 other sources: Krak/De Gule Sider, the shop's Facebook/Instagram, CVR (virk.dk) for the legal name and CVR number, and brand dealer locators (for example Specialized's store finder). For hours, Google wins, but list every disagreement.
- Email: Google rarely shows it. Look on social profiles, directories and dealer locators. If not found, add it to `missing`.
- Also write a short **"live hours later"** section. It should describe, without building anything, how the hours could update automatically from the Google Places API (Place Details: `regularOpeningHours`, `currentOpeningHours`, `rating`, `userRatingCount`, `googleMapsUri`) through a small Vercel function in the existing `api/` folder. Explain in plain language what I'd have to do myself (Google Cloud account, API key stored as a Vercel environment variable and **never** in the repo, billing), plus the pros and cons.
- **Output:** `data/business.json` and `research/data-sources.md`.

**A3 Logo hunter: ENVE, Specialized, Silca, MET**
**A4 Logo hunter: Polymer, GripGrab, DT Swiss** (same brief)
- Confirm which company each brand is: MET = the Italian helmet brand; GripGrab = the Danish gloves and clothing brand. **"Polymer" is unclear.** List the cycling brands it could be, with links, and don't pick one silently. Get the logo of the most likely one, but mark it "needs confirmation".
- Look for the logo in this order:
  1. an SVG from the official press/media kit
  2. the SVG in the brand website's header (extract the `<svg>` element)
  3. an official PNG at least 600px wide with a transparent background
  
  Use Wikimedia Commons only if it matches the current official logo, and note that you did.
- Save the untouched file as `<slug>-original.*`. Then make `<slug>.svg`:
  - remove fixed width/height and keep the `viewBox`
  - crop the `viewBox` tightly around the logo
  - change all colours to `currentColor` so the logo takes the theme's colour
  - use the horizontal wordmark rather than an icon-only logo
- Write down any usage rules from the brand guidelines (clear space, allowed colours).
- Suggest a `scale` value for each logo so they look equally big next to each other.
- **Output:** the logo files plus `data/brands-part-a.json` (A3) or `data/brands-part-b.json` (A4).

**A5 UX researcher & Danish copywriter**
- Study 6–8 examples:
  - premium bike shops (Danish and international, including Specialized concept stores)
  - good "webshop coming soon" pages for physical shops
  
  Note what's at the top of the page, how hours and brands are shown, and what feels premium versus cheap.
- Describe:
  - why people visit: check hours, call, find the way, see brands, "can they service my bike?"
  - content priority, **mobile first** (most people will look up hours on their phone)
  - local SEO: title, meta description, schema.org `BikeStore` structured data, the same name/address/phone everywhere
  - accessibility basics
- Write the Danish copy:
  - page title and meta description
  - 3 headline options and a short intro (the shop and workshop are open, the webshop is coming)
  - section headings and buttons ("Ring til os", "Find vej", "Skriv til os")
  - brand intro, an "…og mange flere" line, and the footer
  
  Keep it short and true. Don't promise dates or services we haven't confirmed.
- **Output:** `research/ux-research.md` and `design/copy-da.md`.

**After Wave 1, you (the orchestrator):** merge `brands-part-a/b.json` into `brands.json` in the order ENVE, Specialized, Silca, MET, Polymer, GripGrab, DT Swiss. Build `assets/logos/_contact-sheet.html`, showing all logos side by side on the Press background colour, at the suggested scale. Check that every output exists and follows its schema; if not, send the agent back to finish.

#### Gate 1: I check the facts

Show me:
- a simple table with each fact, its value, its source and how sure you are
- the list of missing items
- a screenshot of the logo contact sheet

Ask me:
- whether everything is right
- which Polymer we mean
- whether any logo looks wrong
- for anything still missing (for example the email)

#### Wave 2: layout

**A6 UX architect** (reads everything from Wave 1)
- Make **2 different rough layouts** (grey boxes, real Danish text) in `design/wireframe.html`, each for desktop and mobile. For example:
  - **A:** a large photo across the top, then a grid with hours, contact and address, then brands
  - **B:** photo and info side by side, then brands
- Write `design/section-map.md`: for each part of the page, which Baseline section/block builds it in Shopify (from A1's list), its settings, and **what needs custom code**. Do this separately for the password page and for the standalone page. Carry over A1's source labels, so I can see which rows must be re-checked when the theme files arrive.
- The wireframes use the real temporary photo (`facade-placeholder.png`), not a grey box.
- Decide the order of content on mobile.

#### Gate 2: I choose the layout

Add a `placeholder` entry to `.claude/launch.json` (`python3 -m http.server 3002 --directory placeholder`) **without removing the existing entries**. Start the preview and show me screenshots of both layouts on desktop and mobile. Explain the difference in 2–3 sentences and give your recommendation.

#### Wave 3: design and build (one after the other)

**A7 UI designer**
- Apply `tokens.css` to the chosen layout and write `design/ui-spec.md`:
  - **Text and spacing:** fonts and sizes for every element, plus spacing.
  - **Lines:** how lines and dividers are used, in the Press style.
  - **Photo:** aspect ratio, focal point (the BYMAN sign and the entrance), and whether it's in colour or black and white. The temporary photo is small (515 px), so define how it's shown until the real one arrives. Never stretch it more than about 1.5×; a contained frame or a Press-style treatment is fine.
  - **Brand grid:**
    - equal cells with thin lines between them (the Press grid look), each logo centred and sized by height × `scale`, all in one colour
    - columns: 2 on mobile, 3–4 on tablet, 4–6 on desktop
    - define what happens when the last row isn't full
    - an "…og mange flere" tile
    - **check the design with 7, 12 and 25 logos**
  - **Opening hours:** today's line highlighted, a status like "Åbent nu · lukker 17:30" or "Lukket · åbner i morgen 10:00", and a notice when special hours are coming up.
  - **Special situations:** what the page looks like with no photo, no email, or with JavaScript turned off.
- Only add to `tokens.css`; never change the measured values.

**A8 Builder**
- Build `build/index.html`, `styles.css` and `app.js` in plain HTML/CSS/JS, with no frameworks.
- **All content must be in the HTML itself** so the page works without JavaScript and Google can read everything. Generate `index.html` from `business.json`, `brands.json` and `copy-da.md` with `placeholder/build.mjs` (Node, no extra packages). Adding a brand should then mean: add one entry to `brands.json`, add the logo file, and run `node placeholder/build.mjs`.
- JavaScript only adds the "open now" status. Use `Intl` with the time zone `Europe/Copenhagen` and take special hours into account.
- Add schema.org `BikeStore` JSON-LD: name, address, geo, telephone, email, `openingHoursSpecification` (including special hours), `sameAs`, url.
- **Links:**
  - phone as `tel:+45…` and email as `mailto:`
  - "Find vej" goes to the Google Maps link
  - **no embedded Google Maps by default**, because it sets cookies that need consent under EU rules. If you add a map, it must only load when clicked.
- **Images:**
  - the shop photo in modern formats (WebP/AVIF) with a JPEG fallback, using `srcset`. Use the tools already on the Mac (for example `sips`), and don't install anything without asking.
  - set `width`/`height`, and load it first (`fetchpriority="high"`)
  - `build.mjs` takes the photo's file name from one setting, so swapping in the real photo means changing one line and rebuilding
  - logos as inline SVG so `currentColor` works
- Use the Press fonts, or A1's free alternative.
- Check it in the preview at 375, 768 and 1280px with no console errors. Then show me desktop and mobile screenshots.

#### Wave 4: review and documentation (2 agents in parallel)

**A9 QA**
- **Facts:** every fact on the page matches `business.json` and its sources.
- **Accessibility (WCAG 2.2 AA):**
  - contrast and focus states
  - Danish alt text
  - heading order
  - tap targets of at least 44px
  - `lang="da"`
- **Layout:** check at 375, 768, 1280 and 1920px. Test the brand grid with 7, 12 and 25 logos using temporary copies, and remove them afterwards.
- **Speed:** total page weight and image sizes. Run Lighthouse if it's available; aim for 90+ in every category.
- **Theme match:** compare side by side with the Press demo screenshots.
- **Temporary photo:** always list it as "Must replace before going live". It's low resolution, and we must own the rights to the photo we publish.
- **Other checks:**
  - proofread the Danish
  - JSON-LD structure
  - no secrets, no trackers, no external requests that need cookie consent
- **Output:** `qa/qa-report.md` with findings sorted as Must fix / Should fix / Nice to have, plus screenshots.

**A10 Implementation guide**
- Write `guide/IMPLEMENTATION.md` in simple English for a beginner, with the Danish Shopify menu names in brackets.
- **Path 1, Shopify password page:**
  - **Turn it on:** Online Store → Preferences (Præferencer) → Password protection.
  - **Find it:** in the theme editor (Customize), choose the Password page from the page menu at the top.
  - **Build it, part by part:** which section to add, which settings, what text to paste, and where to upload the logos (Content → Files / Indhold → Filer).
  - **Custom code:** where it's needed, give the exact snippet and where to paste it.
- **Path 2, standalone page on Vercel / own domain:** how it's published, and how a domain would point to it.
- **Comparison of the paths, in plain words:**
  - Google visibility: a password page isn't shown on Google; the Google Business Profile still is
  - how hard it is to update
  - the risk of customers reaching the unfinished store
  - what changes on launch day
- **Maintenance:**
  - changing hours (update Google *and* the page)
  - adding a brand: in Shopify, add a block; in HTML, add it to `brands.json` and rebuild
  - holiday hours
- A checklist before going live, including swapping in the real photo.
- **When the theme files arrive:** a short section on what to do. Put the ZIP in `theme-export/` and ask Claude to re-check every *unverified* row in `section-map.md`. Note that the Shopify steps in this guide are based on the demo until then.

**Fix loop:** send A9's "Must fix" and "Should fix" items to A8 with SendMessage, so it keeps its context. Allow at most 2 rounds, then ask A9 to re-check.

#### Gate 3: final approval

Show me:
- final screenshots (desktop and mobile)
- what was built and which path you recommend
- anything still missing or marked `[MANGLER]`, plus the temporary photo and any unverified theme sections
- the guide

Ask whether I want it committed and published. Remember: a push to `main` goes live on Vercel and the repo is public. Never commit my other untracked files (`kollektioner.md`, `sider*.md`, `metafelter.md`).

### 5. Rules for you, the orchestrator

- Before each wave, check that the previous outputs exist and follow the schemas. Re-brief an agent rather than quietly fixing big gaps yourself. Small fixes are fine.
- Give me a 1–2 sentence update when each wave starts and ends.
- Don't let agents edit each other's files. Only you merge.
- Finish with, in plain language: what's done, what's missing, and the next 3 things I should do.

## PROMPT END
