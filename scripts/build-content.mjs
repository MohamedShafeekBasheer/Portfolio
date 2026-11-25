// Turns content/posts/*.md (YAML front matter + Markdown) into:
//   src/content/posts.json        — list of published notes (metadata only, bundled into the app)
//   public/notes-data/<slug>.json — full note with rendered HTML (fetched or embedded per page)
// Runs before every build. A post with `draft: true` is skipped, and so is a
// post dated in the future (UTC+3): the daily scheduled deploy publishes
// it on its date. Set SHOW_FUTURE_NOTES=1 to preview them locally.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { marked } from "marked";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "content/posts");
const outDir = path.join(root, "public/notes-data");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const files = fs.existsSync(srcDir) ? fs.readdirSync(srcDir).filter((f) => f.endsWith(".md")) : [];
const posts = [];
// "Today" in UTC+3 (GCC time, no daylight saving), so a note goes live on its date there.
const today = new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10);
const showFuture = process.env.SHOW_FUTURE_NOTES === "1";
let scheduled = 0;

for (const file of files) {
  const raw = fs.readFileSync(path.join(srcDir, file), "utf8");
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) { console.warn(`skip ${file}: no front matter`); continue; }
  const fm = parseYaml(m[1]) || {};
  if (fm.draft === true) continue;
  const base = file.replace(/\.md$/, "");
  const slug = (fm.slug || base.replace(/^\d{4}-\d{2}-\d{2}-/, "")).toString().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const date = fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : String(fm.date || base.slice(0, 10));
  if (!fm.title) { console.warn(`skip ${file}: no title`); continue; }
  if (date > today && !showFuture) { scheduled++; continue; }
  // Safety net for AI drafts: never publish a note that still has an "[ADD: ...]" placeholder.
  if (/\[ADD:/.test(m[2])) { console.warn(`skip ${file}: still has an [ADD: ...] placeholder`); continue; }
  // Root-relative links/images ("/img/notes/x.png") need the site's base path on GitHub Pages.
  const siteBase = (process.env.SITE_BASE || "/").replace(/\/?$/, "/");
  const html = marked.parse(m[2], { gfm: true }).replace(/(src|href)="\/(?!\/)/g, `$1="${siteBase}`);
  const meta = {
    slug, date,
    title: String(fm.title),
    summary: String(fm.summary || ""),
    ...(fm.description ? { description: String(fm.description) } : {}),
    tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
    sources: Array.isArray(fm.sources) ? fm.sources.map(String) : [],
  };
  posts.push(meta);
  fs.writeFileSync(path.join(outDir, `${slug}.json`), JSON.stringify({ ...meta, html }));
}

posts.sort((a, b) => (a.date < b.date ? 1 : -1));
fs.writeFileSync(path.join(root, "src/content/posts.json"), JSON.stringify(posts, null, 1));
console.log(`content: ${posts.length} published note(s), ${scheduled} scheduled for later`);
