// Morning digest + AI draft.
//
// 1. Collects what's new from content/sources.json (RSS, GitHub releases/commits, M365 roadmap).
// 2. Opens a GitHub issue "Daily digest — <date>" listing it.
// 3. If ANTHROPIC_API_KEY is set, asks Claude to draft ONE note (website) + LinkedIn text from it,
//    in Mohamed's voice, and opens a pull request with the draft. Nothing is published until the PR
//    is reviewed and merged. Drafts contain "[ADD: ...]" placeholders where only Mohamed can add his
//    own experience; the build refuses to publish a note that still has one.
//
// Env: GITHUB_TOKEN, REPO (owner/name), DEFAULT_BRANCH (default "main"), ANTHROPIC_API_KEY (optional),
//      DRY_RUN=1 to print instead of creating the issue / PR.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const CONFIG = read("content/sources.json");
const SITE = read("src/content/site.json");
const WORK = read("src/content/work.json");

const { GITHUB_TOKEN, REPO, ANTHROPIC_API_KEY } = process.env;
const DEFAULT_BRANCH = process.env.DEFAULT_BRANCH || "main";
const DRY = process.env.DRY_RUN === "1";
const today = new Date().toISOString().slice(0, 10);
const cutoff = Date.now() - (CONFIG.lookback_hours || 30) * 3600 * 1000;

/* ---------------------------------------------------------------- fetching */

async function get(url, { json = false, github = false } = {}) {
  const headers = { "User-Agent": "portfolio-digest" };
  if (github) {
    headers.Accept = "application/vnd.github+json";
    if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return json ? res.json() : res.text();
}

const decode = (s = "") => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&#8217;/g, "'")
  .replace(/\s+/g, " ").trim();
const tag = (block, name) => {
  const m = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i").exec(block);
  return m ? m[1] : "";
};
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

async function fromRss(src) {
  const xml = await get(src.url);
  const blocks = xml.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi) || [];
  return blocks.map((b) => {
    const atomLink = /<link[^>]*href="([^"]+)"/i.exec(b);
    return {
      title: decode(tag(b, "title")),
      url: decode(tag(b, "link")) || (atomLink ? atomLink[1] : ""),
      date: Date.parse(decode(tag(b, "pubDate") || tag(b, "updated") || tag(b, "published"))),
      summary: clip(decode(tag(b, "description") || tag(b, "summary")), 400),
    };
  });
}

async function fromReleases(src) {
  const rel = await get(`https://api.github.com/repos/${src.repo}/releases?per_page=5`, { json: true, github: true });
  return rel.map((r) => ({
    title: `${src.repo} ${r.name || r.tag_name}`,
    url: r.html_url,
    date: Date.parse(r.published_at),
    summary: clip(decode(r.body || ""), 500),
  }));
}

async function fromCommits(src) {
  const since = new Date(cutoff).toISOString();
  const commits = await get(`https://api.github.com/repos/${src.repo}/commits?since=${since}&per_page=30`, { json: true, github: true });
  return commits
    .filter((c) => !/^merge\b/i.test(c.commit.message))
    .slice(0, 10)
    .map((c) => ({
      title: c.commit.message.split("\n")[0],
      url: c.html_url,
      date: Date.parse(c.commit.committer?.date || c.commit.author?.date),
      summary: "",
    }));
}

async function fromRoadmap(src) {
  const data = await get(src.url, { json: true });
  const list = Array.isArray(data) ? data : data.value || data.items || [];
  const kw = (src.keywords || []).map((k) => k.toLowerCase());
  return list
    .map((r) => ({
      title: decode(r.title || r.Title || ""),
      url: `https://www.microsoft.com/microsoft-365/roadmap?featureid=${r.id ?? r.Id ?? ""}`,
      date: Date.parse(r.modified || r.Modified || r.created || r.Created || ""),
      summary: clip(decode(r.description || r.Description || ""), 400),
    }))
    .filter((r) => kw.length === 0 || kw.some((k) => (r.title + " " + r.summary).toLowerCase().includes(k)));
}

