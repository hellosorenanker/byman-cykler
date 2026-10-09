# Section map: which theme section builds what

Written by A6 UX architect, 2026-10-09 (Wave 2). It goes with `design/wireframe.html`.

> **Important:** we still don't have the theme files. Every statement below about Baseline sections is **unverified** until they arrive. I carried over A1's source labels from `research/theme-analysis.md`, so you can see which rows to re-check:
> - **[seen in demo]**: A1 saw the section working in a live demo store.
> - **[from documentation]**: Switch Themes' help site says so, but nobody has seen it working.
> - **[unverified]**: a best guess with no direct source.
>
> The **"Password page?"** column is A1's estimate. "Yes" means it's the built-in password section. "Probably" means the documentation says the section works on every page except Checkout and Gift card. A1 is about 80% sure that holds for the password page.

**How to look at the wireframe:** open `design/wireframe.html?layout=a` or `?layout=b`. Add `&brands=25` to test the brand grid with 25 logos, or `&tags=0` to hide the grey section tags. The grey tags name the Shopify section that would build each part of the password page, and `?` means unverified.

---

## 1. The two layouts in short

| | Layout A: "Foto først" | Layout B: "Foto og info side om side" |
|---|---|---|
| Idea | Full-width rows stacked like the Press home page: a status strip (where Press puts its announcement bar), a full-width photo with large scrolling "Byman Cykler" text, the headline, buttons and practical info, brands, newsletter, footer. | Press's "Image with text" split. The photo takes 8 of 12 columns and an info column takes the other 4 (status, buttons, hours, contact, address). The headline sits above in a centred title row. |
| Desktop first screen | Photo and status line. The hours table is below the first screen. | Photo, status, buttons and the hours table all show in the first screen. |
| Mobile | Status first, then photo, headline, buttons, hours. | Logo bar, headline, photo, then status, buttons, hours. |
| Brand grid | 4 per row, so 7 logos plus the "…og mange flere" tile fill exactly 2 rows. It switches to 6 per row by itself from 12 logos. | Always 6 per row, so row 2 has 1 logo and a wide "…og mange flere" tile. |
| Where `main-password` sits | At the **bottom**: logo, newsletter and the theme's own password entry, like the Press footer. | At the **top**, as a logo bar with its newsletter switched off. The newsletter is then a separate section. |

---

## 2. Content order on mobile (decision)

Most visitors check opening hours on their phone (`research/ux-research.md` §2–3). This is the order I recommend, and the order Layout A uses:

| # | Content | Why |
|---|---|---|
| 1 | **Status line** "● Åbent nu · lukker 16:00" as a 32px strip at the very top | "Har de åbent nu?" is the most urgent question. **This differs from ux-research**, which put the photo first. The strip costs only 32px and answers the question before any scrolling. The position matches the Press announcement bar. |
| 2 | **Photo** at its natural shape, not Press's default 4:5 mobile crop | Confirms "this is the right shop". At its natural shape it's about 270px tall instead of about 470px, so the buttons move up. |
| 3 | **Eyebrow, headline and intro** | Says that the shop and workshop are open and the webshop is coming. |
| 4 | **Three buttons**, stacked, full width, at least 44px tall: Ring til os (filled), Find vej, Skriv til os | The main actions, within thumb reach. |
| 5 | **Hours table** with today highlighted, and "Åbningstider fra Google" under it | The whole week at a glance. |
| 6 | **Kontakt**: phone and email as tap-able links | |
| 7 | **Find os**: the address and a second "Find vej" link | People don't always scroll back up to the button. |
| 8 | **Brands**: heading, intro (which includes "the workshop services all brands"), 2-column grid and the tile | Builds trust. Nice to have for people in a hurry. |
| 9 | **Newsletter** | Low priority, so it never pushes items 1–5 down. |
| 10 | **Footer**: name, address, phone, email, CVR, Instagram/Facebook | NAP (name, address, phone) repeated for consistency. |

**Measured in the wireframe at 375px wide** (wireframe notes left out, fallback fonts):
- Layout A: status at 0px, buttons from about 550px, hours table from about 780px.
- Layout B: status at about 600px, buttons from about 630px, hours table from about 830px.

With the real Instrument Serif, which is narrower, the headings take fewer lines, so everything moves up a little. In Layout B the logo bar, headline and photo come before the status line, and that's the main reason A scores better on mobile.

---

## 3. Layout A on the Shopify password page

