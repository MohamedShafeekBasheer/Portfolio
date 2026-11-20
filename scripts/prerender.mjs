// Turns the React app into static HTML for every route, plus sitemap,
// robots.txt, llms.txt and a versioned service worker.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, meta, jsonLd, ROUTES, WORK, SITE, URL_BASE } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const assets = fs.readdirSync(path.join(dist, "assets"));


const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function head(m) {
  const url = `${URL_BASE}${m.path === "/404.html" ? "/" : m.path}`;
  return [
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
    `<script type="application/ld+json">${JSON.stringify(jsonLd(m)).replace(/</g, "\\u003c")}</script>`,
  ].join("\n");
}

function write(route, file) {
  const m = meta(route);
  const html = template
    .replace("<!--app-head-->", head(m))
    .replace("<!--app-html-->", render(route === "/404.html" ? "/404.html" : route));
  const out = path.join(dist, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

for (const r of ROUTES) write(r, path.join(r, "index.html"));
write("/404.html", "404.html");

// sitemap + robots + llms.txt
const today = new Date().toISOString().slice(0, 10);
const indexable = ROUTES.filter((r) => !meta(r).noindex);
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    indexable.map((r) => `  <url><loc>${URL_BASE}${r}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`,
);
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /thanks/\n\nSitemap: ${URL_BASE}/sitemap.xml\n`);
fs.writeFileSync(
  path.join(dist, "llms.txt"),
  [
    `# ${SITE.name}`, "",
    `> ${SITE.role} based in ${SITE.location}. ${SITE.availability.remote} ${SITE.availability.relocation}`, "",
    "## Pages", ...["work", "services", "about", "contact"].map((p) => `- [${p[0].toUpperCase() + p.slice(1)}](${URL_BASE}/${p}/)`), "",
    "## Case studies", ...WORK.map((w) => `- [${w.title}](${URL_BASE}/work/${w.slug}/): ${w.summary}`), "",
    "## Contact", `- Email: ${SITE.email}`, `- LinkedIn: ${SITE.linkedin}`, "",
  ].join("\n"),
);

// Service worker, versioned by the build so each deploy replaces the old cache.
const precache = ["/", "/work/", "/services/", "/about/", "/contact/", "/404.html", ...assets.map((a) => `/assets/${a}`)];
const version = crypto.createHash("sha1").update(precache.join() + template).digest("hex").slice(0, 10);
const sw = fs.readFileSync(path.join(root, "scripts/sw.template.js"), "utf8")
  .replace("__VERSION__", version)
  .replace("__PRECACHE__", JSON.stringify(precache));
fs.writeFileSync(path.join(dist, "sw.js"), sw);

fs.rmSync(ssrDir, { recursive: true, force: true });
fs.rmSync(path.join(dist, ".vite"), { recursive: true, force: true });
console.log(`Prerendered ${ROUTES.length + 1} pages · sw ${version}`);
