#!/usr/bin/env node
// =====================================================================
// Daily opening-hours check: does the page still match Google?
// =====================================================================
//
// WHAT IT DOES
//   1. Reads the hours the page shows, from placeholder/data/business.json.
//   2. Asks Google (Places API, New) for the shop's hours: the normal
//      week and any special days (holidays) in the coming 7 days.
//   3. Compares the two. If anything differs, it writes a short report.
//      The GitHub workflow (.github/workflows/check-opening-hours.yml)
//      turns that report into a GitHub issue, which emails Søren.
//
// WHY IT ONLY COMPARES
//   Google's Places API rules don't allow storing or copying its data
//   (only the place ID may be kept). So this script never writes Google's
//   hours anywhere: not to a file, not to the report, not to the log.
//   The report only says WHICH days differ and what the PAGE says.
//   Søren then checks the Google listing and updates business.json.
//
// HOW TO RUN IT BY HAND (on a Mac, from the repo root)
//   GOOGLE_PLACES_API_KEY=your-key node placeholder/tools/check-google-hours.mjs
//   Never write the key into a file: the repo is public.
//
// OPTIONS
//   --report <file>         write the Markdown report here
//   --github-output <file>  write "status=same|different|skipped" for GitHub Actions
//   --mock <file.json>      use a saved Google answer instead of calling Google (for testing)
//   --today YYYY-MM-DD      pretend today is this date (for testing)
//
// EXIT CODES
//   0 = check done (same or different) or skipped (no API key yet)
//   1 = something went wrong (bad key, wrong shop found, Google error)
//
// No npm packages needed (Node 18+).
// =====================================================================

import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUSINESS_FILE = join(ROOT, 'data', 'business.json');
const TIME_ZONE = 'Europe/Copenhagen';
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']; // Google: 0 = Sunday
const DAY_DA = { monday: 'Mandag', tuesday: 'Tirsdag', wednesday: 'Onsdag', thursday: 'Torsdag', friday: 'Fredag', saturday: 'Lørdag', sunday: 'Søndag' };
const WEEK_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// ---------- small helpers ----------
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const pad = (n) => String(n).padStart(2, '0');
const fail = (msg) => { console.error(`ERROR: ${msg}`); process.exit(1); };

// "09:00" -> "09.00", ranges joined Danish style: "09.00–16.00"
const daTime = (t) => t.replace(':', '.');
const showHours = (ranges) => (ranges.length ? ranges.map((r) => r.split('-').map(daTime).join('–')).join(', ') : 'lukket');

// Today's date in Copenhagen as YYYY-MM-DD
function copenhagenToday() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
const addDays = (iso, n) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const weekdayOf = (iso) => DAYS[new Date(`${iso}T12:00:00Z`).getUTCDay()];
const isoOf = (d) => `${d.year}-${pad(d.month)}-${pad(d.day)}`;
const daDate = (iso) => new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));

// ---------- the page's hours (business.json) ----------
function pageHours(business) {
  const week = Object.fromEntries(WEEK_ORDER.map((d) => [d, []]));
  for (const e of business.openingHours || []) {
    if (!week[e.day]) fail(`business.json: unknown day "${e.day}"`);
    if (!e.closed) week[e.day].push(`${e.open}-${e.close}`);
  }
  for (const d of WEEK_ORDER) week[d].sort();
  const special = {};
  for (const e of business.specialHours || []) {
    special[e.date] ??= [];
    if (!e.closed) special[e.date].push(`${e.open}-${e.close}`);
  }
  for (const d in special) special[d].sort();
  return { week, special };
}

// ---------- Google's hours (Places API, New) ----------
// A Google "period" is { open: {day, hour, minute, date?}, close: {...} }.
const hhmm = (p) => `${pad(p.hour ?? 0)}:${pad(p.minute ?? 0)}`;
function rangeOf(period) {
  if (!period.close) return '00:00-24:00'; // open 24 hours
  let close = hhmm(period.close);
  if (close === '00:00' && period.close.day !== period.open.day) close = '24:00'; // closes at midnight
  return `${hhmm(period.open)}-${close}`;
}
function googleHours(place, windowDates) {
  if (!place.regularOpeningHours?.periods) fail('Google returned no opening hours for this place.');
  const week = Object.fromEntries(WEEK_ORDER.map((d) => [d, []]));
  for (const p of place.regularOpeningHours.periods) week[DAYS[p.open.day]].push(rangeOf(p));
  for (const d of WEEK_ORDER) week[d].sort();

  // Special days only exist in currentOpeningHours (the coming 7 days).
  const special = {};
  const current = place.currentOpeningHours;
  for (const s of current?.specialDays || []) {
    const iso = isoOf(s.date);
    if (!windowDates.includes(iso)) continue;
    special[iso] = (current.periods || []).filter((p) => p.open?.date && isoOf(p.open.date) === iso).map(rangeOf).sort();
  }
  return { week, special };
}