8 sections from top to bottom. ① and ② are the custom-code parts.

| # | Part | Baseline section (editor name) | Settings to use | Custom code? | Source (A1) | Password page? |
|---|---|---|---|---|---|---|
| A1 | Status strip "Åbent nu · lukker 16:00" | **Custom liquid** | The code box holds one line of HTML and a small script. The script reads the hours from the table in A4, so the hours are typed only once. If JavaScript is off, the strip stays hidden. | **Yes ①.** Needs JavaScript (see §6.1). | from documentation (in no demo) | Probably |
| A2 | Shop photo with large scrolling "Byman Cykler." text | **Image with scrolling text** (the Press hero) | Image: the facade photo. Mobile image: none. Desktop height: as in the demo (16:9) or "Natural". **Mobile height: "Natural"** (not the 4:5 crop). Text: "Byman Cykler." Speed: slow. Colour scheme 1. If the scrolling text is unwanted, use **Image with text overlay** with no text. | No | seen in demo + from documentation | Probably (the docs also exclude Customer pages) |
| A3 | Eyebrow, headline, intro | **Rich text** | Subheading: `hero.eyebrow`. Heading: `hero.headline`. Text: `hero.intro`. Centred. Desktop width "Two thirds" or "Half". No call to action. | No | from documentation | Probably |
| A4 | 3 buttons, hours table (today highlighted), Kontakt, Find os | **Custom liquid** | One code block: a row of 3 buttons, then 3 cells (Åbningstider / Kontakt / Find os). The hours are typed here once, with the open and close times stored on each table row so the script in A1 can read them. | **Yes ②.** The theme sections give at most 1–2 buttons each and can't hold a table or highlight today (see §6.2 and §6.5). | from documentation | Probably |
| A5a | "Mærker vi forhandler" and the intro | **Rich text** | Heading: `brands.heading`. Text: `brands.intro`. Centred. | No | from documentation | Probably |
| A5b | Brand grid | **Logo list**, display **Static** | 7 Logo blocks (image, optional link), centred, no heading. Logo max width: about 220px, then adjust by eye. | **Maybe.** See §6.4: grid lines, the "…og mange flere" tile and per-logo sizing are open questions. | seen in demo (Baseline, Brutalist, Courier) + from documentation | Probably |
| A6 | Logo, newsletter, the theme's password entry | **Password - content** (`main-password`), **moved to the bottom** | Logo: Byman logo `[MANGLER]`, width about 250px. Heading: `newsletter.heading`. Newsletter: on. Form heading: `newsletter.text` (there seems to be no separate text field, [unverified]). Placeholder: `newsletter.email.label`. Button: `newsletter.button`. Social sharing: off. | No | from documentation (and a 2022 community copy of `password.json`) | **Yes**, built in |
| A7 | Footer: name, address, phone, email, socials, CVR | **Text columns with images**, with no images | 4 Column blocks: `footer.text` / name and address / phone and email links / Instagram and Facebook links. Add the CVR line to the last block or a small Rich text. | No | from documentation | Probably |

**Custom-code parts in Layout A: 2** (① status strip, ② buttons, hours and contact), plus the brand grid if Logo list can't do the grid look. The photo, headline, brands, newsletter and footer can all be edited in the theme editor.

Notes for A:
- **Moving `main-password` to the bottom** is [unverified]. In Shopify's newer themes the main section of a page can't be removed but can usually be reordered, so check this in the editor. If it can't move, it stays at the top and the page looks like Layout B's top.
- **Only one h1 per page.** Check which HTML heading tag Rich text and `main-password` use, so the headline in A3 is the only h1. [unverified]

---

## 4. Layout B on the Shopify password page

7 sections from top to bottom. ① is the custom-code part.

