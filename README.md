# Mohamed Shafeek — portfolio

React (Vite) site, prerendered to static HTML and hosted on **GitHub Pages**.
Everything lives in this repository: code, content, notes and the daily automation.

Live site: https://mohamedshafeekbasheer.github.io/Portfolio/

## How it works

```
Every morning, 06:17 UTC+3  (.github/workflows/daily-digest.yml)
  ├─ collects news from content/sources.json (Microsoft 365 & Power Platform blogs,
  │   PnP PowerShell / PnPjs releases, new PnP Script Samples, M365 roadmap)
  ├─ opens an issue: "Daily digest — <date>"
  └─ drafts ONE note + LinkedIn text with Claude → opens a pull request

You review the pull request
  ├─ fill in the [ADD: …] placeholders with your own experience
  ├─ check every claim, test any code
  └─ Merge  →  .github/workflows/deploy.yml rebuilds and publishes the site (~1 minute)
               and the LinkedIn text is in the pull request, ready to paste
```

Safety nets: nothing publishes without your merge, and the build **refuses to publish a note
that still contains an `[ADD: …]` placeholder**.

## One-time setup (about 10 minutes)

1. **Turn on GitHub Pages.** Repository → *Settings* → *Pages* → *Source*: **GitHub Actions**.
2. **Let the digest open pull requests.** *Settings* → *Actions* → *General* → *Workflow permissions*:
   choose **Read and write permissions** and tick **Allow GitHub Actions to create and approve pull requests**.
3. **Add your Claude API key** (for drafts). Create a key at console.anthropic.com, then
   *Settings* → *Secrets and variables* → *Actions* → *New repository secret*:
   name `ANTHROPIC_API_KEY`. Without it you still get the daily digest, just no draft.
   Cost: roughly a few cents per draft.
4. **Contact form (Formspree).** Sign up free at formspree.io, create a form with your email,
   copy its ID (the part after `/f/`, e.g. `xyzabcde`) into `formspree_id` in
   `src/content/site.json`. Until then the form opens the visitor's email app instead.
5. **Merge this branch into `main`.** The first deploy runs automatically.
6. Optional: run the digest now from *Actions* → *Daily digest* → *Run workflow*.

## Writing and editing

- **Phone:** GitHub app → this repo → *Pull requests* → open the draft → edit the file → merge.
- **Browser editor:** sign in at https://app.pagescms.org with GitHub and open this repo. You get
  forms for Notes and LinkedIn texts (configured in `.pages.yml`). Saving commits to the repo.
- **By hand:** add `content/posts/YYYY-MM-DD-your-slug.md`:

```markdown
---
title: "Auditing sharing links with PnP PowerShell"
date: 2026-11-21
summary: One sentence that appears in lists and Google results.
tags: [PnP PowerShell, Governance]
sources:
  - https://pnp.github.io/powershell/
---
Your note in Markdown…
```

Set `draft: true` in the front matter to keep a note unpublished.

Other content: `src/content/site.json` (profile, services, recruiter keywords),
`src/content/work.json` (case studies), `content/sources.json` (what the digest collects).

## Local development

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

Try the digest without creating anything:

```bash
DRY_RUN=1 npm run digest
```

## Notes

- The site works at a domain root or under `/Portfolio/`; the deploy workflow sets the base path.
  If you later add a custom domain or rename the repo to `mohamedshafeekbasheer.github.io`,
  nothing in the code needs to change.
- GitHub Pages can't send HTTP security headers, so a Content-Security-Policy is set in each page.
- A service worker caches the site for fast repeat visits and offline reading.
