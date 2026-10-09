# Byman Cykler: how to put the temporary front page live

Written by A10 on 2026-10-09 for Søren. Simple English, with the Danish menu names in brackets.

> **Read this first**
> 1. **Main path (your choice): the standalone page** from `placeholder/build/` goes on Vercel at **https://www.byman-cykler.dk/**. The alternative, building it on the Shopify password page, is kept further down, with its code ready.
> 2. **Until launch, your domain points to Vercel.** On launch day you point it back to Shopify and switch the store password off.
> 3. The Vercel, One.com and Shopify domain steps follow their help pages (checked 2026-10-09). The Shopify alternative is based on the demo store and the help pages, **not yet on your theme files**. Anything that might look different is tagged *(ikke bekræftet)*.
> 4. Time: **about 1 hour of clicking for the Vercel path**, plus waiting for the domain to switch (minutes, sometimes a few hours). The Shopify alternative takes about 2 hours.
> 5. **Nothing has been committed, pushed or changed yet.** You do the clicks in Vercel, Shopify and One.com. Claude does the build and the push, and only after your OK.

**Tags used in this guide**

- *(fra dokumentation)*: the official help pages say so.
- *(set i demo)*: seen working on a Baseline demo store.
- *(ikke bekræftet)*: my best guess. Check it as you go.

**About the Danish names:** they are my best match. Shopify and One.com sometimes word them a little differently. If you can't find a name, look for the English one.

---

## Contents

