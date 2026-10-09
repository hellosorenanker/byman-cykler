# Daily opening-hours check: setup guide

**What it does:**
- Every morning around 7 o'clock, GitHub runs a small job that asks Google for Byman Cykler's opening hours and compares them with the page.
- **If they match:** nothing happens.
- **If they differ:** GitHub opens an "issue" (a note in the repo) and emails you. That includes changed normal hours, holiday hours added on Google in the coming 7 days, or Google marking the shop as closed.
- **When the page and Google match again,** the note closes by itself.

**Why it only *compares*:** Google's rules for this service don't allow storing or copying its data, so the job never saves Google's hours. The email only says *which* days differ and what the page says. You then look at Google Maps, and the page is updated, by you or by asking Claude.

**Cost:** about 30 requests to Google a month. Google's free allowance for this type of request is 1,000 a month, so you shouldn't pay anything. Google still requires a payment card on the account.

**Time:** about 15–20 minutes, once.

Words you'll meet:
- **Google Cloud** is Google's site for developer services (console.cloud.google.com).
- **An API key** is a password-like code that lets the job ask Google. It's secret.
- **A GitHub secret** is a safe place in GitHub's settings for that key. Nobody can read it back, not even on a public repo.

---

## Part 1: get a Google key (Google Cloud)

1. Go to **https://console.cloud.google.com** and sign in with your Google account. Ideally use the account that manages the Byman Business Profile, but any account works.
2. At the top, click the **project picker**, then **New project**. Name it `byman-cykler` and click **Create**.
   → You now see the new project's dashboard.
3. Open the menu (☰) → **Billing**. Link a billing account, or create one with your payment card.
   → The project shows a billing account.
4. Menu (☰) → **APIs & Services → Library**. Search for **Places API (New)**, open it and click **Enable**.
   - Make sure it says "(New)".
5. Menu (☰) → **APIs & Services → Credentials**. Click **Create credentials → API key**.
   → A box shows your key. Copy it, but **don't paste it into any file, email or chat**. You'll put it in GitHub in Part 2.
6. Click **Edit API key**, or the key's name in the list:
   - Under **API restrictions**, choose **Restrict key** and tick only **Places API (New)**.
   - Click **Save**.

   If the key ever leaked, it could then only be used for this one service.
7. **Recommended: a spending alarm.** Menu (☰) → **Billing → Budgets & alerts → Create budget**. Set a small amount, for example 50 kr., and keep the email alerts on.
   → If anything ever costs money, you get an email.
8. **Optional: a hard daily cap.** Menu (☰) → **APIs & Services → Places API (New) → Quotas & system limits**. Lower the requests per day (for example "GetPlace" requests) to around 20. *(menu names not confirmed)*

## Part 2: give the key to GitHub (a secret)

1. Go to **https://github.com/hellosorenanker/byman-cykler** → **Settings** (the tab at the top of the repo) → **Secrets and variables → Actions**.
2. Click **New repository secret**:
   - **Name:** `GOOGLE_PLACES_API_KEY`, exactly like that.
   - **Secret:** paste the key from Part 1.
   - Click **Add secret**.

   → It shows in the list. GitHub never shows the value again, and that's normal.

## Part 3: test it once

1. In the repo, click the **Actions** tab, then **Check opening hours on Google** in the left list.
2. Click **Run workflow → Run workflow** (the green button).
3. Wait about a minute, then click the run:
   - **Green tick, log says "the page matches Google":** all set.
   - **Green tick, and a new issue appears under the "Issues" tab:** Google's hours differ from the page. Follow the steps in the issue.
   - **Red cross:** something is wrong. Open the "Compare the page's hours with Google" step; Google's message explains it, for example "billing not enabled" or "API key not valid". Send Claude a screenshot.
4. **Tell Claude the first run worked.** Claude then saves the shop's *place ID* (Google's ID for the shop; Google allows storing it) in `business.json`. Each day's check is then one request instead of two.

## Good to know

- **Emails come from GitHub.** The issue mentions you (@hellosorenanker), so you get an email. If none arrives, check github.com → your picture → **Settings → Notifications**, and make sure email is ticked.
- **The 60-day pause:** GitHub pauses scheduled jobs in public repos after **60 days without any changes to the repo**. It emails you before it happens. To restart: **Actions → Check opening hours on Google → Enable workflow**. Any update to the page (new hours, a photo, a brand) also counts as activity.
- **When an issue arrives:**
  1. Open Google Maps and look at the hours. The link is in the issue.
  2. **If Google is right:** ask Claude to "update the opening hours on the placeholder page". Claude edits `placeholder/data/business.json`, rebuilds and, with your OK, pushes. The issue closes itself the next morning.
  3. **If Google is wrong:** fix the hours in your Google Business Profile instead.
- **Holiday hours:** the check sees holiday hours up to 7 days ahead, because that's how far Google shares them. Enter Christmas hours on Google early, and add them to the page at the same time. The check then just confirms they match.
- **Stopping it:** **Actions → Check opening hours on Google → ⋯ → Disable workflow**. You can also delete the secret in GitHub and the key in Google Cloud.
- **Where things live:**
  - the job: `.github/workflows/check-opening-hours.yml`
  - the checking script: `placeholder/tools/check-google-hours.mjs` (there are comments at the top)

## Sources
- Google's rule against storing Places data (only the place ID may be stored): https://developers.google.com/maps/documentation/places/web-service/policies
- Opening hours count as "Place Details Enterprise" requests: https://developers.google.com/maps/documentation/places/web-service/place-details
- Free monthly allowance for Place Details Enterprise (1,000 a month): https://developers.google.com/maps/billing-and-pricing/pricing
- GitHub secrets: https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions
- GitHub pausing scheduled jobs after 60 days: https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/disabling-and-enabling-a-workflow
