# Theme analysis: Baseline (Switch Themes), Press preset

Written by A1 Theme analyst, 2026-10-09. This is Wave 1 research for the Byman Cykler placeholder page.

> **Important:** I didn't have the theme files. Everything about which sections exist or what they can do comes from the demo stores and the Switch Themes documentation. **Treat all of it as UNVERIFIED** until the files arrive. Section 7 lists exactly which files to check.

Source labels in this document:
- **[seen in demo]**: I saw it working in a live demo store.
- **[from documentation]**: Switch Themes' help site (help.switchthemes.co/baseline) or Shopify Help says so.
- **[unverified]**: my best guess, with no direct source.

---

## 1. Short version

| Question | Answer |
|---|---|
| Theme and version on the demo | Baseline **5.0.0** (the demo's `Shopify.theme` object). The theme store lists **5.4.0** (4 Aug 2026), so Søren's copy may be newer. |
| Heading font | **Instrument Serif**, 400, letter-spacing -0.025em, line-height 0.9, typed case (no capitals forced) |
| Body / label font | **Space Mono**, 400 (700 is also loaded), 14px, line-height 1.2. Labels, buttons, nav and links are UPPERCASE |
| Colours | Text, accent and button **#FF2E00** (red-orange). Background **#FFFFFF**. Lines **#FFBFBF** (light pink) |
| Line weight | **1px** everywhere: gridlines, section dividers, button borders, link underlines, input underlines |
| Corners | Images **20px**. Buttons, pills and badges **fully round (9999px)**. Boxes, sections and grid cells **square** |
| Page padding | **7px** on mobile, **14px** on desktop (from 1024px). No max container width: everything is full-bleed |
| Grid | **12 columns** on desktop, **1px gaps**. The pink lines are the background showing through the gaps |
| Fonts free to use? | **Yes.** Both are Google Fonts under the SIL Open Font License, so no substitutes are needed |
| Can other sections go on the password page? | **Probably yes (about 80% sure).** The documentation says content sections work on every page except Checkout and Gift card. Not yet checked in the code (section 6) |

---

## 2. Measurements (Press demo, computed in headless Chrome)

Pages measured: home (1280 and 375 wide), `/pages/about-us`, `/pages/contact`, `/collections/all`. All values are copied into `placeholder/design/tokens.css`.

### 2.1 Base
- The root font size is **87.5% = 14px**, so `1rem = 14px` in this theme. The theme setting is "base font size 14".
- Body: Space Mono, 14px, line-height 16.8px (1.2), weight 400, letter-spacing normal, colour #FF2E00.

### 2.2 Typography

| Role | Font | Mobile (375) | Desktop (1280) | Other |
|---|---|---|---|---|
| Hero scrolling text ("Honestly Good Coffee.") | Instrument Serif 400 | 34.17px | 104.31px | lh 0.9, ls -0.025em |
| Feature heading (page h1, product title) | Instrument Serif 400 | 34.17px | 66.75px | lh 0.9, ls -0.025em |
| Standard heading (section titles, "Join the club") | Instrument Serif 400 | 21.88px | 53.41px | lh 0.9, ls -0.025em |
| Secondary heading (blog card titles) | Instrument Serif 400 | 21.88px | 34.17px | lh 0.9 |
| Feature text paragraph ("Sunrise Coffee Co started…") | Instrument Serif 400 | 21.88px | 53.41px | centred, 75% wide on desktop |
| Collection-link pills ("All coffee") | Instrument Serif 400 | 34.17px | 66.75px | 1px outline pill |
| Body / rich text | Space Mono 400 | 14px | 14px | lh 1.2 |
| Subheading ("• BESTSELLERS") | Space Mono 400 | 14px | 14px | UPPERCASE, a 7px round dot before it, 5.25px gap, 7px margin below |
| Nav, breadcrumbs, links, buttons | Space Mono 400 | 14px | 14px | UPPERCASE |
| Small text (copyright, badges, textarea) | Space Mono 400 | 11.2px | 11.2px | badges UPPERCASE |

- Headings are **not** forced to capitals (`--heading-capitalize: none`). They keep the case you type, for example "Hot off the Roaster".
- The theme uses a **1.25 type scale**: 0.64, 0.8, 1, 1.25, 1.563, 1.953, 2.441, 3.052, 3.815, 4.768, 5.96, 7.451, 9.313 rem.
- A heading with a product count gets a superscript number ("Let's Mix Things Up⁸").
- The subheading and button font settings point to a variable (`--main-font-stack`) that the theme never defines, so they fall back to the body font (Space Mono). I measured this on the live page.

### 2.3 Colours (Press colour scheme 1, used by every home page section)

| Token | Value | Where measured |
|---|---|---|
| Background | `#FFFFFF` | sections, header, grid cells |
| Text | `#FF2E00` (rgb 255 46 0) | body, headings, links |
| Lines / gridlines | `#FFBFBF` (rgb 255 191 191) | grid backgrounds, section bottom borders |
| Accent | `#FF2E00` (the same as the text) | `:root` scheme 1 |
| Primary button | `#FF2E00` background, `#FFFFFF` text, `#FF2E00` border | "Check out" and "Buy it now" buttons |
| Secondary button | transparent background, `#FF2E00` text and 1px border | "READ NOW" |
| Badges ("SALE", "NEW!") | `#FFFFFF` on `#FF2E00` | product cards |

The preset also defines four more colour schemes. I found them in the `:root` CSS, but no home page section uses them:
- scheme 2: red background `#FF2E00`, white text, pink accent `#FFBFBF`
- scheme 3: light grey `#F8F8F8` background, red text, `#D2D2D2` secondary
- scheme 4: black `#000000` background, white text
- scheme 5: white background, black `#000000` text

**Facade note:** the shop front is charcoal with a white wordmark. That comes closest to scheme 4 (black and white), which is already part of the Press palette. I have **not** changed the palette. Using scheme 4 for one section (for example around the facade photo) would stay inside the theme, but ask Søren first.

### 2.4 Lines, borders and corners
- **Every line is 1px solid.** That covers `--gridline-width`, `--text-border-width`, `--button-border-width` and `--checkbox-width`. There is a 2px "double" variant (`border-b-gridline-double`), but I didn't see it on the demo pages.
- **How the grid lines are made:** a grid container has a pink `#FFBFBF` background and a `gap: 1px`, and each cell has a white background. The 1px gaps therefore show up as pink lines. Each section also has a 1px pink bottom border, so sections stack like rows in a table. The header and the announcement bar have a 1px pink bottom line too.
- **Corners:**
  - Images: **20px** (`--media-border-radius`, `--grid-media-border-radius`). That includes the hero, product images and the About page images.
  - Thumbnails: 10px.
  - Buttons, pills, badges: 9999px (fully round).
  - Sections, cells, header, inputs: square (0).
- **The hero looks rounded because the image sits inside a square cell with padding.** The cell has 14px padding on desktop and 7px on mobile, and the image inside has 20px corners. The section itself has square corners and runs edge to edge.

### 2.5 Spacing and layout
- **The spacing rhythm is 3.5 / 7 / 14 / 28 / 56 px** (0.25 / 0.5 / 1 / 2 / 4 rem).
- **Page side padding** (`--section-horizontal-spacing`): **7px** on mobile and **14px** from 1024px.
- **Container:** there is no max-width. Sections fill the viewport (`--wrapperWidth: 100vw`), and text blocks are narrowed with fractions instead:
  - Feature text: 75% wide on desktop.
  - About page text: 50%.
  - Rich text has Width options Full / Two thirds / Half [from documentation].
- **Grid:** 12 columns on desktop with 1px gutters (12 × 105.75px + 11 × 1px = 1280px). On mobile, content sections use 1 column and product grids 2.
  - Image with text: image 8/12 + text 4/12.
  - About "Image split": 6/12 + 6/12.
  - Contact page: 2 equal columns.
  - Footer: 5 columns.
- **Section title row:** 28px padding above, 14px below and 14px at the sides. It holds a subheading with a dot, then the heading, then an optional "VIEW ALL →" link, all centred. A 1px line separates it from the content below.
- **Cells:** 14px padding (`py-section-vertical-spacing`). Images have 14px padding from the cell edge (7px on mobile).
- **Fixed heights:**
  - Announcement bar: 32px.
  - Header: 56px desktop, 69px mobile. The logo is centred, the nav sits left and Search/Cart sit right.
  - Breadcrumbs: 32px.
  - Scrolling text strip: 32px.
- **Hero** (Image with scrolling text): 16:9 on desktop (1280×720) and 4:5 on mobile (375×469). The demo image is 3000×1999.
- **Breakpoint:** 1024px ("lg"). The CSS also has 768px ("md") rules, but the main layout switch happens at 1024px.

### 2.6 Buttons and links (including hover)
- **Button:**
  - Space Mono 14px, UPPERCASE, line-height 1.2.
  - Padding 7px 28px, 1px border, fully round corners.
  - About 33px tall.
  - An arrow is added after the label: `content: "\00a0\2192"` ("READ NOW →"). The theme adds the arrow itself, so you don't type it.
- **Text link** ("VIEW ALL →", "READ MORE →", "SUBSCRIBE →"):
  - 14px UPPERCASE.
  - 1px underline drawn as a bottom border, with 3.5px space under the text.
  - The same arrow after the label. A "back" variant puts "← " before the label.
- **Hover rules, from `base.bundle.css`:**
  - Primary button: background and border change to the accent colour, and the text changes to the accent-contrast colour.
  - Secondary button: border and text change to the accent colour, and the background stays transparent.
  - Text links: the text changes to the accent colour.
- **What hover looks like in Press:** the accent colour equals the text colour (both #FF2E00), so **hover causes no visible colour change**. I checked this with a real mouse-over in headless Chrome: the "All coffee" pill, "VIEW ALL" and the filled button were unchanged. There are no transitions either (`transition: all 0s`).
- **The visible hover effects in Press are:**
  - In **Collection links**, hovering one link fades the others to 40% opacity. Measured: the parent changes to `rgba(255,46,0,0.4)`.
  - **Images zoom to 1.05×** over 300ms with `cubic-bezier(0.455, 0.03, 0.515, 0.955)`.
  - **Scrolling text pauses** on hover.
  - Product cards swap to a second image.
- **Form fields:** text and email inputs have only a 1px bottom line in the text colour and a transparent background. The textarea has a full 1px border, 7px padding and 11.2px text. The labels sit above the fields in 14px type.

### 2.7 How sections are separated
- Sections are separated by **lines, not by white space**. Every section has a 1px pink bottom border, and there is no margin between sections.
- Inside a section, content is split into **grid cells by 1px pink lines**. This applies to product grids, image + text and the footer columns.
- Edge-to-edge **scrolling text strips** (32px tall, 14px text, or large serif text in the hero) work as dividers between blocks.
- The footer runs in this order:
  - a newsletter row: big "Join the club" heading on the left, an underlined email field and "SUBSCRIBE →" on the right;
  - a 5-column grid with lines (logo, text, two menus, social icons);
  - a copyright row in 11.2px;
  - a full-width "hero logo" wordmark image.

### 2.8 Inner pages I looked at
- **About** (`/pages/about-us`):
  - A centred text block 50% wide: h1 at 66.75px, then body paragraphs with 14px between them.
  - Below it, an **Image split** section: two 4:5 images side by side, separated by a 1px line, with 20px image corners.
- **Contact** (`/pages/contact`): two columns separated by a line. On the left, a centred h1 "Drop us a line" and some text. On the right, the form, with Name and Email side by side, then Phone, Message and a full-width red pill "SEND" button.
- **Collection** (`/collections/all`): a breadcrumb row, a centred h1 with a superscript count, a row of uppercase filter links, a "FILTER +" / "SORT +" row, then a 3-column product grid with lines (4/12 cells), 20px image corners, and product name and price in 14px mono below each image.

### 2.9 Screenshots (for later comparison)
- `placeholder/qa/screenshots/press-demo-1280.png` (1280 × 8672). I captured it in 1500px strips and stitched them together, because the helper's single full-page capture hung on this page. Every lazy-loaded image is rendered.
- `placeholder/qa/screenshots/press-demo-375.png` (375 × 11893). Mobile emulation, captured at 1× pixel ratio, because the 2× capture hung.

---

## 3. Fonts and licensing

| Font | Role | How the demo loads it | Licence | Free outside Shopify? |
|---|---|---|---|---|
| **Instrument Serif** (400, regular and italic exist) | headings | Shopify font library: `/cdn/fonts/instrument_serif/instrumentserif_n4.*.woff2` | SIL Open Font License (Google Fonts METADATA: `license: "OFL"`, designers Rodrigo Fuenzalida and Jordan Egstad) | **Yes** |
| **Space Mono** (400, 700, plus italics) | body, labels, buttons | Shopify font library: `/cdn/fonts/space_mono/spacemono_n4.*.woff2` etc. | SIL Open Font License (Google Fonts METADATA: `license: "OFL"`, designer Colophon Foundry) | **Yes** |

- The demo loads both fonts from **Shopify's font library** (the `/cdn/fonts/...` path, which is Shopify's font CDN). They are not Shopify-only fonts, though. Both are also published on Google Fonts. I checked `fonts.googleapis.com/css2?family=Instrument+Serif` and `...family=Space+Mono`, which return the same weights.
- **No substitute fonts are needed** for the standalone HTML version.
- Danish **æ ø å Æ Ø Å** are covered: both fonts' Latin subset spans U+0000–00FF.
- **For the standalone (Vercel) version, I recommend self-hosting the two `.woff2` files** instead of linking to fonts.googleapis.com. The OFL licence allows it, and it avoids sending visitors' IP addresses to Google, which is a known GDPR issue in the EU. Downloading the font files needs Søren's OK first.
- **Fallback stacks** (already in tokens.css):
  - `"Instrument Serif", "Times New Roman", Times, serif`
  - `"Space Mono", ui-monospace, Menlo, Consolas, monospace`

---

## 4. Section list (without theme files)

Notes on the table:
- **Editor names** are the names Switch's documentation uses. The live editor may differ slightly.
  - Example: the documentation page is called "Image split", but its instructions say "expand the **Media split** section menu", and the demo's section handle is `media_split`.
- **"Password page?"** is my estimate. It is based on each section's documentation note (section 6). Every "Probably yes" is **[unverified]** until the `{% schema %}` has been checked.
- **"Demos"** shows where I saw the section. P = Press, B = Baseline, A = Austere, Br = Brutalist, C = Courier.

### 4.1 Sections most relevant to the placeholder

| Editor name | What it does / blocks | Source | Demos | Password page? |
|---|---|---|---|---|
| **Password - content** (`main-password`) | Only for the password page. Settings: logo image, logo width 20–450px, heading, newsletter signup on/off (form heading, placeholder, button text), social sharing buttons, custom CSS. It also holds the "enter store password" form (seen in a 2022 community copy of the code). | from documentation; a community thread shows the settings in `password.json` | none: the demo `/password` redirects to the home page | **Yes. It is the built-in section** |
| **Image with scrolling text** (the Press hero) | An image with large scrolling serif text laid over it. Settings: image (≥3600×1600 landscape recommended), mobile image (≥1600×2400 portrait), desktop/mobile height (Natural, Full screen, 3/4…), text, link, font size scale, scroll speed/direction, separator, colour scheme. No blocks. | seen in demo + from documentation | P | **Probably yes**. Docs: "any page except Checkout, Gift card, and Customer pages" |
| **Image with text overlay** | An image with subheading, heading, text and a button on top. Settings: image, mobile image, desktop/mobile height, content position, width, colour scheme, call to action (link or button, primary/secondary). | seen in demo + from documentation | C | **Probably yes** (docs: any page except Checkout and Gift card) |
| **Image with text** | Image and text side by side (8/12 + 4/12 in Press). Settings: image, image position/size/crop, "fit image to text", subheading, heading, text, font, size, alignment, colour scheme, call to action. | seen in demo + from documentation | P, B, C | **Probably yes** |
| **Image split** / "Media split" | Two images side by side. Blocks: Image (image, deep inset, link, caption, caption position, colour scheme) or Video. A square image ≥4000×4000 is recommended. | seen in demo (About page) + from documentation | P, B, C | **Probably yes** |
| **Rich text** | Subheading, heading, text (with links), alignment, "add space above", call to action (link or button), desktop width (Full, Two thirds, Half) and position, colour scheme. No blocks. | from documentation | none | **Probably yes** |
| **Feature text** | A large centred serif paragraph with a subheading ("• ABOUT US"). Settings: subheading, text, mobile/desktop font size scale, font, alignment, "add space above", call to action, desktop width/position, colour scheme. | seen in demo + from documentation | P, B, C | **Probably yes** |
| **Text columns** | Heading and text split into 2, 3 or 4 columns on desktop. Settings: heading, text, columns, alignment, desktop text size S–2XL, colour scheme. The docs list no blocks: the columns come from one text field. | from documentation | none | **Probably yes** |
| **Text columns with images** | Up to several "Column" blocks (3 by default), each with show image, image, heading, text and link. Section settings: crop (none, landscape, square, portrait), alignment, subheading, heading, colour scheme. | from documentation | none | **Probably yes** |
| **Text split** | Two "Text" blocks side by side, each with subheading, heading, text, font, size, alignment, position, call to action and its own colour scheme. | from documentation | none | **Probably yes** |
| **Logo list** | Logo blocks (5 by default), each with an image and a link. Settings: logo max width 20–800px, alignment, display **Scrolling or Static**, speed and direction, subheading, heading, colour scheme. | seen in demo + from documentation | B ("As seen in"), Br, C | **Probably yes** |
| **Newsletter** | An email signup form. Settings: subheading, heading, heading size, text, text size, vertical form alignment, colour scheme. | from documentation (a newsletter row also appears in the demo footer) | (footer) | **Probably yes**. Docs: "Template and Footer areas of any page, except Checkout and Gift card" |
| **Scrolling text** | A running text strip. Settings: text, link, font size scale, font, speed and direction, separator (gap, character or button), HTML tag, colour scheme. | seen in demo + from documentation | P, B, Br, C | **Probably yes**. A 2022 Baseline store had "marquee" sections in its `password.json` (see section 6) |
| **Custom liquid** | Subheading, heading, text, and a Custom Liquid code box. This is the **last resort** for anything the theme can't do (for example a map). | from documentation | none | **Probably yes** |
| **FAQ** / **Collapsible rows** | Question/answer blocks that open and close. FAQ has 8 question blocks by default, with an optional 2-column layout. | seen in demo (`/pages/faq`) + from documentation | P | **Probably yes** |
| **White space** | An empty spacer with a height setting and an option to "hide bottom border of section above". | from documentation | none | **Probably yes** |
| **Slideshow** | Image slides with text and a call to action. Images ≥3600×1600 landscape, mobile ≥1600×2400. | from documentation | none | **Probably yes** |
| **Testimonials** | Quote blocks (quote and source), quotes per row, optional grid border. | seen in demo + from documentation | B, C | **Probably yes**, but we have no sourced quotes |

### 4.2 Commerce and other content sections (probably not needed for the placeholder)

All of these are **[from documentation]**. The documentation says they can be added to any page except Checkout and Gift card, so **"probably yes" technically** for the password page. The store has no products to show yet, though.

- Product and collection sections, with the demos they appear in:
  - Collection links: P
  - Collection carousel: P, B, A, Br, C
  - Collection list: P, Br, C
  - Featured collection: P
  - Featured collection table: P
  - Featured product: P, A, C
  - Scrolling product links: P, B, C
  - Product links: C
  - Product links with image: Br
  - Product list
  - Image with product grid
  - Shop the look
  - Recently viewed products
- Content and media sections, with the demos they appear in:
  - Blog posts: P, C
  - Text and image carousel: P, A, Br
  - Featured menu: B, A, Br
  - Featured menu buttons
  - Featured menu over image
  - Single level menu
  - Menu with image
  - Directory
  - Custom links (also over image, over video, with image, with video)
  - Countdown timer variants: B, A, Br
  - Video, Video with text, Video with text overlay (Br), Video split, Video and image split

### 4.3 Sections that are not available or not useful on the password page

| Name | Why | Source |
|---|---|---|
| Header, Footer, Announcement bar, Hero logo, Menu drawer, Promo popup, Age check | Static sections. "All templates except the Checkout, **Password**, and Gift card templates include the static sections." **So the password page has no header and no footer.** Logo, contact details and the like must be built from template sections. | from documentation |
| Breadcrumbs | The documentation excludes Password pages from the Header, Footer and Overlay areas. Not useful anyway. | from documentation |
| Free shipping bar | The documentation excludes Password pages. | from documentation |
| **Pages - contact** (the contact form) | A template section that only works on the Contact page template, so **no contact form on the password page.** Use text with the phone number and email instead. | from documentation; seen in demo (`/pages/contact`) |
| **Map** | **No map section exists** in the documentation list or in any demo. (`/sections/content/map` and `contact-form` return 404 on the docs site.) Options: (a) a normal text link "Find vej" to a map service in Rich text (no custom code), or (b) an embedded map in Custom liquid. Option (b) is custom code, and a Google Maps iframe sets cookies and needs consent under EU rules. | from documentation (absence) |

### 4.4 Suggestion: password page built only from theme sections (for the wireframe agent, [unverified])
1. **Password - content**: logo, short heading, newsletter signup. The password form stays here.
2. **Image with scrolling text** (the Press hero): facade photo with scrolling Danish text. A fallback is **Image with text overlay**.
3. **Feature text**: one calm sentence about the shop.
4. **Text split** or **Text columns**: address / phone / opening hours `[MANGLER]` in one block, workshop services in the other.
5. **Logo list** (Static): Specialized and other brands. Use official logos only, in one colour.
6. **Scrolling text** strip as a divider, if wanted.
7. Only if needed, **Custom liquid**, for a map embed. A plain link in Rich text is better.

---

## 5. Photo size for the real hero photo
- The Press hero is **16:9 on desktop** and **cropped to 4:5 on mobile**, with the same image unless a separate mobile image is set.
- Switch recommends **at least 3600 × 1600 px landscape** for overlay, hero and slideshow images, and **1600 × 2400 portrait** for a separate mobile image.
- **My advice for the real facade photo:** landscape, daylight, **at least 2400 px wide, ideally 3600 × 2025 (16:9)**. Keep the wordmark and door inside the centre third, so the 4:5 mobile crop still shows them. Otherwise also supply a portrait mobile version (1600 × 2000 or larger).
- The temporary photo (515 × 388) is far too small for a full-width hero. Use it only for layout.

---

## 6. Password page: can it hold more than the built-in section?

**Conclusion: probably yes. I'm about 80% sure. Not yet checked in the code.**

Evidence for:
1. **Switch documentation, Sections overview:** "The content sections described in the following table can be added to or removed from any page, **except the Checkout and Gift card pages**." Password is not excluded. [from documentation]
2. **Each section's own documentation page** repeats this. That includes Rich text, Text columns, Text columns with images, Text split, Logo list, Image with text, Image with text overlay, Image split, Feature text, Custom liquid, FAQ, Collapsible rows, Scrolling text, Slideshow, Testimonials and White space. They all say "The section can be added to any page, except Checkout and Gift card pages."
   - Image with scrolling text also excludes Customer pages.
   - Newsletter says Template and Footer areas.
   - [from documentation]
3. **Where the documentation does exclude Password, it says so by name** (Breadcrumbs, Free shipping bar, static sections). That makes the content section notes more believable. [from documentation]
4. **Real store, 2022:** a Shopify Community thread about a Baseline password page quotes that store's `templates/password.json`. Besides `"main": {"type": "main-password", …}` it contains several `"type": "marquee"` sections (the old name for Scrolling text). So content sections were placed on the password template, at least in that older Baseline version. Two caveats: that store also used a PageFly layout, and the version is old. [seen in a community post, older version]
5. **Shopify Help** (password page): you can "Add other sections and blocks to your password page." This is generic, for all Online Store 2.0 themes. [from documentation]

Why only about 80%:
- I haven't seen any section's `{% schema %}`. A section is blocked on the password page if its schema has `"disabled_on": {"templates": ["password"]}` or an `enabled_on` list without "password", or the older `"templates": [...]` key.
- A section also only shows up under "Add section" if its schema has a `presets` entry.
- The demo store's `/password` returns **HTTP 302 → home page** because the demo isn't password-protected. So I couldn't see a live Baseline password page, and couldn't measure one.
- Version difference: the demo runs 5.0.0, while the store version is 5.4.0.

If it turns out to be **no**, the fallback order is:
- (a) use the Password - content section only, plus theme settings;
- (b) put the extra content in a **Custom liquid** section, if that one is allowed;
- (c) as a last resort, edit `templates/password.json` / `layout/password.liquid` directly. That is custom code, so check with Søren first.

---

## 7. Check when the theme files arrive

Download the theme (Online Store → Themes → … → Download theme file, or a duplicate via Shopify CLI). Then check these files, in this order:

1. **`templates/password.json`**: which sections are on the password page now, their order and their settings. Does it list anything besides `main`?
2. **`layout/password.liquid`**:
   - Does it load the same CSS as the main layout (`base.bundle.css`, the `:root` variable block, fonts)?
   - Does it render any section groups (`{% sections '…-group' %}`)? Or only `{{ content_for_layout }}`, meaning no header and footer?
   - Is there a separate password "header"/"footer" group?
3. **`sections/main-password.liquid`** (the name may differ, so search for `"Password - content"`):
   - its schema settings (logo, heading, newsletter, share);
   - whether it contains `{% form 'storefront_password' %}`;
   - its `enabled_on: { templates: ["password"] }`.
4. **Every candidate section in `sections/*.liquid`**:
   - rich-text, text-columns, text-columns-with-images, text-split, image-with-text, image-with-text-overlay, image-with-scrolling-text, media-split/image-split, feature-text, logo-list, newsletter, scrolling-text, custom-liquid, white-space, faq;
   - for each, read the `{% schema %}` at the bottom and look for **`enabled_on`, `disabled_on` or `templates`**, and check that it has **`presets`**.
   - Quick search: `grep -l "disabled_on\|enabled_on\|\"templates\"" sections/*.liquid`.
5. **`config/settings_data.json`**:
   - the real preset values for Søren's store: colour schemes, `type_header_font` / `type_body_font`, base font size, gridline width/colour, button radius, media radius, button arrow;
   - compare them with `design/tokens.css`.
6. **`config/settings_schema.json`**:
   - the `theme_info` version (5.0.0 on the demo, 5.4.0 on the theme store);
   - which settings exist (for example a button-style choice or a media radius slider).
7. **`snippets/` that write the `:root` variables** (search for `--gridline-width`): confirms the token names and the mobile/desktop values.
8. **`sections/header-group.json`, `sections/footer-group.json`**: check that the password template really leaves them out.
9. **`locales/da.json`** (and `da.schema.json`):
   - does the theme ship Danish texts?
   - The password page shows theme strings such as "Enter using password"; check whether they are in Danish.
10. **`assets/base.bundle.css`**: only if something above surprises us. Checks the gridline method, hover rules and the 1024px breakpoint.

---

## 8. What I could not measure
- **A live Baseline password page.** The demo redirects `/password` to the home page, and I know of no public password-protected Baseline store.
- **Hover colours in other colour schemes.** In Press scheme 1 the hover colour equals the normal colour, so there was nothing to see.
- **Exact editor labels.** The names come from the documentation, not from the editor.
- **Differences between theme v5.0.0 (demo) and v5.4.0 (current).** I couldn't find release notes for 5.4.0.
- **Section schemas** (`enabled_on`/`disabled_on`, `presets`), because there are no theme files.
- **Rich text, Text columns, Text columns with images, Text split, Newsletter section, Custom liquid, White space.** None of these appear in any demo I opened, so I couldn't measure their exact spacing. I expect them to use the same 14px/28px rhythm and 1px lines as the other sections, but that is unverified.

---

## 9. Sources
- Press demo: https://baseline-preset-coffee.myshopify.com/ (home, /pages/about-us, /pages/contact, /pages/faq, /pages/brew-guides, /pages/coffee-list, /collections/all, /blogs/news, /password → 302)
- Other presets: https://baseline-preset-modern-2.myshopify.com, https://baseline-theme-minimal.myshopify.com, https://baseline-theme-bold.myshopify.com, https://baseline-preset-courier.myshopify.com/
- Theme CSS: `/cdn/shop/t/23/assets/base.bundle.css` on the Press demo
- Theme store: https://themes.shopify.com/themes/baseline/presets/press (version 5.4.0, 4 Aug 2026; presets Press, Baseline, Austere, Brutalist, Courier)
- Switch docs:
  - https://help.switchthemes.co/baseline/sections/sections-overview
  - https://help.switchthemes.co/baseline/sections/template/password-content
  - section pages under https://help.switchthemes.co/baseline/sections/content/ (rich-text, text-columns, text-columns-with-images, text-split, logo-list, newsletter, custom-liquid, image-with-text, image-with-text-overlay, image-with-scrolling-text, image-split, feature-text, scrolling-text, slideshow, testimonials, faq, collapsible-rows, white-space, featured-menu)
- Shopify Community, Baseline password page and `password.json` (2022): https://community.shopify.com/t/how-to-change-password-page-background-on-baseline-theme/116332
- Shopify Help, password page: https://help.shopify.com/manual/using-themes/password-page
- Shopify changelog, `enabled_on`/`disabled_on`: https://shopify.dev/changelog/introducing-new-enabled_on-disabled_on-section-schema-attributes-deprecating-templates
- Font licences: https://github.com/google/fonts/blob/main/ofl/instrumentserif/METADATA.pb and https://github.com/google/fonts/blob/main/ofl/spacemono/METADATA.pb