| # | Part | Baseline section (editor name) | Settings to use | Custom code? | Source (A1) | Password page? |
|---|---|---|---|---|---|---|
| B1 | Logo bar | **Password - content** (`main-password`) at the **top** | Logo: Byman logo `[MANGLER]`. Heading: empty. Newsletter: **off**. Social sharing: off. | No | from documentation | **Yes**, built in |
| B2 | Eyebrow, headline, intro | **Rich text** | Same as A3 | No | from documentation | Probably |
| B3 | Photo (8/12) next to the info column (4/12): status, 3 buttons, hours, Kontakt, Find os | **Custom liquid** | One large code block holding everything, including the photo. The photo is uploaded to Content → Files and called from the code. | **Yes ①, large.** The theme's **Image with text** only has subheading, heading, text and 1 button. It can't hold a table, 3 buttons or a live status. | from documentation | Probably |
| B4a | "Mærker vi forhandler" and the intro | **Rich text** | Same as A5a | No | from documentation | Probably |
| B4b | Brand grid, 6 per row | **Logo list**, Static | Same as A5b | **Maybe** (§6.4) | seen in demo + from documentation | Probably |
| B5 | Newsletter | **Newsletter** | Heading: `newsletter.heading`. Text: `newsletter.text`. Form side by side with the heading on desktop. Colour scheme 1. | No | from documentation (a newsletter row appears in the demo footer: seen in demo) | Probably ("Template and Footer areas") |
| B6 | Footer | **Text columns with images**, with no images | Same as A7 | No | from documentation | Probably |

**Custom-code parts in Layout B: 1**, plus the brand grid if needed. That one part is large: it holds the photo and **all** the practical information.