async function callGoogle(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  if (!res.ok) {
    // Google's error text explains things like "API key not valid" or "billing not enabled".
    let msg = text;
    try { msg = JSON.parse(text).error?.message || text; } catch {}
    fail(`Google answered ${res.status}: ${msg}`);
  }
  return JSON.parse(text);
}

async function fetchPlace(business, key) {
  const headers = { 'X-Goog-Api-Key': key, 'Content-Type': 'application/json' };
  let placeId = business.google?.placeId || '';
  // business.json may hold a Maps "CID" (0x...:0x...), which the Places API doesn't accept.
  if (!placeId || placeId.startsWith('0x')) {
    const a = business.address;
    const query = `${business.name}, ${a.street}, ${a.postalCode} ${a.city}`;
    const found = await callGoogle('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: { ...headers, 'X-Goog-FieldMask': 'places.id,places.displayName' },
      body: JSON.stringify({ textQuery: query, languageCode: 'da', regionCode: 'DK', pageSize: 1 }),
    });
    placeId = found.places?.[0]?.id;
    if (!placeId) fail(`Google found no place for "${query}".`);
    // Place IDs may be stored, so this is safe to log. Put it in business.json -> google.placeId to skip this search.
    console.log(`Place ID found by search: ${placeId}`);
  }
  return callGoogle(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=da&regionCode=DK`, {
    headers: { ...headers, 'X-Goog-FieldMask': 'id,displayName,businessStatus,regularOpeningHours,currentOpeningHours' },
  });
}

// ---------- main ----------
const business = JSON.parse(readFileSync(BUSINESS_FILE, 'utf8'));
const today = opt('--today') || copenhagenToday();
const windowDates = Array.from({ length: 7 }, (_, i) => addDays(today, i));
const writeOutput = (status) => { if (opt('--github-output')) appendFileSync(opt('--github-output'), `status=${status}\n`); };

let place;
if (opt('--mock')) {
  place = JSON.parse(readFileSync(opt('--mock'), 'utf8'));
} else {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    console.log('No GOOGLE_PLACES_API_KEY set yet, so the check was skipped. See placeholder/guide/HOURS-CHECK.md.');
    writeOutput('skipped');
    process.exit(0);
  }
  place = await fetchPlace(business, key);
}

// Make sure Google gave us the right shop before comparing anything.
const wanted = business.name.split(/\s+/)[0].toLowerCase(); // "byman"
if (!(place.displayName?.text || '').toLowerCase().includes(wanted)) {
  fail(`Google returned a place that doesn't look like ${business.name}. Check google.placeId in business.json.`);
}

const page = pageHours(business);
const google = googleHours(place, windowDates);
const problems = [];

for (const d of WEEK_ORDER) {
  if (page.week[d].join() !== google.week[d].join()) {
    problems.push(`- **${DAY_DA[d]}** (normal week): the page says ${showHours(page.week[d])}, Google says something else.`);
  }
}
for (const iso of windowDates) {
  const inPage = iso in page.special, inGoogle = iso in google.special;
  if (inGoogle && !inPage) {
    problems.push(`- **${daDate(iso)}** (${DAY_DA[weekdayOf(iso)].toLowerCase()}): Google has special hours that day, the page doesn't.`);
  } else if (inPage && !inGoogle) {
    problems.push(`- **${daDate(iso)}**: the page has special hours (${showHours(page.special[iso])}), Google doesn't.`);
  } else if (inPage && inGoogle && page.special[iso].join() !== google.special[iso].join()) {
    problems.push(`- **${daDate(iso)}**: special hours differ. The page says ${showHours(page.special[iso])}, Google says something else.`);
  }
}
if (place.businessStatus && place.businessStatus !== 'OPERATIONAL') {
  problems.push(`- **Status:** Google marks the shop as \`${place.businessStatus}\` (for example temporarily closed). Check that this is right.`);
}

if (!problems.length) {
  console.log(`Checked ${today}: the page matches Google (normal week and special days until ${windowDates[6]}).`);
  writeOutput('same');
  process.exit(0);
}

const owner = process.env.REPO_OWNER ? `@${process.env.REPO_OWNER} ` : '';
const report = `${owner}The daily check found that the opening hours on Google differ from the page:

${problems.join('\n')}

**What to do**
1. Open the shop on Google Maps and look at the hours: ${business.google?.mapsUrl || 'search for Byman Cykler on Google Maps'}
2. If Google is right: ask Claude to "update the opening hours on the placeholder page", or edit \`placeholder/data/business.json\`, run \`node placeholder/build.mjs\` and push.
3. If Google is wrong: fix the hours in your Google Business Profile instead.

This issue closes by itself when the page and Google match again.
_Google's hours are not copied here, because Google's terms don't allow storing them._
`;
console.log(`Checked ${today}: ${problems.length} difference(s) found.`);
console.log(problems.join('\n'));
if (opt('--report')) writeFileSync(opt('--report'), report);
writeOutput('different');
