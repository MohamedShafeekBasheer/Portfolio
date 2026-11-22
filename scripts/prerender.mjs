// Turns the React app into static HTML for every route, plus sitemap,
// robots.txt, RSS, llms.txt and a versioned service worker.
// Works at a domain root or under a sub-path (GitHub Pages project sites).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, meta, jsonLd, ROUTES, WORK, SITE, POSTS, URL_BASE, BASE, findPost } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const assets = fs.readdirSync(path.join(dist, "assets"));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// GitHub Pages can't send security headers, so the policy goes in a meta tag.
const CSP = [
  "default-src 'self'", "script-src 'self'", "style-src 'self'",
  `img-src 'self' data:${SITE.goatcounter_code ? ` https://${SITE.goatcounter_code}.goatcounter.com` : ""}`, "font-src 'self'",
  "connect-src 'self' https://formspree.io", "form-action 'self' https://formspree.io mailto:",
  "base-uri 'self'", "object-src 'none'", "manifest-src 'self'", "worker-src 'self'",
].join("; ");

function head(m) {
  const url = `${URL_BASE}${m.path === "/404.html" ? "/" : m.path}`;
  return [
    `<meta http-equiv="Content-Security-Policy" content="${CSP}">`,
    `<meta name="referrer" content="strict-origin-when-cross-origin">`,
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}">`,
    m.noindex ? `<meta name="robots" content="noindex">` : `<link rel="canonical" href="${url}">`,
    `<meta name="author" content="${esc(SITE.name)}">`,
    `<meta property="og:type" content="${m.ogType}">`,
    `<meta property="og:site_name" content="${esc(SITE.name)}">`,
    `<meta property="og:title" content="${esc(m.title)}">`,
    `<meta property="og:description" content="${esc(m.description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${URL_BASE}/og.png">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<link rel="alternate" type="application/rss+xml" title="${esc(SITE.name)} — Notes" href="${URL_BASE}/notes/rss.xml">`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd(m)).replace(/</g, "\\u003c")}</script>`,
  ].join("\n");
}

function readNote(slug) {
  return JSON.parse(fs.readFileSync(path.join(dist, "notes-data", `${slug}.json`), "utf8"));
}

function write(route, file) {
  const m = meta(route);
  const post = findPost(route);
  const note = post ? readNote(post.slug) : null;
  let body = render(route, note);
  // Embed the note so the browser hydrates it without another request.
  if (note) body += `\n<script id="note-data" type="application/json">${JSON.stringify(note).replace(/</g, "\\u003c")}</script>`;
  const html = template.replace("<!--app-head-->", head(m)).replace("<!--app-html-->", body);
  const out = path.join(dist, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

for (const r of ROUTES) write(r, path.join(r, "index.html"));

// Bing Site Scan flags titles over 70 characters and descriptions outside 25-160.
for (const r of [...ROUTES, "/404.html"]) {
  const { title, description } = meta(r);
  if (title.length > 70) console.warn(`SEO: title is ${title.length} chars on ${r}`);
  if (description.length < 25 || description.length > 160) console.warn(`SEO: description is ${description.length} chars on ${r}`);
}
write("/404.html", "404.html");

// sitemap + robots
const today = new Date().toISOString().slice(0, 10);
const indexable = ROUTES.filter((r) => !meta(r).noindex);
const lastmod = (r) => findPost(r)?.date || today;
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    indexable.map((r) => `  <url><loc>${URL_BASE}${r}</loc><lastmod>${lastmod(r)}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`,
);
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: ${BASE}thanks/\n\nSitemap: ${URL_BASE}/sitemap.xml\n`);

// RSS feed for notes
const rssItems = POSTS.slice(0, 30).map((p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${URL_BASE}/notes/${p.slug}/</link>
    <guid isPermaLink="true">${URL_BASE}/notes/${p.slug}/</guid>
    <pubDate>${new Date(p.date + "T06:00:00Z").toUTCString()}</pubDate>
    <description>${esc(p.summary)}</description>
  </item>`).join("\n");
fs.mkdirSync(path.join(dist, "notes"), { recursive: true });
fs.writeFileSync(path.join(dist, "notes", "rss.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${esc(SITE.name)} — Notes</title>
  <link>${URL_BASE}/notes/</link>
  <description>Notes on SharePoint, Power Platform and Microsoft 365.</description>
  <language>en</language>
${rssItems}
</channel></rss>
`);

// llms.txt — a plain-text profile that AI assistants and answer engines read.
const pairs = (rows) => rows.map(([a, b]) => `- ${a}: ${b}`);
fs.writeFileSync(
  path.join(dist, "llms.txt"),
  [
    `# ${SITE.name}`, "",
    `> ${SITE.role} based in ${SITE.location}. ${SITE.home_description}`, "",
    `Also known as: ${SITE.alternate_names.join(", ")}.`, "",
    "## Summary", ...SITE.about, "",
    "## Quick facts", ...pairs(SITE.quick_facts), "",
    "## Roles open to", ...SITE.target_roles.map((r) => `- ${r}`), `Locations: ${SITE.target_locations}`, "",
    "## Skills", ...pairs(SITE.keyword_groups), "",
    "## Experience", ...SITE.timeline.map(([when, role, org, text]) => `- ${when}: ${role}, ${org}. ${text}`), "",
    "## Pages", ...["hire", "work", "notes", "services", "about", "contact"].map((p) => `- [${p}](${URL_BASE}/${p}/)`), `- [CV (PDF)](${URL_BASE}${SITE.cv_url})`, "",
    "## Case studies", ...WORK.map((w) => `- [${w.title}](${URL_BASE}/work/${w.slug}/): ${w.summary}`), "",
    ...(POSTS.length ? ["## Notes", ...POSTS.slice(0, 20).map((p) => `- [${p.title}](${URL_BASE}/notes/${p.slug}/): ${p.summary}`), ""] : []),
    "## Contact", `- Email: ${SITE.email}`, `- LinkedIn: ${SITE.linkedin}`, `- GitHub: ${SITE.github}`, `- Website: ${URL_BASE}/`, "",
  ].join("\n"),
);

// Service worker, versioned by the build so each deploy replaces the old cache.
const precache = ["", "work/", "notes/", "hire/", "services/", "about/", "contact/", "404.html", ...assets.map((a) => `assets/${a}`)]
  .map((p) => BASE + p);
const version = crypto.createHash("sha1").update(precache.join() + template + POSTS.map((p) => p.slug).join()).digest("hex").slice(0, 10);
const sw = fs.readFileSync(path.join(root, "scripts/sw.template.js"), "utf8")
  .replace("__VERSION__", version)
  .replace("__BASE__", JSON.stringify(BASE))
  .replace("__PRECACHE__", JSON.stringify(precache));
fs.writeFileSync(path.join(dist, "sw.js"), sw);

fs.rmSync(ssrDir, { recursive: true, force: true });
fs.rmSync(path.join(dist, ".vite"), { recursive: true, force: true });
console.log(`Prerendered ${ROUTES.length + 1} pages (base ${BASE}) · ${POSTS.length} notes · sw ${version}`);
