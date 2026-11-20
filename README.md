# Mohamed Shafeek — portfolio site

Plain static site, published from `site/`. No framework and no npm. `tools/build.py` writes the
HTML from two content files.

## Edit the content

- `content/site.json`: name, headline, intro, availability, services and prices, about text,
  timeline, skills.
- `content/work.json`: one entry per case study. Add an entry and you get a new page at `/work/<slug>/`.

Then rebuild:

```bash
python3 tools/build.py
```

Commit both `content/` and `site/`.

## Deploy (Netlify)

`netlify.toml` points Netlify at `site/` with no build command. Connect this repo in
Netlify, choose the branch, and every push goes live.

- The contact form uses **Netlify Forms**. Messages show up under *Forms* in the Netlify dashboard.
  Turn on email notifications there so they reach your inbox.
- `_redirects` sends old URLs (`/pages/about.html` and others) to the new pages.
- `sw.js` removes the old site's offline cache for returning visitors. Keep it for a few months.

## If the domain changes

Update `site_url` in `content/site.json` and rebuild. The canonical links, sitemap, social cards
and structured data all use it.

## Social share image

`site/assets/og.png` is a screenshot of `tools/og.html`. Edit that file and re-capture it at
1200×630 if your title changes.