// One script per day from PnP Script Samples, chosen by date so every day differs.
// Read-only "get/export/list" scripts are the safest for beginners to run.
async function fromScriptOfDay(src) {
  const entries = await get(`https://api.github.com/repos/${src.repo}/contents/scripts`, { json: true, github: true });
  const names = entries.filter((e) => e.type === "dir" && src.prefixes.some((p) => e.name.startsWith(p))).map((e) => e.name).sort();
  if (!names.length) return [];
  const day = Math.floor(Date.now() / 86400000);
  const name = names[day % names.length];
  const readme = await get(`https://raw.githubusercontent.com/${src.repo}/main/scripts/${name}/README.md`);
  const title = (/^#\s+(.+)$/m.exec(readme) || [, name])[1].trim();
  const summary = (/## Summary\s+([\s\S]*?)(\n#|$)/.exec(readme) || [, ""])[1];
  return [{
    title: `${title} (${name})`,
    url: `https://pnp.github.io/script-samples/${name}/README.html`,
    date: Date.now(),
    summary: clip(decode(summary), 400) + ` Source: https://github.com/${src.repo}/tree/main/scripts/${name}`,
  }];
}

const READERS = { rss: fromRss, "github-releases": fromReleases, "github-commits": fromCommits, "m365-roadmap": fromRoadmap, "pnp-script-of-the-day": fromScriptOfDay };

async function collect() {
  const groups = [];
  const failures = [];
  await Promise.all(CONFIG.sources.map(async (src) => {
    try {
      const items = (await READERS[src.type](src))
        .filter((i) => i.title && i.url && Number.isFinite(i.date) && i.date >= cutoff)
        .sort((a, b) => b.date - a.date)
        .slice(0, 8);
      if (items.length) groups.push({ source: src.name, items });
    } catch (err) {
      failures.push(`${src.name}: ${err.message}`);
    }
  }));
  groups.sort((a, b) => a.source.localeCompare(b.source));
  return { groups, failures };
}

/* ---------------------------------------------------------------- GitHub */

async function gh(method, endpoint, body) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${endpoint}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-digest",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`GitHub ${method} ${endpoint}: ${res.status} ${data.message || ""}`);
  return data;
}

function digestMarkdown({ groups, failures }) {
  const lines = [`Things published in the last ${CONFIG.lookback_hours || 30} hours that may be worth a note or a LinkedIn post.`, ""];
  for (const g of groups) {
    lines.push(`### ${g.source}`);
    for (const i of g.items) lines.push(`- [${i.title}](${i.url})${i.summary ? ` — ${clip(i.summary, 200)}` : ""}`);
    lines.push("");
  }
  if (failures.length) lines.push("<details><summary>Sources that couldn't be read today</summary>", "", ...failures.map((f) => `- ${f}`), "", "</details>");
  lines.push("", "_Edit `content/sources.json` to change what's collected._");
  return lines.join("\n");
}

/* ---------------------------------------------------------------- AI draft */

const PROFILE = [
  `${SITE.name} — ${SITE.role}. ${SITE.location}.`,
  ...SITE.about,
  "Case studies (the only projects you may refer to as his):",
  ...WORK.map((w) => `- ${w.title} (${w.client}, ${w.region}): ${w.summary}`),
  "Skills: " + SITE.skills.map(([a, b]) => `${a}: ${b}`).join("; "),
].join("\n");

const SYSTEM = `You draft short technical notes for ${SITE.name}'s portfolio website and LinkedIn. He is a working SharePoint / Microsoft 365 architect. Readers are recruiters, hiring managers and other Microsoft 365 practitioners.

About him:
${PROFILE}

How to write:
- First person, plain and specific. Short sentences. British spelling. No hype words ("game-changer", "revolutionise", "unlock", "leverage", "elevate", "dive in", "in today's fast-paced world"), no emoji, no exclamation marks.
- Explain what changed and what it means for someone who runs a SharePoint / Microsoft 365 tenant: what to check, what to do, what to watch out for.
- Never invent experiences, clients, numbers or results. Only mention his own work if it appears in the case studies above, and only as described there.
- Where his personal experience would make the note better and you don't have it, write a placeholder exactly like: [ADD: your experience with ...]. Use one or two placeholders, not more. He fills them in before publishing.
- Quote at most one short sentence from a source. Summarise in your own words and link to the source.
- Only include code (PowerShell, PnP PowerShell, CSOM, SPFx) if you are confident it is correct for current versions. Mark every code block with a first-line comment: # Draft — test before publishing
- Note body: 300–600 words of Markdown. Use "##" subheadings. Do not repeat the title as a heading.
- LinkedIn post: under 1,200 characters, plain text, no Markdown, blank lines between short paragraphs, at most 3 hashtags at the end, and end with the line "Full note: {{URL}}" (keep {{URL}} literally).
- A "Beginner script of the day" from PnP Script Samples is included most days. Picking it is a good choice: explain what it does, who it helps, and what a beginner needs to know before running it. Credit the original author and link the sample (the library is MIT-licensed). Prefer a short simplified version over pasting the whole script.
- If nothing in today's list is genuinely useful to his audience, set skip to true and explain why in skip_reason.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["skip", "skip_reason", "title", "slug", "summary", "tags", "sources", "body_markdown", "linkedin_post", "editor_notes"],
  properties: {
    skip: { type: "boolean" },
    skip_reason: { type: "string" },
    title: { type: "string", description: "Specific, under 80 characters, no clickbait." },
    slug: { type: "string", description: "lowercase-words-with-hyphens, under 60 characters." },
    summary: { type: "string", description: "One sentence, under 200 characters." },
    tags: { type: "array", items: { type: "string" }, description: "2-4 tags such as SharePoint Online, PnP PowerShell, SPFx, Power Automate, Governance." },
    sources: { type: "array", items: { type: "string" }, description: "URLs from the list that the note is based on." },
    body_markdown: { type: "string" },
    linkedin_post: { type: "string" },
    editor_notes: { type: "string", description: "What Mohamed should check or add before publishing." },
  },
};

async function draft(digest) {
  const client = new Anthropic();
  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    // If the model declines, the API retries the same request on a fallback model.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "high", format: { type: "json_schema", schema: SCHEMA } },
    system: SYSTEM,
    messages: [{
      role: "user",
      content: `Today is ${today}. Here is what was published recently:\n\n${digest}\n\nPick the ONE item most useful to his audience and draft the note and LinkedIn post.`,
    }],
  });
  if (response.stop_reason === "refusal") {
    console.log("Draft declined by the model; skipping.");
    return null;
  }
  const text = response.content.find((b) => b.type === "text")?.text;
  if (!text) throw new Error(`No text in response (stop_reason: ${response.stop_reason})`);
  return JSON.parse(text);
}

const yamlStr = (s) => JSON.stringify(String(s)); // JSON strings are valid YAML scalars

function writeDraftFiles(d) {
  const slug = d.slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "note";
  const name = `${today}-${slug}`;
  const fm = [
    "---",
    `title: ${yamlStr(d.title)}`,
    `date: ${today}`,
    `summary: ${yamlStr(d.summary)}`,
    `tags: [${d.tags.map(yamlStr).join(", ")}]`,
    "sources:",
    ...d.sources.map((s) => `  - ${yamlStr(s)}`),
    "---",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(root, "content/posts", `${name}.md`), fm + d.body_markdown.trim() + "\n");
  fs.writeFileSync(path.join(root, "content/linkedin", `${name}.txt`), d.linkedin_post.trim() + "\n");
  return { name, slug };
}

/* ---------------------------------------------------------------- main */

const git = (...args) => execFileSync("git", args, { cwd: root, stdio: "inherit" });

const collected = await collect();
const count = collected.groups.reduce((n, g) => n + g.items.length, 0);
console.log(`Collected ${count} item(s) from ${collected.groups.length} source(s); ${collected.failures.length} failed.`);
for (const f of collected.failures) console.log("  failed:", f);

if (count === 0) {
  console.log("Nothing new today.");
  process.exit(0);
}

const digest = digestMarkdown(collected);
let issueUrl = "";
if (DRY || !GITHUB_TOKEN || !REPO) {
  console.log("\n--- digest (dry run) ---\n" + digest);
} else {
  const issue = await gh("POST", "/issues", { title: `Daily digest — ${today}`, body: digest });
  issueUrl = issue.html_url;
  console.log("Digest issue:", issueUrl);
}

if (!ANTHROPIC_API_KEY) {
  console.log("No ANTHROPIC_API_KEY secret — skipping the AI draft.");
  process.exit(0);
}

let d;
try {
  d = await draft(digest);
} catch (err) {
  // The digest is already posted; a failed draft shouldn't fail the whole run.
  console.error("Draft failed:", err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err.message);
  process.exit(0);
}
if (!d) process.exit(0);
if (d.skip) {
  console.log("Model chose not to draft today:", d.skip_reason);
  process.exit(0);
}

const { name, slug } = writeDraftFiles(d);
const siteBase = SITE.site_url.replace(/\/$/, "") + "/" + (REPO ? REPO.split("/")[1] : "");
const noteUrl = `${siteBase}/notes/${slug}/`;
const linkedin = d.linkedin_post.replace("{{URL}}", noteUrl);
fs.writeFileSync(path.join(root, "content/linkedin", `${name}.txt`), linkedin.trim() + "\n");

if (DRY || !GITHUB_TOKEN || !REPO) {
  console.log(`\n--- draft written: content/posts/${name}.md ---\n`);
  process.exit(0);
}

const branch = `drafts/${name}`;
git("config", "user.name", "github-actions[bot]");
git("config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com");
git("checkout", "-b", branch);
git("add", "content/posts", "content/linkedin");
git("commit", "-m", `Draft note: ${d.title}`);
git("push", "origin", branch);

const placeholders = (d.body_markdown.match(/\[ADD:[^\]]*\]/g) || []).length;
const pr = await gh("POST", "/pulls", {
  title: `Draft note: ${d.title}`,
  head: branch,
  base: DEFAULT_BRANCH,
  body: [
    `AI draft from today's digest${issueUrl ? ` (${issueUrl})` : ""}. **Nothing is published until you merge this.**`,
    "",
    "### Before merging",
    `- [ ] Replace the ${placeholders} \`[ADD: …]\` placeholder(s) with your own experience (the build won't publish a note that still has one)`,
    "- [ ] Read it as if you were a hiring manager: is every claim true?",
    "- [ ] Test any code block, then delete the `# Draft — test before publishing` line",
    "",
    "Edit the file in this PR (`Files changed` → `…` → `Edit file`), then **Merge**. The site updates a minute later.",
    "",
    "### Notes from the drafter",
    d.editor_notes || "—",
    "",
    "### LinkedIn post (copy after merging)",
    "```",
    linkedin.trim(),
    "```",
  ].join("\n"),
});
console.log("Draft PR:", pr.html_url);