Notes for B:
- **Fewer code parts, but more of the page in code.** The photo leaves the theme's image picker, so the theme no longer makes the smaller versions for phones automatically. You can only swap it by re-uploading a file with the same name or editing code. Hours, phone, email and address all sit inside the code box too.
- **Without code**, B3 becomes Image with text (photo plus the hours as plain lines and 1 button, with no status and no highlight). The page then is basically Layout A with less on it.
- If the **Newsletter** section isn't allowed on the password page, turn `main-password`'s own newsletter on (then the newsletter sits at the top) or move `main-password` to the bottom (which is Layout A).
- If `main-password` turns out to be a tall, centred, full-screen block (common for password sections, and nobody has measured Baseline's yet), B's top becomes very heavy. Layout A's placement at the bottom contains that risk.

---

## 5. Standalone page (Vercel), both layouts

This is plain HTML that `build.mjs` generates from `business.json`, `brands.json` and `copy-da.md`. "Custom code" here just means ordinary HTML, CSS and JavaScript. All of it is ours, and nothing depends on the theme.

> **Orchestrator note (after the build, 2026-10-09):** Layout A was chosen. Where the table below differs from what was actually built, `build/` and `design/ui-spec.md` win:
> - **Status line without JS:** it shows a neutral "Åbningstider ↓" link. It is not hidden.
> - **Photo formats:** AVIF + JPEG only, because the Mac's `sips` can't write WebP.
> - **Photo size:** the temporary photo is shown in a contained frame (max 772 px). It goes full width automatically once the photo is ≥ 2400 px.
> - **Brand grid:** 2 per row on mobile and 4 from 768 px. It switches to 6 per row only with 12 or more logos, and only from 1280 px.
> - **PNG logos** use a CSS mask with files in `build/img/`.
> - **Newsletter:** left out of the standalone page (Søren, Gate 2).

| Part | HTML | Data from | JavaScript? | A vs B |
|---|---|---|---|---|
| Status line | A `<p class="status">` that starts hidden and is filled in by `app.js` | `openingHours`, `specialHours`; strings `hours.status.*` | **Yes**: `Intl` with time zone Europe/Copenhagen, special hours included. Stays hidden without JS. | A: top strip. B: top of the info column. |
| Photo | `<picture>` with AVIF, WebP and JPEG plus `srcset`, `width`/`height`, `fetchpriority="high"` | One file-name setting in `build.mjs` | No | A: full width, 16:9 on desktop. B: 8/12 column, cropped to the column height. Both natural shape on mobile. |
| Eyebrow, headline, intro | `p.subheading`, `h1`, `p` | `hero.*` | No | A: below the photo. B: above it. |
| 3 buttons | 3 × `<a class="btn">`: `tel:+4535425156`, `google.mapsUrl`, `mailto:` | `business.json` | No | A: a row of 3 cells (stacked on mobile). B: stacked in the info column. |
| Hours table | `<table>` with 7 rows, written into the HTML at build time | `openingHours`, `day.*`, `hours.closed`, `hours.source` | Only to highlight today | |
| Kontakt, Find os | A small 2-column table plus `<p>`, with real `tel:`/`mailto:` links | `business.json` | No | |
| Brands | `<ul>` with inline SVG logos (they take the text colour). The white ENVE and GripGrab PNGs need a dark version, or a CSS mask (which works over http, but not when the file is opened directly from disk). | `brands.json` (order = display order) | **No.** The last-row fill is CSS only (`nth-child`, see the wireframe). The switch to 6 per row from 12 logos uses `:has()`. | A: 4 per row (6 from 12). B: 6 per row. |
| Newsletter | **Open question.** The standalone page has no Shopify behind it. Options: leave it out (my suggestion); post to the Shopify store's signup form (unreliable while the store is password-protected, and it has spam protection); or a third-party service (needs consent and a data agreement). | | | |
| Footer | `<footer>` with name, address, phone, email, CVR and social links | `business.json` | No | |
| JSON-LD `BikeStore` | `<script type="application/ld+json">` built from `business.json` | `business.json` | No | Useful here, because this page **can** be indexed. |
| Meta title and description | `<title>`, `<meta name="description">` | `meta.*` | No | |
| Fonts | Fallback font stacks only (Gate 1: no Google font download) | `tokens.css` | No | |
| Map | **No embed.** "Find vej" links to Google Maps, so nothing sets cookies. | | | |

---

## 6. The custom parts on the password page, in detail

### 6.1 "Åbent nu" status (needs JavaScript, so it goes in Custom liquid)
- The page only knows the current day and time in the visitor's browser, so this needs a small script in a **Custom liquid** section. Liquid's server-side "now" isn't reliable because Shopify may cache the page. [unverified]
- Use time zone Europe/Copenhagen and the `hours.status.*` strings.
- In Layout A the status script only **reads** the hours from the table in ②, so the hours are typed in one place.
- Special hours: `business.json` has none today. On the password page they would also be typed into the code box.
- With JavaScript off, the status stays hidden. The hours table still works.

### 6.2 Hours table
- **Without the live status and the highlight, no code is needed.** A **Rich text** section, or a column block in **Text columns with images**, can show the 7 days as lines. Shopify's text fields allow paragraphs and lists, but not real tables [unverified], so it would be lines, not a table with dividers.
- **With today highlighted** (as in the wireframe), it has to be in Custom liquid: ② in A, ① in B.
- **Maintenance:** on the password page the hours sit in a code box. When hours change, update Google **and** this box.

### 6.3 JSON-LD (structured data for Google)
- **Not useful on the password page.** Shopify hides a password-protected store from search engines (ux-research §4), so Google never reads the structured data there. Leave it out.
- Use it on the **standalone page**, which can be indexed.
- At launch, check whether Baseline already outputs any schema in the real store. [unverified]

### 6.4 Brand grid with Logo list (Static): open questions
1. **How many logos fit?** The default is 5 Logo blocks. The theme's maximum is unknown, and Shopify's hard limit is 50 blocks per section. If 25 don't fit, stack two Logo list sections. [unverified]
2. **Grid lines.** Static mode probably shows the logos in a row, without the 1px cell lines and equal cells from the Press grid. A1 saw "As seen in" on the Baseline demo but didn't check its lines. If the lines are missing, the options are a few lines of **Custom CSS** in the section settings (small code) or the whole grid as **Custom liquid**.
3. **The "…og mange flere" tile.** Logo list has no text block. The options are:
   - (a) end the Rich text intro above the grid with "…og mange flere" (no code);
   - (b) a Custom CSS extra cell (small code);
   - (c) a Custom liquid grid.

   **Never** upload an image of the words.
4. **Sizing per logo.** Logo list seems to have one "logo max width" for all logos (20–800px). The `scale` values in `brands.json` can't be applied, so the square MET badge and the long Specialized wordmark can't be balanced. The options are Custom CSS per logo, or logo files with extra transparent space around them. That isn't redrawing, but it does change the file, so ask Søren first.
5. **White PNG logos.** ENVE and GripGrab are white and won't show on a white background. Upload single-colour black versions (allowed by the logo rule). Whether the image picker accepts SVG is [unverified]; if it doesn't, use PNGs at 2× size.
6. **Logo colour.** Søren's rule says black or white. Press text is red. DT Swiss's own guidelines (in `brands.json`) allow only black, white or grey. **So the logos should be black or grey, not red.** A7 and Søren to confirm.
7. **Links.** Linking every logo sends visitors away from the shop's page. I'd leave the links off. Søren's call.

### 6.5 Three round buttons
- Theme sections offer one button (Rich text, Image with text) or two (Text split, one per block). Three buttons together therefore need **Custom liquid**.
- **Possible no-code route [unverified]:** the **Featured menu buttons** section (from documentation, in no demo) shows a navigation menu as buttons. It works only if Shopify menus accept `tel:` and `mailto:` links and the section is allowed on the password page. If it works, the buttons need no code. It barely changes the count, though: in Layout A the buttons share code block ② with the hours anyway, and in Layout B they must sit inside the info column, which is code.
- The theme's buttons are 33px tall. On mobile we want at least 44px, which our code sets.

### 6.6 No header and no footer on the password page
- The password page has no header, footer or announcement bar ("static sections") [from documentation].
- The **logo** therefore comes from `main-password`. The **footer info** comes from a Text columns with images section. The **status strip** in A can't use the theme's announcement bar, so it is Custom liquid.

---

## 7. Ratings

| Criterion | Layout A | Layout B |
|---|---|---|
| **Mobile: hours visibility** | **Good.** The status is the first thing on the page (0px), and the hours table starts about 780px down. | **OK.** The status is at about 600px and the table at about 830px, after the logo bar, headline and photo. |
| Desktop first screen | Photo and status only. The hours are below the first screen. | Photo, status, buttons and hours are all visible. |
| **Theme fit** | **Good.** The same rhythm as the Press home page: bar, hero with scrolling text, title row, grid with lines, newsletter row. | **Good.** The Press "Image with text" split, tables like the Press product details, and a header-like logo bar. |
| **Building in the editor (password page)** | **Good.** Photo, headline, brands, newsletter and footer are theme sections. There are 2 code blocks, focused on hours and buttons, which any layout needs. | **Weak.** One large code block holds the photo and all practical info. The newsletter depends on an extra unverified section. Without code, B turns into A. |
| **Low-resolution temporary photo** | **Weak.** Full width on desktop (1252px) is about 2.4× the 515px file, so it looks soft until the real photo arrives. Mobile is fine. | **OK.** About 1.8× on desktop (cropped to the column height). Mobile is fine. |
| 7 → 25 brands | 7 logos plus the tile fill 2 rows of 4. It switches to 6 per row by itself from 12 logos. | 6 per row: row 2 has 1 logo and a wide tile, and the long Specialized wordmark gets smaller. |

---

## 8. The real photo (for Søren)

- **Landscape, daylight, at least 2400px wide.** Ideally **3600 × 2025 (16:9)**. Switch recommends at least 3600 × 1600 for hero images (A1).
- Keep the **BYMAN sign and the door in the middle third**. Layout B crops to the column height, and mobile shows the whole photo.
- To swap it on the standalone page, replace one file and rebuild. On Shopify, change the image in the hero section (Layout A) or re-upload the file in Content → Files under the same name (Layout B).
- The photo must be one the shop owns the rights to.

---

## 9. Open questions (also the re-check list for when the theme files arrive)

1. **Byman logo `[MANGLER]`:** is there an official logo file (SVG or PNG)? Until there is, the wireframe shows the name as text.
2. Can content sections go on the password page? A1 is about 80% sure (`templates/password.json`, section schemas).
3. Can `main-password` be moved, and what does it look like: a slim bar or a tall centred block? Where is its password entry, and is that text in Danish (`locales/da.json`)?
4. Logo list: the maximum number of blocks, grid lines in Static mode, the "…og mange flere" tile, sizing per logo, and SVG uploads (§6.4).
5. Featured menu buttons with `tel:`/`mailto:` menu links (§6.5).
6. Logo colour: black or grey, not Press red (DT Swiss rules) (§6.4).
7. Newsletter on the standalone page: leave it out, or where should signups go? (§5)
8. The **CVR in the footer**: I believe Danish rules (e-handelsloven § 7) require name, address, email and CVR to be easy to find on a business website, so I included it. Please confirm.
9. Time format: the data uses "09:00", while Danish style is often "09.00". A5 and A7 to decide.
10. Hours on the password page live in a code box, so there are two places to update (Google and Shopify). Is that OK?
11. At scale 1.4, MET looks about half the visual size of the wordmarks, and `brands.json` caps scale at 1.4. A7 could allow up to about 1.8 for square badges, or size logos by area instead.
12. A hidden "(i dag)" on today's row for screen readers isn't in `copy-da.md` yet. A5 to add the string.

---

## 10. Recommendation

**Layout A.** It answers "are they open now?" in the very first line on a phone, and it follows the Press home page so closely that it looks like part of the theme. On the password page everything except the hours and buttons is a normal theme section, including the photo. Its one weakness, the soft temporary photo at full width, disappears when the real photo arrives.
