# A2 — Google & business data: research notes

Research done 2026-10-09. All claims below are backed by a cited source; anything not found is listed under "What I couldn't find" rather than guessed.

Tools used: Google Maps (via a headless-Chrome helper, cookie banner declined with "Afvis alle"), the shop's own website (byman-cykler.dk), Krak.dk, the official Danish CVR register (datacvr.virk.dk), and the shop's public Facebook and Instagram pages. No logins, accounts or forms were used anywhere.

## Field-by-field table

| Field | Value | Source | Retrieved | Confidence |
|---|---|---|---|---|
| Trading name | Byman Cykler | [Google Maps](https://www.google.com/maps/place/Byman+Cykler/@55.691656,12.5766201,17z/data=!3m1!4b1!4m6!3m5!1s0x46525302b34557e7:0x2ce360f597b2c25f!8m2!3d55.691656!4d12.5766201!16s%2Fg%2F1vspq36y) | 2026-10-09 | High |
| Legal name | BYMAN CYKLER I/S | [CVR register](https://datacvr.virk.dk/enhed/virksomhed/14579656) | 2026-10-09 | High |
| CVR number | 14579656 | [CVR register](https://datacvr.virk.dk/enhed/virksomhed/14579656) | 2026-10-09 | High |
| Company form / status | Interessentskab, Aktiv (active), started 01.10.1987 | [CVR register](https://datacvr.virk.dk/enhed/virksomhed/14579656) | 2026-10-09 | High |
| Address | Øster Farimagsgade 32, 2100 København Ø | [CVR register](https://datacvr.virk.dk/enhed/virksomhed/14579656), [Krak](https://www.krak.dk/byman+cykler/66619758/firma) | 2026-10-09 | High |
| Phone | 35 42 51 56 (+45 35 42 51 56) | [Google Maps](https://www.google.com/maps/place/Byman+Cykler/@55.691656,12.5766201,17z/data=!3m1!4b1!4m6!3m5!1s0x46525302b34557e7:0x2ce360f597b2c25f!8m2!3d55.691656!4d12.5766201!16s%2Fg%2F1vspq36y), [Krak](https://www.krak.dk/byman+cykler/66619758/firma), Facebook | 2026-10-09 | High |
| Website | byman-cykler.dk | [Google Maps](https://www.google.com/maps/place/Byman+Cykler/@55.691656,12.5766201,17z/data=!3m1!4b1!4m6!3m5!1s0x46525302b34557e7:0x2ce360f597b2c25f!8m2!3d55.691656!4d12.5766201!16s%2Fg%2F1vspq36y), Facebook | 2026-10-09 | High |
| Email | bymancykler@gmail.com | shop's own website (`mailto:` link, [byman-cykler.dk](https://byman-cykler.dk)), confirmed on Facebook page | 2026-10-09 | High |
| Instagram | instagram.com/byman.cykler | linked from [byman-cykler.dk](https://byman-cykler.dk) | 2026-10-09 | High |
| Facebook | facebook.com/byman.cykler.dk | linked from [byman-cykler.dk](https://byman-cykler.dk) | 2026-10-09 | High |
| Strava | not found | searched web, not on website/socials | 2026-10-09 | — (missing) |
| Opening hours | see table below | Google Maps weekly-hours panel | 2026-10-09 | Medium (Google wins per Søren's rule, but not confirmed by a second matching source — see disagreements) |
| Special/holiday hours | none listed | Google Maps | 2026-10-09 | High (absence confirmed, nothing invented) |
| Google status | Operational (shown as "Åben", not marked temporarily/permanently closed) | Google Maps | 2026-10-09 | High |
| Google category | Cykelværksted (bike workshop) | Google Maps | 2026-10-09 | High |
| Google rating | 3.6 stars, 62 reviews (36×5★, 4×4★, 3×3★, 1×2★, 18×1★) | Google Maps | 2026-10-09 | High |
| Coordinates | 55.691656, 12.5766201 | Google Maps URL | 2026-10-09 | High |
| "Place ID" | `0x46525302b34557e7:0x2ce360f597b2c25f` | Google Maps URL | 2026-10-09 | Medium — this is the CID shown in the URL, not the standard `ChIJ…` Places API ID (see note below) |

## Opening hours found on Google Maps (the source Søren said should win)

| Day | Hours |
|---|---|
| Monday | 09:00–16:00 |
| Tuesday | 09:00–16:00 |
| Wednesday | 11:00–17:00 |
| Thursday | 09:00–16:00 |
| Friday | 09:00–16:00 |
| Saturday | 11:00–14:00 |
| Sunday | Closed |

Sanity check: retrieved on Friday 2026-10-09, and the quick overview panel said "Åben · Lukker 16.00" (open, closes 16:00) — consistent with the Friday row above.

## Disagreements between sources

1. **Opening hours — Google Maps vs. Instagram bio.** Google Maps lists Wednesday as a later/longer day (11:00–17:00) with the other weekdays at 09:00–16:00. The shop's own Instagram bio (@byman.cykler) instead states a flat "Monday - Friday 09:00 - 15:00" with no Wednesday exception, and closes an hour earlier than Google on every weekday. Saturday matches (11:00–14:00) on both. **Per Søren's rule, Google's hours were used in `business.json`.** Krak does not list any hours at all for this listing, so it couldn't be used as a tiebreaker. Recommendation: Søren should confirm the real current hours by phone or in person, since the two public sources meaningfully disagree (15:00 vs. 16:00/17:00 close), and neither is evidently more recently updated than the other.
2. **City name — Google Maps vs. Krak/CVR.** Google Maps' own address line reads "Øster Farimagsgade 32, 2100 København" (no district letter). Krak and the official CVR register both give "2100 København Ø". `business.json` uses "København Ø" since it is the officially correct name for postal code 2100 and is confirmed by two independent sources; Google simply appears to truncate it in its display string.
3. **Brand/shop name — "Byman Cykler" vs. "Byman Sport".** Everywhere the public can see it (Google, Krak, Facebook, Instagram, and the visible text on byman-cykler.dk), the name is **Byman Cykler**. However, the raw HTML of byman-cykler.dk shows the underlying Shopify shop's internal name is **"Byman Sport"** (`<title>Byman Sport</title>`, and the Shopify Pay/Shop-Pay JSON blob also says `"merchantName":"Byman Sport"`). This looks like a leftover internal/legal Shopify account name rather than the trading name, and is **not** something to show visitors — flagging it only so Søren is aware the Shopify back end still carries the old name somewhere in its settings.
4. **Reputation metric — not a true disagreement, but not comparable.** Google shows a 5-star rating (3.6★/62 reviews). Facebook instead shows "90% anbefalet (53 anmeldelser)" — a recommend/don't-recommend percentage, a different scale entirely. Don't present these as if they measure the same thing.

## What I couldn't find, and where I looked

- **Strava club/profile** — searched the web and checked the website and both social profiles; no Strava presence found. Added to `missing`.
- **A standard Google Place ID (`ChIJ…`)** — only the CID form (`0x...:0x...`) is visible in the Maps URL/share links from the browser. Getting the canonical `ChIJ…` ID needs either the Places API "Find Place" / "Place ID finder" tool or an authenticated Places API call — out of scope for plain browsing. Noted in `business.json` as medium confidence with this caveat.
- **Specialized dealer-locator confirmation** — tried `specialized.com/dk/da/stores` with a postal-code query string as a cross-check for "Specialized is the main brand," but the URL pattern guessed returned Specialized's 404 page, not a store list. Did not find the right query format in the time available; this remains unverified. If this matters for the final copy, it's worth a manual check of Specialized's dealer finder.
- **Any holiday/special hours** — none appear on the Google listing. Nothing invented; `specialHours` is `[]`.
- **Krak opening hours** — Krak's listing for Byman Cykler has no hours section at all (confirmed by reading the full page text), so it could not serve as a tie-breaker for the Google vs. Instagram disagreement above.

## "Live hours later" — how this could work (unverified against theme files, nothing built)

> **Orchestrator update (2026-10-09):**
> - **This plan was not built.** Google's Places API policies forbid storing or caching Places content (only `place_id` is exempt), so a cached or stored copy of the hours isn't allowed.
> - **What was built instead:** a daily *comparison* that never stores Google's data, with an email alert. See `guide/HOURS-CHECK.md` and `tools/check-google-hours.mjs`.
> - **The cost note below is outdated.** Since 2025 Google uses free monthly caps per SKU instead of a $200 credit; opening hours are Place Details **Enterprise**, with 1,000 free a month.
> - **The `api/` folder idea also no longer fits.** The page is a separate Vercel project with root `placeholder/build`.

Right now `business.json` has hours typed in by hand from today's Google Maps check. Over time these will drift out of date (shops change hours seasonally, add holiday closures, etc.). A small, optional upgrade later would be to fetch the hours live from Google instead of hand-editing a file.

**How it would work, in plain terms:**

1. Google has a service called the **Places API (New)**. If you give it a place's ID, it can return structured fields including `regularOpeningHours` (the normal weekly schedule), `currentOpeningHours` (same, but adjusted for anything happening right now, e.g. a holiday), `rating`, `userRatingCount`, and `googleMapsUri` (a ready-made link to the listing).
2. Instead of the website asking Google directly (which would expose your private API key to every visitor's browser), a small **Vercel serverless function** — a tiny bit of server-side code — would sit in the existing `api/` folder (next to `api/lookup.js`, which already exists for something else and shouldn't be touched). The front-end page would call *that* function, and the function would call Google on the page's behalf, using the key safely on the server side where visitors can't see it.
3. The function would **cache** the result for some period (e.g. 1–24 hours) so the page doesn't make a fresh paid Google request on every single visitor — it would reuse the last answer for a while, then refresh it.

**What Søren himself would need to do (none of this is done — just explaining what it would involve):**

- Create a **Google Cloud account** and attach a **billing method** (a credit card) — the Places API requires billing to be enabled even though small usage is normally covered by Google's free monthly credit.
- Generate an **API key** in that Google Cloud project, and add it to **Vercel's environment variables** (Vercel project settings, not a file in the repo) — never written into any file that gets committed, since this repository is public.
- **Restrict the key** in Google Cloud (e.g. to only the Places API, and ideally to only requests coming from the Vercel server) so that if it ever leaked, it couldn't be abused for other Google services or run up unexpected charges.
- Decide on a **caching duration** (a developer/Claude task, but Søren should pick how "fresh" the hours need to be — e.g. refresh once a day is almost certainly enough for shop hours).

**Pros:**
- Hours, rating and review count would always match what's live on Google, with no manual editing.
- Automatically reflects temporary holiday hours or closures Google already knows about.

**Cons / costs:**
- Adds a dependency on a paid Google service and on Søren maintaining a Google Cloud account/billing relationship.
- A small but real risk of unexpected cost if caching is misconfigured or the key is abused (mitigated by restricting the key and caching aggressively).
- One more moving part that can break (if Google changes the API, or the key expires/is revoked, the page would need to fall back to the hand-typed hours in `business.json` rather than show an error).

**Rough cost note:** Google's Places API (New) pricing includes a monthly free usage credit (historically around $200/month, covering roughly several thousand Place Details calls at this field set), after which it's billed per request. For a single shop's hours refreshed at most a few times a day via server-side caching, usage would almost certainly stay inside the free tier. (Source: Google's own Places API pricing page, which Søren should check directly at the time he sets this up, since Google's pricing and free-tier terms change — this note is a rough orientation, not a quote of current, binding pricing.)

**Bottom line for now:** not built, not necessary for the placeholder. The hand-typed hours in `business.json` are a fine starting point; this section just lays out the option for later, including the real-world account/billing/security steps involved, so the decision is Søren's to make with eyes open.
