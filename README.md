# Mohamed Shafeek — portfolio

React (Vite) site, **prerendered to static HTML** at build time and served from Netlify's global CDN.

- Every page is real HTML, so it shows instantly, works with JavaScript turned off, and Google reads it fully.
- React then takes over for instant page switches, a small loading bar and light animations.
- A service worker caches the site. Repeat visits load from the device, and pages open even offline or on a
  bad connection.
- No third-party requests at all: fonts, images and scripts are all self-hosted.

## Edit content

Everything you'd want to change is in two files:

- `src/content/site.json`: headline, intro, availability, services and prices, about, timeline, skills.
- `src/content/work.json`: case studies. Each one has `before` (what was failing), `work` (what you
  did), `outcome` (what changed), `swap` (the short before → after line used on the home page), and `status`.
  Add an entry and you get a new page at `/work/<slug>/`.

## Run locally

```bash
npm install
```

```bash
npm run dev
```

Production build into `dist/`:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deploy

`netlify.toml` already tells Netlify to run `npm ci && npm run build` and publish `dist/`. Connect this
GitHub repo to your Netlify site once, and every push deploys on its own.

- **Contact form:** Netlify Forms. Messages appear under *Forms* in Netlify. Turn on email notifications
  there. If a visitor is offline or the send fails, the message is kept on their device and they get a
  one-tap email fallback.
- **Old URLs** (`/pages/about.html` and others) redirect to the new pages via `public/_redirects`.
- **Caching:** hashed files in `/assets/` are cached for a year. HTML and `sw.js` are always re-checked,
  so new deploys show up straight away.

## If the domain changes

Update `site_url` in `src/content/site.json`. Canonical links, sitemap, social cards and structured data all
follow it.

## Share image

`public/og.png` is a 1200×630 screenshot of `scripts/og.html`.