- [Words you'll meet](#words-youll-meet)
- [Main path: the standalone page on Vercel](#main-path-the-standalone-page-on-vercel)
  - [Who does what](#who-does-what)
  - [Step 1. Look at the page on your Mac](#step-1-look-at-the-page-on-your-mac)
  - [Step 2. Put the files on GitHub (Claude, after your OK)](#step-2-put-the-files-on-github-claude-after-your-ok)
  - [Step 3. Create the new Vercel project](#step-3-create-the-new-vercel-project)
  - [Step 4. Add your domain in Vercel](#step-4-add-your-domain-in-vercel)
  - [Step 5. Write down today's DNS values](#step-5-write-down-todays-dns-values)
  - [Step 6. In Shopify, make the myshopify.com address primary](#step-6-in-shopify-make-the-myshopifycom-address-primary)
  - [Step 7. Change the DNS at One.com](#step-7-change-the-dns-at-onecom)
  - [Step 8. Wait, then check](#step-8-wait-then-check)
  - [Step 9. Turn on visitor statistics (Vercel Web Analytics)](#step-9-turn-on-visitor-statistics-vercel-web-analytics)
  - [If something goes wrong: the rollback](#if-something-goes-wrong-the-rollback)
  - [Launch day: give the domain back to Shopify](#launch-day-give-the-domain-back-to-shopify)
- [The two paths compared, in plain words](#the-two-paths-compared-in-plain-words)
- [Maintenance](#maintenance)
- [Checklist before going live](#checklist-before-going-live)
- [Alternative (not chosen now): the Shopify password page](#alternative-not-chosen-now-the-shopify-password-page)
- [When the theme files arrive](#when-the-theme-files-arrive)
- [Sources](#sources)

---

## Words you'll meet

| Word | What it means |
|---|---|
| **Vercel** | The service that puts web pages online. Your scanner app already runs there. |
| **Vercel project** | One website on Vercel. You'll make a **new** one for the front page; the scanner project stays as it is. |
| **GitHub, repo** | GitHub stores your project folder online. That stored folder is the **repo** (`hellosorenanker/byman-cykler`). It's **public**: anyone can read it. |
| **Commit, push** | A **commit** saves a set of changes. A **push** uploads it to GitHub. Every push to `main` makes Vercel update your sites. |
| **Domain** | Your web address: `byman-cykler.dk`. The **apex** is the bare name `byman-cykler.dk`. **www** is `www.byman-cykler.dk`. |
| **DNS** | The internet's address book. It says which computer answers for your domain. Yours is kept at **One.com**. |
| **A record** | An address-book entry that points a name to a number (an IP address). It's used for the apex. |
| **CNAME record** | An address-book entry that points a name to another name. It's used for www. |
| **Terminal** | The Mac app for typing commands: press ⌘Space, type `Terminal`, press Enter. |
| **Build** | Running `placeholder/build.mjs`, which turns the data files into the finished page in `placeholder/build/`. |

---

## Main path: the standalone page on Vercel

The finished page is in `placeholder/build/`: plain HTML, CSS, JavaScript, images and the **real Press fonts** (Instrument Serif and Space Mono, stored in `build/fonts/`). It makes **no requests to other sites**, so there are no cookies and no consent banner. It already knows its final address, `https://www.byman-cykler.dk/` (`PAGE_URL` in `build.mjs`), so Google and Facebook get the right links.

**The plan in one picture:**

```
Today:        www.byman-cykler.dk  ──►  Shopify (password page)
Until launch: www.byman-cykler.dk  ──►  Vercel (the new front page)    Shopify keeps working at byman-cykler.myshopify.com
Launch day:   www.byman-cykler.dk  ──►  Shopify (the real webshop)
```

### Who does what

| Who | What |
|---|---|
| **You** | Vercel dashboard (Claude can't log in there), Shopify domain settings, One.com DNS settings |
| **Claude** | Building the page, checking it, and the git commit and push. **Only after you say OK.** |

### Step 1. Look at the page on your Mac

About 5 minutes.

1. Ask Claude: "start the placeholder preview".
2. Open **http://localhost:3002/build/** in Safari.
   → The page you saw in the screenshots, with the real fonts.
3. **Test switches.** Add them to the address:
   - `?now=2026-10-11T08:15` pretends it's Sunday morning. → The strip says "○ LUKKET · ÅBNER I MORGEN 09.00".
   - `?special=2026-10-10,closed` pretends there's a closed day.
   - `?nojs=1` shows the page without JavaScript.

   `?now` and `?special` only work on your Mac, never on the live page, so visitors can't change what the page says. `?nojs=1` works anywhere, but only changes your own view.
4. Don't double-click `index.html` to open it from Finder. The logo colouring only works through the preview address.

### Step 2. Put the files on GitHub (Claude, after your OK)

About 5 minutes.

- **⚠️ The repo is public.** Everything that's pushed can be read by anyone on GitHub.
  - In `placeholder/` there are no passwords or keys, but your notes, research, `PROMPT.md` and screenshots would become public too.
  - Decide with Claude what goes in. `placeholder/build/` is the part the new Vercel project needs. The data files, `build.mjs`, `assets/` and `design/` are needed to rebuild the page later.
- **⚠️ The scanner project updates too.** Every push to `main` makes **both** Vercel projects update. The old project (`byman-cykler.vercel.app`) shows every folder as it is, so the page will **also** appear at `https://byman-cykler.vercel.app/placeholder/build/`. That's harmless: the page tells Google its real address is www.byman-cykler.dk.
- **Never pushed:** `kollektioner.md`, `sider.md`, `sider-juridisk.md`, `metafelter.md`, and later `placeholder/theme-export/` (paid theme code).

**What you say to Claude:** "commit and push the placeholder page".
→ Claude shows you exactly which files will go in, waits for your OK, then pushes.
→ A minute later the scanner project has updated. That's expected.

### Step 3. Create the new Vercel project

About 10 minutes, all done by you. *(fra dokumentation)*

1. Go to **vercel.com** and log in.
2. Click **Add New… → Project**.
3. Find the repo `hellosorenanker/byman-cykler` and click **Import**.
4. **Project Name:** for example `byman-forside`.
5. **Root Directory:** click **Edit** and choose **`placeholder/build`**. (The root directory is the folder Vercel treats as the whole website.) This project then only sees that folder, so your notes and research aren't served by it.
6. **Framework Preset:** **Other**.
7. **Build Command:** switch **Override** on and leave the field **empty**. The page is already built on your Mac and pushed. **Output Directory:** leave it as it is.
8. Click **Deploy**.
   → After a minute you get an address like `https://byman-forside.vercel.app/`.
9. Open that address.
   → The front page, at the root of the address.
   → The old scanner project at `byman-cykler.vercel.app` is unchanged.

**Optional: only redeploy when the page changes.** Without this, the new project also redeploys when you change the scanner app. It doesn't hurt, it's just unnecessary. *(fra dokumentation)*

1. In the new project, go to **Settings → Build and Deployment → Ignored Build Step**.
2. Choose **Custom** and paste:

   ```
   git diff HEAD^ HEAD --quiet -- .
   ```

   This means "skip the deploy if nothing changed in `placeholder/build` in the latest commit". Vercel runs it inside the root directory. (The menu also offers "Only build if there are changes in a folder", which does the same thing by clicking.)
3. Click **Save**.

The catch: it only compares the **latest** commit. If several commits are pushed together and the last one doesn't touch `placeholder/build`, the deploy is skipped. Fix it like this:

1. Go to **Deployments**, click **⋯** on the newest one, then **Redeploy**.
2. Untick **Use project's Ignore Build Step**.

Skipped deploys still count towards Vercel's daily deploy limit.

### Step 4. Add your domain in Vercel

About 5 minutes. **Nothing changes for visitors yet.** *(fra dokumentation)*

1. In the new project, go to **Settings → Domains**.
2. Click **Add Domain** and type `www.byman-cykler.dk`. Click **Add**.
3. Also add `byman-cykler.dk`. Vercel usually suggests it by itself.
4. Make **www the main address**: on `byman-cykler.dk` click **Edit**, and under **Redirect to** choose `www.byman-cykler.dk`. **Save**. Vercel recommends www as the primary address.
   → Both domains are listed, probably with a red **"Invalid Configuration"**. That's normal: DNS still points to Shopify.
5. **Write down the values Vercel shows for each domain.** Click a domain to see them:

| Domain | Record type | Commonly documented value | **Use exactly what your screen shows** |
|---|---|---|---|
| `byman-cykler.dk` | **A** | `76.76.21.21`. Newer projects may get another address, for example `216.198.79.1` | __________ |
| `www.byman-cykler.dk` | **CNAME** | A project-specific name like `d1d4fc829fe7bc7c.vercel-dns-017.com`. Older guides say `cname.vercel-dns.com` | __________ |

If Vercel asks for a **TXT** record to prove the domain is yours, write that down too. You'll add it at One.com in Step 7.

### Step 5. Write down today's DNS values

These are your way back. They were checked in public DNS on 2026-10-09.

| Name | Type | Value today | What it does |
|---|---|---|---|
| `byman-cykler.dk` | A | `23.227.38.65` | Points to Shopify |
| `www.byman-cykler.dk` | CNAME | `shops.myshopify.com` | Points to Shopify |
| Name servers | NS | `ns01.one.com`, `ns02.one.com` | DNS is kept at One.com. **Don't change these.** |
| Email | MX | **none** | Your email is Gmail (`bymancykler@gmail.com`), so it isn't affected |
| Others | AAAA, TXT, CAA | **none** | Nothing else to worry about |

Shopify's own help page confirms these two Shopify values: A `23.227.38.65` and CNAME www `shops.myshopify.com`. *(fra dokumentation)*

**Before Step 7, also take a screenshot** of the DNS list at One.com.

### Step 6. In Shopify, make the myshopify.com address primary

About 2 minutes. **Do this before changing DNS.**

**Why:** Shopify sends every address of the store to its **primary domain**. *(fra dokumentation)* If the primary stays `www.byman-cykler.dk`, then after the switch Shopify may send visitors, and you, from `byman-cykler.myshopify.com` over to the Vercel page. You'd lose your way into the store's front end. The admin at admin.shopify.com isn't affected.

1. In the Shopify admin, go to **Settings → Domains (Indstillinger → Domæner)**.
2. Click **`byman-cykler.myshopify.com`**.
3. In the **Type** row, click **Change (Skift)**, choose **Primary domain (Primært domæne)**, and click **Change domain type**. *(fra dokumentation)*
   → The Domains list shows `byman-cykler.myshopify.com` as **Primary**.

Whether Shopify allows the myshopify.com address as primary is *(ikke bekræftet)*. If it doesn't, stop here and tell Claude before Step 7. **Leave `byman-cykler.dk` in the Shopify list.** Don't remove it, so it's easy to reconnect on launch day.

### Step 7. Change the DNS at One.com

About 10 minutes.

1. Log in at **one.com** and open the **Control Panel (Kontrolpanel)**.
2. On the **Advanced settings (Avancerede indstillinger)** tile, click **DNS settings (DNS-indstillinger)**, then **DNS records (DNS-poster)**. *(fra dokumentation, from One.com's help pages; the exact labels are ikke bekræftet)*
   → You see a list that includes the A record `23.227.38.65` and the CNAME `www` → `shops.myshopify.com`.
3. **The apex A record:** find the A record whose hostname is `@` or empty, with value `23.227.38.65`. Change the value to **Vercel's A value** from Step 4, and save.
   - If One.com doesn't let you edit it, delete it and create a new A record: hostname `@` or empty, pointing to Vercel's value.
   - Shopify's help also says to remove any other A records on the domain. There are none today.
4. **The www CNAME:** find the CNAME with hostname `www`, pointing to `shops.myshopify.com`. Change it to **Vercel's CNAME value** from Step 4, and save.
5. **TTL** (how long other computers may remember the old value): leave One.com's default, 3600 seconds = 1 hour.
6. **If Vercel asked for a TXT record,** create it: type **TXT**, with the name and value Vercel showed.
7. **Change nothing else.** Don't touch the name servers.

### Step 8. Wait, then check

1. In Vercel, go to **Settings → Domains** and wait until both domains show **Valid Configuration**.
   - It usually takes minutes, sometimes hours.
   - One.com says it can take up to 24 hours, and Shopify's help says up to 48 hours.
   - Vercel then gets a free HTTPS certificate (the padlock) by itself. Nothing in your DNS blocks that (there's no CAA record).
2. **Check on your computer**, in a private window (Safari: **File → New Private Window**):
   - [ ] `https://www.byman-cykler.dk/` shows the new page, with the padlock.
   - [ ] `byman-cykler.dk` (without www) jumps to `https://www.byman-cykler.dk/`.
   - [ ] `http://www.byman-cykler.dk` jumps to `https://`.
   - [ ] `https://byman-cykler.myshopify.com` still shows **Shopify's password page**. Your store is safe and still closed.
3. **Check on your phone**, on mobile data rather than Wi-Fi, because Wi-Fi can remember the old address for a while:
   - the status strip;
   - **Ring til os** opens the Phone app;
   - **Find vej** opens Maps;
   - **Skriv til os** opens Mail;
   - the hours table, the logos and the moving name.
4. **Check Google later:** your Google Business Profile's website link (`byman-cykler.dk`) now lands on the new page.

### Step 9. Turn on visitor statistics (Vercel Web Analytics)

The page already contains the counting script. It only starts counting once you switch it on in Vercel:

1. In Vercel, open the **new** project (the one with root directory `placeholder/build`) → **Analytics** in the left menu → **Enable**.
2. Make one new deployment so Vercel adds the counting addresses. Either go to **Deployments → ⋯ → Redeploy** on the latest one, or ask Claude to push any small change.
3. Open https://www.byman-cykler.dk on your phone, then look at **Analytics** in Vercel. Visits show up within a few minutes.

Good to know:
- **No cookies:** Vercel counts anonymously and keeps no cookies or IDs on visitors' devices, so the page still needs no cookie banner. Vercel describes this in its privacy notes: https://vercel.com/docs/analytics/privacy-policy
- **Free plan:** 50,000 page views a month are included. If that's ever exceeded, counting pauses, and nothing is charged. You can see one month back. https://vercel.com/docs/analytics/limits-and-pricing
- **Your Mac preview never counts:** the script only loads on the live site.
- **Turning it off:** click **Disable** under Analytics in Vercel. To remove the script as well, set `VERCEL_ANALYTICS_SCRIPT = null` in `build.mjs` and rebuild.

### If something goes wrong: the rollback

Put the old values back. Visitors then see the Shopify password page again within about an hour.

1. At **One.com → DNS records**:
   - set the apex **A** record back to `23.227.38.65`;
   - set the **CNAME `www`** back to `shops.myshopify.com`;
   - delete any TXT record you added for Vercel.
2. In **Shopify → Settings → Domains**, make `www.byman-cykler.dk` the **primary** domain again (same steps as Step 6).
3. Optionally, in **Vercel → Settings → Domains**, remove the two domains.

### Launch day: give the domain back to Shopify

When the webshop is ready. About 15 minutes, plus waiting.

1. **One.com → DNS records** *(fra dokumentation: values from Shopify's help page)*:
   - apex **A** record → `23.227.38.65`;
   - **CNAME `www`** → `shops.myshopify.com`;
   - delete any Vercel TXT record.
2. **Shopify → Settings → Domains:**
   1. Check that `byman-cykler.dk` and `www.byman-cykler.dk` show as **connected**. If not, click the domain and check its connection, or remove it and add it again with **Connect existing domain (Forbind eksisterende domæne)**. *(ikke bekræftet: the exact buttons)*
   2. Make **`www.byman-cykler.dk` the primary domain** (click it → **Type → Change → Primary domain**).
3. **Turn the password off:** go to **Online Store → Preferences (Webshop → Præferencer)** and switch off **Password protection (Adgangskodebeskyttelse)**. The newest Shopify wording is **Store access → Private mode**. Shopify asks for a paid plan and a business address before the password can be removed. *(fra dokumentation)*
4. Wait until `https://www.byman-cykler.dk/` shows the webshop. Test it in a private window and on your phone.
5. Optionally, in **Vercel → Settings → Domains**, remove both domains. You can keep the Vercel project for later, or delete it.
6. **Google:** the address stays the same, so nothing has to be cleaned up. Google simply reads the new pages.

---

## The two paths compared, in plain words

| | **Vercel, at www.byman-cykler.dk (chosen)** | **Shopify password page (alternative)** |
|---|---|---|
| **Google** | Google **can show the page** at your real address, with your hours, phone and address built in for search engines. Your Google Business Profile links straight to it. At launch the same address becomes the shop, so there's nothing to clean up. | Shopify hides a password-protected store from Google, so the page itself is never shown. Your Google Business Profile still is, and its link leads to the page. |
| **How hard it is to update** | You edit a data file, rebuild and push. **Claude can do all of it** when you ask. Live about a minute later. | Easy clicking in the theme editor. No Terminal. |
| **Risk that customers reach the unfinished store** | **None** at your address. The shop stays closed with its password at `byman-cykler.myshopify.com`. | Low. Only people with the store password get in. |
| **What changes on launch day** | Three jobs: DNS back to Shopify, make www primary in Shopify, password off. Waiting time: minutes to hours. | One switch: password off. |
| **Risk in the setup** | You edit DNS twice. With the old values written down (Step 5), going back is simple. | No DNS work. |
| **Fonts and look** | The real Press fonts, self-hosted. Includes a pause button on the moving name. | The theme's real fonts. No pause button on the moving name. |
| **Newsletter** | None (your decision: there's no shop behind the page). | Possible, off by default. |

---

## Maintenance

**The routine for every change to the Vercel page:**

1. Change the data.
2. Rebuild **on the Mac**.
3. Check it in the preview (Step 1).
4. Commit and push.

You can simply ask Claude, for example: "Wednesday is now 10–18. Rebuild and push." Claude shows you the change, waits for your OK, and pushes. The page is live about a minute later.

**To rebuild yourself:**

1. Open Terminal.
2. Type `cd ~/Byman-cykler` and press Enter.
3. Type `node placeholder/build.mjs` and press Enter.
   → It prints what it did, for example `photo: 515×388 → contained (cap 772px)`.
   → If something in the data is wrong, it **stops**, leaves the page unchanged, and explains the problem in Danish and English.

The build must run on the Mac, because it uses the Mac's own photo tool for the photo versions.

### Changing opening hours

**Always two places: Google first, then the page.** Also fix the Instagram bio: it still says "Monday - Friday 09:00 - 15:00", which disagrees with Google (`research/data-sources.md`).

1. **Google Business Profile:** search for "Byman Cykler" on Google while you're logged in, then go to **Edit profile → Hours (Rediger profil → Åbningstider)**. *(ikke bekræftet: the labels)*
2. **The page:** in `placeholder/data/business.json`, change `"open"` and `"close"` under `"openingHours"`. Times use a colon; the page shows "10.00" by itself. Example:

   ```json
   { "day": "wednesday", "open": "10:00", "close": "18:00", "closed": false }
   ```

   A closed day is `{ "day": "sunday", "open": null, "close": null, "closed": true }`.
3. Rebuild, check, commit and push.

**Phone, email or address:** they're also in `business.json`. Update Google too.

### Holiday and special hours

In `business.json`, `"specialHours"` is a list. Add one entry per date:

```json
"specialHours": [
  { "date": "2026-12-23", "open": "10:00", "close": "13:00", "closed": false },
  { "date": "2026-12-24", "closed": true, "note": "God jul." }
]
```

- These dates and the "God jul." note are **only examples**. Write your own.
- `date` is year-month-day. `note` is optional: a short Danish sentence.
- Rebuild and push. Dates that have passed are left out at the next build, and the build tells you.

**How they show up:**

- **From 14 days before the date**, a box with a thin red line appears above the hours table.
  - With **one** date it says, for example: "Bemærk: ændrede åbningstider torsdag 24. december: Lukket. God jul."
  - With **several** dates it shows the title "SÆRLIGE ÅBNINGSTIDER" and a small table.
- **On the day itself**, the status strip and today's row use the special hours.

**Also add them to Google:** Google Business Profile → **Hours → Special hours (Særlige åbningstider)** *(ikke bekræftet: the labels)*. Google shows them in Search and Maps.

### Adding a brand

**Only use an official logo file** from the brand's own website, press kit or media kit. Never redraw or stretch a logo. The only allowed change is making it one colour.

1. Put the logo file in `placeholder/assets/logos/`. An SVG with `fill="currentColor"` is best. A white or black PNG with a transparent background is fine.
2. In `placeholder/data/brands.json`, add an entry where it should appear. The order in the file is the order on the page. Put a comma between entries. The required fields are `name`, `slug`, `logo` and `scale`. Here is a filled-in example; "Eksempelmærke" is a **made-up placeholder**, so replace every value:

   ```json
   {
     "name": "Eksempelmærke",
     "slug": "eksempelmaerke",
     "url": "https://www.example.com",
     "category": "Komponenter",
     "logo": "assets/logos/eksempelmaerke.svg",
     "logoSource": "https://www.example.com/press",
     "scale": 1,
     "featured": false,
     "notes": "Where the logo file came from, and any usage rules from the brand."
   }
   ```

   - `slug`: lower-case letters, numbers and hyphens only.
   - `scale`: 1 is normal, and a bigger number gives a bigger logo.
3. Rebuild, check, commit and push.
   → The new logo appears. The "…og mange flere" box always fills the last row. From 12 brands the grid switches to 6 per row on wide screens by itself.

### Swapping in the real photo

1. Put the new photo in `placeholder/assets/img/`. The photo specs are in the checklist below.
2. In `placeholder/build.mjs`, change **one line**: the one that starts with `const PHOTO_FILE`.

   ```js
   const PHOTO_FILE = 'assets/img/your-new-photo.jpg';
   ```

3. In `placeholder/design/copy-da.md`, rewrite `photo.alt` so it describes the **new** photo. It's read aloud to blind visitors.
4. Rebuild **on the Mac**, check, commit and push.
   → A photo of at least 2400 px wide, in landscape, fills the full width by itself.

### Daily check of the hours against Google (built)

Every morning a GitHub job compares the page's hours with Google's. If they differ, you get an email (a GitHub issue), and the page is updated by you or by Claude.

- **Why it doesn't update by itself:** Google's terms don't allow storing its data.
- **Cost:** free in practice, about 30 requests a month.
- **Setup:** about 15 minutes, once. You make a Google key and store it as a GitHub secret.

Step by step: [`guide/HOURS-CHECK.md`](HOURS-CHECK.md).

---

## Checklist before going live

- [ ] Visitor statistics switched on in Vercel (Step 9), and a visit shows up under Analytics.
- [ ] **Swap in the real photo.** The temporary one is low resolution and must be replaced before going live.
  - **The photo:**
    - landscape, in daylight;
    - **at least 2400 px wide, ideally 3600 × 2025 (16:9)**;
    - the BYMAN sign and the door in the middle third;
    - a photo **the shop owns the rights to**: never from Google Maps, Street View or review sites.
  - **Before using it,** remove the location data: open the photo in Preview → **Tools → Show Inspector → (i) → GPS → Remove Location Info**.
  - **Then:** the `PHOTO_FILE` line in `build.mjs`, a new `photo.alt`, rebuild (see [Swapping in the real photo](#swapping-in-the-real-photo)).
- [ ] **Check the hours against Google** on the day you go live (`business.json`).
- [ ] **Confirm the brand intro.** These three claims come from your brief and aren't checked elsewhere:
  - "specialister i Specialized";
  - "landevejscykler og elektroniske gearsystemer";
  - "servicerer cykler på tværs af mærker".
- [ ] **Byman logo file: [MANGLER].** If you get one (SVG best), set `LOGO_FILE` in `build.mjs`, then rebuild.
- [ ] **Test on the Mac** (Step 1), including `?now=` for an open time, a closed time and a Sunday.
- [ ] **No secrets in the repo.** No API keys, passwords or tokens in any file, and never write the Shopify store password into a file. Claude scans before every push.
- [ ] **Only the placeholder files are pushed.** Never `kollektioner.md`, `sider*.md`, `metafelter.md` or `theme-export/`.
- [ ] **The new Vercel project works** at its `….vercel.app` address (Step 3).
- [ ] **The old DNS values are written down** (Step 5), with a screenshot of One.com's list.
- [ ] **Shopify's primary domain is myshopify.com** (Step 6) **before** the DNS change.
- [ ] **After the switch:** padlock, the redirect from without-www, the phone test, and the Shopify store still closed at myshopify.com (Step 8).
- [ ] **Optional:** change the internal Shopify store name "Byman Sport" to "Byman Cykler", for Shopify emails and launch day: **Settings → General → Store details → Store name (Indstillinger → Generelt → Butiksoplysninger → Butiksnavn)**. *(fra dokumentation)* The Vercel page doesn't use it.

---

## Alternative (not chosen now): the Shopify password page

Keep this for later, for example if you'd rather not touch DNS. The code is ready in `placeholder/guide/snippets/`. While the domain points to Vercel, the Shopify password page is only visible at `byman-cykler.myshopify.com`.

**These steps are based on the Press demo store and the Switch Themes and Shopify help pages, not on your theme files.**

### A.1 Check, copy, open

1. **Check that the password is on:** **Online Store → Preferences (Webshop → Præferencer)**. Look for **Password protection (Adgangskodebeskyttelse)**, or in newer wording **Store access → Private mode**. *(fra dokumentation)*
   - The store password lets anyone who has it into the unfinished shop. It isn't your admin password, so keep it private.
2. **"Byman Sport"** is the internal store name and shows in the browser tab of the password page. Changing it is optional (see the checklist).
3. **Make a working copy:** **Online Store → Themes (Webshop → Temaer)** → **⋯** next to Baseline → **Duplicate (Dupliker)**.
   - Build in the copy. The original is your backup.
   - **To undo:** publish the original again (**⋯ → Publish**). *(fra dokumentation)*
   - If Baseline isn't the live theme yet, build in the Baseline draft. A paid theme must be bought before it can be published.
4. **Open the password page:** click **Edit theme (Rediger tema)** on the copy (older admins: **Customize (Tilpas)**). In the menu at the top that says **Home page (Startside)**, choose **Password (Adgangskode)**. *(fra dokumentation)*
   → You'll see the one existing section, **Password - content** (`main-password`), with a logo, heading, newsletter form and the "enter with password" form.
   → There's no header and no footer on the password page.

### A.2 The finished page: 8 sections

| # | What visitors see | Section in the editor | Theme or code? | Why code | Tag |
|---|---|---|---|---|---|
| 1 | Status strip | **Custom liquid** + `1-status-strip.liquid` | **Code** | No announcement bar on the password page, and only a script knows if the shop is open now | *(fra dokumentation)* |
| 2 | Photo with the scrolling name | **Image with scrolling text** | Theme | | *(set i demo)* |
| 3 | Eyebrow, headline, intro | **Rich text** | Theme | | *(fra dokumentation)* |
| 4 | 3 buttons, hours, Kontakt, Find os | **Custom liquid** + `2-buttons-hours-contact.liquid` | **Code** | Theme sections give at most 1–2 buttons and can't hold a table that marks today | *(fra dokumentation)* |
| 5 | "Mærker vi forhandler" | **Rich text** | Theme | | *(fra dokumentation)* |
| 6 | Brand grid | **Logo list**, or **Custom liquid** + `3-brand-grid.liquid` | Theme or **code** | Logo list probably can't do the grid lines, the red logos or the "…og mange flere" box | *(set i demo)* |
| 7 | "Byman Cykler", newsletter (off), password entry | **Password - content**, moved down | Theme | | *(fra dokumentation)* |
| 8 | Footer with the CVR | **Text columns with images**, no images | Theme | | *(fra dokumentation)* |

**5 theme sections and 2 code sections. If Logo list can't do the design, which I expect, it's 5 and 3.**

- Whether these sections are allowed on the password page is about 80% likely *(ikke bekræftet)*. Switch's documentation says every page except Checkout and Gift card.
- **The snippets:**
  - they use the theme's own colour and font variables (seen on the Press demo), with the measured Press values as a fallback;
  - every class name starts with `bc-`, so nothing clashes with the theme;
  - they make no requests to other sites;
  - sizes: 3 KB, 21 KB and 7 KB, under Shopify's documented 50 KB limit for a Liquid code box *(fra dokumentation; Baseline's box is ikke bekræftet)*.
- **Testing:** they were tested on 2026-10-09 in Chrome against a copy of the Press demo's CSS and fonts, but **not yet inside Shopify**.

### A.3 Before building

- **Upload files:** go to **Content → Files (Indhold → Filer) → Upload files** and choose:
  - the photo: `assets/img/facade-placeholder.png` (temporary);
  - the logos from `assets/logos/`: `enve.png`, `specialized.svg`, `silca.svg`, `met.svg`, `polymer.svg`, `gripgrab-original.png`, `dt-swiss.svg`.

  If Shopify renames a file, note the new name. Shopify's help lists SVG as a "generic file" that paid plans accept. The demo stores use SVG logos from Files. *(fra dokumentation, set i demo)*
- **Copy a snippet whole:** in Terminal, type this and press Enter (change the file name for the other snippets):

  ```
  pbcopy < ~/Byman-cykler/placeholder/guide/snippets/1-status-strip.liquid
  ```

  Then paste with ⌘V. You can also ask Claude to copy it for you. Don't retype code in TextEdit, because it can turn quotes into curly ones.
- **Adding a section:** click **Add section (Tilføj sektion)**, search for the name and click it. Drag the six-dot handle to move it. Click **Save (Gem)** after each part.

### A.4 The parts, with the exact Danish text

1. **Custom liquid (strip):**
   - leave Subheading, Heading and Text empty;
   - paste `1-status-strip.liquid` into **Custom Liquid**;
   - drag it to the very top.

   → "ÅBNINGSTIDER ↓". It becomes the live status after part 4.
2. **Image with scrolling text:**
   - **Image:** `facade-placeholder.png`. **Mobile image:** empty.
   - **Desktop height:** Natural. **Mobile height:** Natural.
   - **Text:** `Byman Cykler.` **Link:** empty.
   - **Font:** Heading. **Position:** Bottom.
   - **Speed:** slow; about 12 seconds per "Byman Cykler.". Which end of the slider is slow is *(ikke bekræftet)*.
   - **Direction:** Right to left. **Repeat text:** on, with separator **Type: Gap**.
   - **HTML tag:** None. **Color scheme:** scheme 1.

   The photo will look a bit soft until the real one arrives. There's no pause button in this theme section *(ikke bekræftet)*.
3. **Rich text:**
   - **Subheading:** `Ny webshop på vej`
   - **Heading:** `Butik og værksted er åbne. Webshoppen er på vej.`
   - **Text:** `Vi er i gang med at bygge en ny webshop. Indtil den åbner, er butikken og værkstedet klar til at hjælpe dig med køb, rådgivning og service.`
   - **Text alignment:** Center. **Desktop layout → Width:** Two thirds, **Position:** Center.
   - No call to action.
4. **Custom liquid (buttons and hours):**
   - leave Subheading, Heading and Text empty;
   - paste `2-buttons-hours-contact.liquid`.

   → 3 round buttons, then Åbningstider (today in bold with a dot), Kontakt and Find os.
   - The hours, phone, email and address are typed into the snippet from `business.json`.
   - **The lines you change later:**
     - hours: lines 46–52 (`mandag  | 09:00 | 16:00` … `søndag  | lukket`);
     - special hours: between lines 63–64, for example `2026-12-24 | lukket | God jul.`;
     - contact: lines 71–76.
   - Test it by adding `?now=2026-10-11T08:15` to the preview address (or `&now=…` if the address already has a `?`).
5. **Rich text:**
   - **Heading:** `Mærker vi forhandler`
   - **Text:** `Vi er specialister i Specialized og har stor erfaring med landevejscykler og elektroniske gearsystemer. Værkstedet servicerer cykler på tværs af mærker.`
   - Center, Two thirds.
6. **Brand grid. Try Logo list first:**
   - **Display:** Static. **Logo alignment:** Center. **Logo max width:** about 150 px.
   - No heading.
   - 7 Logo blocks in this order: ENVE, Specialized, Silca, MET, Polymer Workshop, GripGrab, DT Swiss. No links.

   **What I expect,** from the code of two Baseline demo stores:
   - each logo sits in a same-size square, in a row, with **no lines**;
   - each file shows in its own colour, so the SVGs show black and the **white** ENVE and GripGrab files are invisible;
   - MET looks too big;
   - there's no text box for "…og mange flere".

   If that's what you see, **Remove section** and use **Custom liquid** with `3-brand-grid.liquid`:
   - you get 2 rows of 4 with pink lines, red logos and the "…og mange flere" box;
   - empty boxes mean a file name doesn't match Files;
   - if all of them are empty, change `data-logos="red"` to `data-logos="black"` in the snippet;
   - to add a brand, upload its logo and add a line `Name | file | size` to the list at the top of the snippet.
7. **Password - content:**
   - drag it to 7th place *(ikke bekræftet: that it can move)*;
   - **Logo image:** empty **[MANGLER: Byman Cykler logo file]**;
   - **Heading:** `Byman Cykler`;
   - **Show newsletter signup:** **off**, but fill in the texts so turning it on is one click later:
     - **Newsletter form heading:** `Få besked, når webshoppen åbner`
     - **Newsletter placeholder text:** `Din e-mail`
     - **Newsletter button text:** `Giv mig besked`
   - **Social sharing:** off.
8. **Text columns with images:**
   - heading empty, alignment Left;
   - 4 Column blocks, each with **Show image** off:
     1. `Byman Cykler – personlig rådgivning, salg og værksted for cykelentusiaster i København.`
     2. `Byman Cykler` / `Øster Farimagsgade 32` / `2100 København Ø`, then a new paragraph: `BYMAN CYKLER I/S · CVR 14579656`
     3. `35 42 51 56` (link `tel:+4535425156`) / `bymancykler@gmail.com` (link `mailto:bymancykler@gmail.com`)
     4. `Instagram` (link `https://www.instagram.com/byman.cykler/`) / `Facebook` (link `https://www.facebook.com/byman.cykler.dk/`)
   - Whether `tel:` and `mailto:` links are accepted is *(ikke bekræftet)*. Plain text works too.

### A.5 Newsletter, preview, publish, problems

- **If you switch the newsletter on** *(fra dokumentation)*:
  - Every person who signs up becomes a **customer who agreed to email marketing**, under **Customers (Kunder)**, in the ready-made **Email subscribers** group.
  - I recommend double opt-in (people confirm by clicking a link in an email): **Settings → Notifications → Customer notifications → Marketing double opt-in**.
  - Only use the addresses for what the form promises. A privacy policy (**Settings → Policies**) is good practice under the EU's data rules (GDPR). This is general advice, not legal advice.
- **Preview:** use the computer and phone icons in the editor, or **⋯ → Preview** on the theme. When it's ready, click **Publish (Udgiv)** on the copy. The old theme becomes your backup in the draft list.
- **Problems:**

| Problem | What to do |
|---|---|
| A section isn't offered under Add section on the password page | Stop and tell Claude |
| A red error on Save | Copy the whole snippet again |
| The strip only says "ÅBNINGSTIDER ↓" | Check that part 4 exists and has 7 day lines with times like `09:00` |
| Extra white space around the code parts | The section's own padding *(ikke bekræftet)*. Claude can trim it once the theme files arrive |

---

## When the theme files arrive

The Vercel page doesn't depend on them, but the real webshop and the Shopify alternative do. Until then, **the Shopify steps in this guide are based on the demo store and the help pages**.

1. **Download the theme files:** go to **Online Store → Themes → ⋯** (next to Baseline) **→ Download theme file (Webshop → Temaer → ⋯ → Download temafil)**. *(fra dokumentation)*
   → Shopify emails a link to a **ZIP file** (a packed folder) to the email you log in with.
2. Download the ZIP and double-click it in Finder to unpack it.
3. Make a folder called `theme-export` inside `placeholder/`. Put the **unpacked** contents in it, so you get `placeholder/theme-export/sections/`, `templates/`, `layout/`, `config/` and so on.
4. **Important:** the theme files are Switch Themes' paid, copyrighted code. Never push them to your public repo. Ask Claude to add `placeholder/theme-export/` to `.gitignore` (the list of files Git ignores) first.
5. Ask Claude: **"Re-check the section map against the theme files."** Claude will:
   - read `templates/password.json` and `layout/password.liquid`;
   - check **every *unverified* row** in `design/section-map.md` against the `{% schema %}` at the bottom of each `sections/*.liquid` file: `enabled_on` / `disabled_on` (which pages a section may go on) and `presets` (whether it shows up under Add section);
   - check `main-password`, Logo list's static mode, Custom liquid's padding, and the theme variable names the snippets use;
   - compare `config/settings_data.json` with `design/tokens.css`, and check `locales/da.json` for Danish texts;
   - then update this guide and the snippets where anything differs.

---

## Sources

Checked on 2026-10-09.

**Vercel**

- Custom domains (Settings → Domains, A for the apex, CNAME for subdomains, project-specific values): https://vercel.com/docs/domains/working-with-domains/add-a-domain
- A record value (`76.76.21.21` or your project's own value) and CAA: https://vercel.com/kb/guide/a-record-and-caa-with-vercel
- Redirecting the apex to www (www recommended as primary): https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting
- Root Directory, Framework Preset "Other", skipping the build step: https://vercel.com/docs/builds/configure-a-build
- Ignored Build Step (the menu, the exit codes, deploy quotas): https://vercel.com/docs/project-configuration/project-settings
- Ignored Build Step command `git diff HEAD^ HEAD --quiet -- .` and the shallow-clone caveat: https://vercel.com/kb/guide/how-do-i-use-the-ignored-build-step-field-on-vercel

**One.com.** The help pages block automated reading. The menu path (Control Panel → Advanced settings → DNS settings → DNS records), the default TTL of 3600 s and "up to 24 hours" come from search summaries of these pages, so the exact labels are *(ikke bekræftet)*:

- https://help.one.com/hc/en-us/articles/115005595925-Manage-your-DNS-settings
- https://help.one.com/hc/en-us/articles/360000799298-How-do-I-create-an-A-record
- https://help.one.com/hc/en-us/articles/360000803517-How-do-I-create-a-CNAME-record

**Shopify Help**

- Shopify's DNS values (A `23.227.38.65`, CNAME www `shops.myshopify.com`, remove other A/AAAA records, up to 48 hours): https://help.shopify.com/en/manual/domains/add-a-domain/connecting-domains/connect-domain-manual
- Changing the primary domain (other addresses redirect to the primary): https://help.shopify.com/en/manual/domains/domain-type/change-primary-domain
- Password page and private mode: https://help.shopify.com/en/manual/online-store/themes/password-page
- Preferences: https://help.shopify.com/en/manual/online-store/setting-up/preferences
- Store name: https://help.shopify.com/en/manual/intro-to-shopify/initial-setup/setup-business-settings
- Sections and blocks (Edit theme, Add section, 25 sections): https://help.shopify.com/en/manual/online-store/themes/theme-structure/sections-and-blocks
- Files: https://help.shopify.com/en/manual/shopify-admin/productivity-tools/file-uploads
- Duplicating, publishing and downloading themes:
  - https://help.shopify.com/en/manual/online-store/themes/managing-themes/duplicating-themes
  - https://help.shopify.com/en/manual/online-store/themes/managing-themes/publishing-themes
  - https://help.shopify.com/en/manual/online-store/themes/managing-themes/downloading-themes
- Email subscribers and double opt-in: https://help.shopify.com/en/manual/promoting-marketing/create-marketing/customer-contact-information
- The 50 KB limit for Liquid code boxes: https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings

**Switch Themes (Baseline)**

- Password - content: https://help.switchthemes.co/baseline/sections/template/password-content
- Logo list: https://help.switchthemes.co/baseline/sections/content/logo-list
- Custom liquid: https://help.switchthemes.co/baseline/sections/content/custom-liquid
- Image with scrolling text: https://help.switchthemes.co/baseline/sections/content/image-with-scrolling-text
- Rich text: https://help.switchthemes.co/baseline/sections/content/rich-text
- Text columns with images: https://help.switchthemes.co/baseline/sections/content/text-columns-with-images

**Checked directly** (public information only)

- DNS for byman-cykler.dk with `dig` on 2026-10-09: A `23.227.38.65`; www CNAME `shops.myshopify.com`; NS `ns01/ns02.one.com`; no AAAA, MX, TXT or CAA.
- Demo stores: the Press demo for the CSS variables, and the Bold and Courier demos for the Logo list markup:
  - https://baseline-preset-coffee.myshopify.com/
  - https://baseline-theme-bold.myshopify.com/
  - https://baseline-preset-courier.myshopify.com/

**This project:** `design/section-map.md`, `research/theme-analysis.md`, `design/ui-spec.md`, `design/copy-da.md`, `data/business.json`, `data/brands.json`, `research/data-sources.md`, `build/`, `build.mjs`.
