#!/usr/bin/env python3
"""Build the static site in ./site from ./content/*.json.

Edit content/site.json or content/work.json, then run:

    python3 tools/build.py

No dependencies beyond the Python standard library.
"""
import json
import os
from datetime import date
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "site"
S = json.loads((ROOT / "content/site.json").read_text(encoding="utf-8"))
WORK = json.loads((ROOT / "content/work.json").read_text(encoding="utf-8"))
URL = S["site_url"].rstrip("/")
TODAY = date.today().isoformat()
YEAR = date.today().year

FONTS = (
    "https://fonts.googleapis.com/css2?"
    "family=IBM+Plex+Mono:wght@400;500&"
    "family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&"
    "family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap"
)

NAV = [("/work/", "Work"), ("/services/", "Services"), ("/about/", "About"), ("/contact/", "Contact")]


def e(s):
    return escape(str(s), quote=True)


def mailto(subject):
    from urllib.parse import quote
    return f"mailto:{S['email']}?subject={quote(subject)}"


def ld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False).replace("</", "<\\/") + "</script>"


PERSON = {
    "@type": "Person",
    "@id": f"{URL}/#person",
    "name": S["name"],
    "jobTitle": S["role"],
    "url": f"{URL}/",
    "image": f"{URL}/assets/img/portrait-card-hero.jpg",
    "email": f"mailto:{S['email']}",
    "sameAs": [S["linkedin"]],
    "address": {"@type": "PostalAddress", "addressLocality": "Abha", "addressCountry": "SA"},
    "worksFor": {"@type": "Organization", "name": "Al Qahtani Beverages"},
    "alumniOf": {"@type": "CollegeOrUniversity", "name": "Anna University"},
    "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "name": "PL-900: Microsoft Power Platform Fundamentals",
        "credentialCategory": "certification",
    },
    "knowsAbout": [
        "SharePoint Online", "Microsoft 365", "Power Apps", "Power Automate", "SharePoint Framework (SPFx)",
        "Google Workspace to Microsoft 365 migration", "InfoPath modernisation", "Microsoft Entra ID",
        "Conditional Access", "Azure OpenAI",
    ],
}

SERVICE = {
    "@type": "ProfessionalService",
    "@id": f"{URL}/#service",
    "name": f"{S['name']} — Microsoft 365 consulting",
    "url": f"{URL}/services/",
    "image": f"{URL}/assets/og.png",
    "founder": {"@id": f"{URL}/#person"},
    "areaServed": "Worldwide",
    "priceRange": "$35+/hour",
    "email": S["email"],
    "address": {"@type": "PostalAddress", "addressLocality": "Abha", "addressCountry": "SA"},
    "makesOffer": [
        {
            "@type": "Offer",
            "name": o["name"],
            "description": o["text"],
            **({"price": "35", "priceCurrency": "USD"} if o["price"] == "$35" else {}),
        }
        for o in S["offers"]
    ],
}


def crumbs(items):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": n, "item": f"{URL}{p}"} for i, (p, n) in enumerate(items)
        ],
    }


def page(path, title, description, body, schema=None, current=None, og_type="website"):
    canonical = f"{URL}{path}"
    robots = '\n<meta name="robots" content="noindex">' if path in ("/thanks/", "/404.html") else ""
    graph = {"@context": "https://schema.org", "@graph": [PERSON] + (schema or [])}
    nav = "".join(
        f'<a href="{href}"{" aria-current=\"page\"" if href == current else ""}>{label}</a>' for href, label in NAV
    )
    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(description)}">
<link rel="canonical" href="{canonical}">{robots}
<meta name="author" content="{e(S['name'])}">
<meta name="theme-color" content="#f5f1e8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#161513" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="{e(S['name'])}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(description)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{URL}/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<link rel="stylesheet" href="/assets/style.css">
{ld(graph)}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="wrap top-in">
    <a class="brand" href="/"><span class="brand-mark" aria-hidden="true">MS</span><span>{e(S['name'])}</span></a>
    <nav aria-label="Main">{nav}</nav>
  </div>
</header>
<main id="main">
{body}
</main>
<footer class="foot">
  <div class="wrap foot-in">
    <div>
      <p class="foot-name">{e(S['name'])}</p>
      <p>{e(S['role'])}<br>{e(S['location'])} · working worldwide</p>
    </div>
    <div class="foot-links">
      <a href="mailto:{e(S['email'])}">{e(S['email'])}</a>
      <a href="{e(S['linkedin'])}" rel="me noopener" target="_blank">LinkedIn</a>
    </div>
    <p class="foot-small">© {YEAR} {e(S['name'])}. No cookies, no trackers.</p>
  </div>
</footer>
<script src="/assets/site.js" defer></script>
</body>
</html>
"""
    target = OUT / path.lstrip("/") / "index.html" if path.endswith("/") else OUT / path.lstrip("/")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(html, encoding="utf-8")


def portrait(cls="portrait"):
    return (
        f'<picture class="{cls}">'
        '<source type="image/webp" srcset="/assets/img/portrait-card-320.webp 320w, /assets/img/portrait-card-560.webp 560w, '
        '/assets/img/portrait-card-760.webp 760w" sizes="(max-width: 700px) 60vw, 300px">'
        f'<img src="/assets/img/portrait-card-hero.jpg" width="760" height="962" alt="Portrait of {e(S["name"])}" '
        'decoding="async">'
        "</picture>"
    )


def status_block():
    return f"""<dl class="status">
  <div><dt>Now</dt><dd>{e(S['current'])}</dd></div>
  <div><dt>Taking on</dt><dd>{e(S['availability']['short'])}</dd></div>
  <div><dt>Local time</dt><dd><span data-clock data-tz="{e(S['timezone'])}">—</span> in {e(S['location'].split(',')[0])}</dd></div>
</dl>"""


def work_rows(items):
    rows = []
    for i, w in enumerate(items, 1):
        rows.append(
            f"""<li class="row">
  <a href="/work/{w['slug']}/">
    <span class="row-no">{i:02d}</span>
    <span class="row-main">
      <span class="row-title">{e(w['title'])}</span>
      <span class="row-meta">{e(w['kind'])} · {e(w['client'])} · {e(w['region'])}</span>
    </span>
    <span class="row-result">{e(w['result'])}</span>
  </a>
</li>"""
        )
    return '<ol class="rows">' + "\n".join(rows) + "</ol>"


def offers_block():
    out = []
    for o in S["offers"]:
        out.append(
            f"""<article class="offer">
  <h3>{e(o['name'])}</h3>
  <p class="price"><strong>{e(o['price'])}</strong> {e(o['unit'])}</p>
  <p>{e(o['text'])}</p>
  <a class="link" href="/contact/?topic={e(o['subject'])}">{e(o['cta'])} →</a>
</article>"""
        )
    return '<div class="offers">' + "".join(out) + "</div>"


def help_block():
    return '<dl class="help">' + "".join(
        f"<div><dt>{e(t)}</dt><dd>{e(d)}</dd></div>" for t, d in S["help_with"]
    ) + "</dl>"


def timeline_block():
    return '<ol class="timeline">' + "".join(
        f'<li><span class="tl-when">{e(when)}</span><div><h3>{e(role)}</h3><p class="tl-org">{e(org)}</p><p>{e(text)}</p></div></li>'
        for when, role, org, text in S["timeline"]
    ) + "</ol>"


def cta(text="Have a SharePoint or Microsoft 365 problem, or a role abroad you think I'd fit?"):
    return f"""<section class="cta">
  <div class="wrap">
    <p class="cta-text">{e(text)}</p>
    <p class="cta-actions"><a class="btn" href="/contact/">Get in touch</a>
    <a class="link" href="mailto:{e(S['email'])}">or email {e(S['email'])}</a></p>
  </div>
</section>"""


# ---------------------------------------------------------------- pages

def build_home():
    intro = "".join(f"<p>{e(p)}</p>" for p in S["intro"])
    numbers = "".join(f"<li><strong>{e(n)}</strong><span>{e(t)}</span></li>" for n, t in S["numbers"])
    body = f"""
<section class="hero wrap">
  <div class="hero-text">
    <p class="kicker">{e(S['role'])}</p>
    <h1>{e(S['headline'])}</h1>
    <div class="lede">{intro}</div>
    <p class="hero-actions"><a class="btn" href="/contact/">Start a conversation</a> <a class="link" href="/work/">See the work →</a></p>
  </div>
  <aside class="hero-side">
    {portrait()}
    {status_block()}
  </aside>
</section>

<section class="wrap band">
  <ul class="numbers">{numbers}</ul>
</section>

<section class="wrap section">
  <div class="section-head">
    <h2>Selected work</h2>
    <p>Real projects, written up plainly. Some clients are named, some aren't allowed to be.</p>
  </div>
  {work_rows(WORK[:5])}
  <p class="more"><a class="link" href="/work/">All {len(WORK)} case studies →</a></p>
</section>

<section class="wrap section split">
  <div class="section-head">
    <h2>What I help with</h2>
    <p>Mostly SharePoint and the things around it.</p>
  </div>
  {help_block()}
</section>

<section class="wrap section">
  <div class="section-head">
    <h2>Ways to work together</h2>
    <p>Start with a one-hour call if you're not sure what you need.</p>
  </div>
  {offers_block()}
</section>

<section class="wrap section split">
  <div class="section-head">
    <h2>Where I've been</h2>
    <p>{e(S['availability']['remote'])} {e(S['availability']['relocation'])}</p>
    <p><a class="link" href="/about/">More about me →</a></p>
  </div>
  {timeline_block()}
</section>
{cta()}
"""
    page("/", S["home_title"], S["home_description"], body, [SERVICE, {"@type": "WebSite", "url": f"{URL}/", "name": S["name"]}])


def build_work_index():
    body = f"""
<section class="wrap page-head">
  <p class="kicker">Work</p>
  <h1>Case studies</h1>
  <p class="lede-one">Migrations, security fixes, legacy rebuilds and new apps across the US, UK, Canada and the Gulf. Each one says what was wrong, what I did, and what changed.</p>
</section>
<section class="wrap section">
  {work_rows(WORK)}
</section>
{cta("Got something similar going on?")}
"""
    schema = [
        crumbs([("/", "Home"), ("/work/", "Work")]),
        {
            "@type": "ItemList",
            "itemListElement": [
                {"@type": "ListItem", "position": i + 1, "url": f"{URL}/work/{w['slug']}/", "name": w["title"]}
                for i, w in enumerate(WORK)
            ],
        },
    ]
    page("/work/", f"Case studies — {S['name']}", "SharePoint and Microsoft 365 case studies: a 5,000-user Google Workspace migration, a SharePoint data leak fix, InfoPath to SPFx, Power Platform apps and more.", body, schema, "/work/")


def build_case(i, w):
    prev_w = WORK[i - 1] if i > 0 else None
    next_w = WORK[i + 1] if i + 1 < len(WORK) else None
    sit = "".join(f"<p>{e(p)}</p>" for p in w["situation"])
    did = "".join(f"<li>{e(p)}</li>" for p in w["work"])
    out = "".join(f"<li>{e(p)}</li>" for p in w["outcome"])
    stack = "".join(f"<li>{e(t)}</li>" for t in w["stack"])
    pager = '<nav class="pager" aria-label="More case studies">'
    pager += f'<a href="/work/{prev_w["slug"]}/"><span>Previous</span>{e(prev_w["title"])}</a>' if prev_w else "<span></span>"
    pager += f'<a class="next" href="/work/{next_w["slug"]}/"><span>Next</span>{e(next_w["title"])}</a>' if next_w else "<span></span>"
    pager += "</nav>"
    body = f"""
<article class="case">
  <header class="wrap page-head">
    <p class="kicker"><a href="/work/">Work</a> / {e(w['kind'])}</p>
    <h1>{e(w['title'])}</h1>
    <p class="lede-one">{e(w['summary'])}</p>
    <dl class="facts">
      <div><dt>Client</dt><dd>{e(w['client'])}</dd></div>
      <div><dt>Where</dt><dd>{e(w['region'])}</dd></div>
      <div><dt>Length</dt><dd>{e(w['duration'])}</dd></div>
      <div><dt>Result</dt><dd>{e(w['result'])}</dd></div>
    </dl>
  </header>
  <div class="wrap case-body">
    <section><h2>The situation</h2>{sit}</section>
    <section><h2>What I did</h2><ul class="ticks">{did}</ul></section>
    <section><h2>What changed</h2><ul class="ticks">{out}</ul></section>
    <section><h2>Tools</h2><ul class="tags">{stack}</ul></section>
  </div>
  <div class="wrap">{pager}</div>
</article>
{cta("Dealing with something like this?")}
"""
    schema = [
        crumbs([("/", "Home"), ("/work/", "Work"), (f"/work/{w['slug']}/", w["title"])]),
        {
            "@type": "Article",
            "headline": w["title"],
            "description": w["summary"],
            "author": {"@id": f"{URL}/#person"},
            "image": f"{URL}/assets/og.png",
            "mainEntityOfPage": f"{URL}/work/{w['slug']}/",
            "about": w["stack"],
        },
    ]
    page(f"/work/{w['slug']}/", f"{w['title']} — {S['name']}", w["summary"], body, schema, "/work/", "article")


def build_services():
    skills = "".join(f"<div><dt>{e(a)}</dt><dd>{e(b)}</dd></div>" for a, b in S["skills"])
    body = f"""
<section class="wrap page-head">
  <p class="kicker">Services</p>
  <h1>SharePoint, Power Platform and Microsoft 365 consulting</h1>
  <p class="lede-one">I work with companies directly, remotely, in any time zone. Small calls, fixed-scope projects, or ongoing support — whichever fits.</p>
</section>
<section class="wrap section">
  {offers_block()}
</section>
<section class="wrap section split">
  <div class="section-head"><h2>What I help with</h2></div>
  {help_block()}
</section>
<section class="wrap section split">
  <div class="section-head"><h2>Toolkit</h2><p>What I use week to week.</p></div>
  <dl class="help">{skills}</dl>
</section>
<section class="wrap section split">
  <div class="section-head"><h2>How a first call goes</h2></div>
  <div class="prose">
    <p>Send me a few lines about what's going on — what you run on Microsoft 365, what's broken or slow, and any deadline. I'll reply with a time that works across our time zones.</p>
    <p>On the call we go through it together. Afterwards you get a short written summary: what I'd fix first, roughly how long it takes, and whether you need me for it or can do it in-house.</p>
  </div>
</section>
{cta()}
"""
    page("/services/", f"SharePoint & Microsoft 365 consulting — {S['name']}", "Hire a SharePoint and Microsoft 365 consultant: $35/hour review calls, SPFx and Power Apps projects, migrations, security remediation and ongoing support. Remote, worldwide.", body, [SERVICE, crumbs([("/", "Home"), ("/services/", "Services")])], "/services/")


def build_about():
    about = "".join(f"<p>{e(p)}</p>" for p in S["about"])
    creds = "".join(f"<div><dt>{e(a)}</dt><dd>{e(b)}</dd></div>" for a, b in S["credentials"])
    body = f"""
<section class="wrap page-head about-head">
  <div>
    <p class="kicker">About</p>
    <h1>Hi, I'm Shafeek.</h1>
    <div class="prose">{about}</div>
  </div>
  <aside>{portrait()}{status_block()}</aside>
</section>
<section class="wrap section split">
  <div class="section-head"><h2>Experience</h2></div>
  {timeline_block()}
</section>
<section class="wrap section split">
  <div class="section-head"><h2>Credentials</h2></div>
  <dl class="help">{creds}</dl>
</section>
<section class="wrap section split">
  <div class="section-head"><h2>Where I'll work</h2></div>
  <div class="prose">
    <p>{e(S['availability']['remote'])}</p>
    <p>{e(S['availability']['relocation'])}</p>
    <p>I've already delivered for teams in the US, UK, Canada, the UAE and Saudi Arabia, so working across borders and time zones is normal for me.</p>
  </div>
</section>
{cta()}
"""
    page("/about/", f"About — {S['name']}, Microsoft 365 consultant", f"{S['name']}: five years in SharePoint and Microsoft 365 at Avasoft, Colan InfoTech, EY GDS and Al Qahtani Beverages. Open to consulting and roles abroad.", body, [crumbs([("/", "Home"), ("/about/", "About")]), {"@type": "ProfilePage", "mainEntity": {"@id": f"{URL}/#person"}}], "/about/", "profile")


def build_contact():
    topics = ["Microsoft 365 review call", "Career guidance call", "Project enquiry", "Ongoing support enquiry", "Job or contract role", "Something else"]
    opts = "".join(f"<option>{e(t)}</option>" for t in topics)
    body = f"""
<section class="wrap page-head contact">
  <div>
    <p class="kicker">Contact</p>
    <h1>Tell me what you're working on.</h1>
    <p class="lede-one">A few lines is plenty. I read every message myself.</p>
    <dl class="facts facts-col">
      <div><dt>Email</dt><dd><a href="mailto:{e(S['email'])}">{e(S['email'])}</a></dd></div>
      <div><dt>LinkedIn</dt><dd><a href="{e(S['linkedin'])}" rel="me noopener" target="_blank">linkedin.com/in/mdshafeek</a></dd></div>
      <div><dt>Based in</dt><dd>{e(S['location'])}</dd></div>
      <div><dt>Local time</dt><dd><span data-clock data-tz="{e(S['timezone'])}">—</span></dd></div>
      <div><dt>Open to</dt><dd>Remote consulting worldwide, contracts, and full-time roles abroad (relocating with family)</dd></div>
    </dl>
  </div>
  <form class="form" name="contact" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="company_website">
    <input type="hidden" name="form-name" value="contact">
    <p class="hp"><label>Leave this empty <input name="company_website" tabindex="-1" autocomplete="off"></label></p>
    <label>Your name<input name="name" autocomplete="name" required></label>
    <label>Email<input name="email" type="email" autocomplete="email" required></label>
    <label><span>Company <span class="opt">(optional)</span></span><input name="company" autocomplete="organization"></label>
    <label>What's this about?<select name="topic" id="topic">{opts}</select></label>
    <label>Message<textarea name="message" rows="6" required placeholder="What you run on Microsoft 365, what's not working, any deadline."></textarea></label>
    <button class="btn" type="submit">Send message</button>
    <p class="form-note">Goes straight to my inbox. Prefer email? <a href="mailto:{e(S['email'])}">{e(S['email'])}</a></p>
  </form>
</section>
"""
    page("/contact/", f"Contact — {S['name']}", "Contact Mohamed Shafeek for SharePoint, Power Apps and Microsoft 365 consulting, projects, or roles abroad.", body, [crumbs([("/", "Home"), ("/contact/", "Contact")]), {"@type": "ContactPage", "url": f"{URL}/contact/"}], "/contact/")

    page("/thanks/", f"Thanks — {S['name']}", "Message sent.", f"""
<section class="wrap page-head narrow">
  <p class="kicker">Message sent</p>
  <h1>Thanks — I've got it.</h1>
  <p class="lede-one">I'll reply from {e(S['email'])} as soon as I can. If it's urgent, LinkedIn works too.</p>
  <p><a class="link" href="/work/">Meanwhile, have a look at the work →</a></p>
</section>""")


def build_404():
    page("/404.html", f"Page not found — {S['name']}", "Page not found.", """
<section class="wrap page-head narrow">
  <p class="kicker">404</p>
  <h1>That page isn't here.</h1>
  <p class="lede-one">The site was rebuilt recently, so an old link may have moved.</p>
  <p><a class="link" href="/">Home</a> · <a class="link" href="/work/">Work</a> · <a class="link" href="/contact/">Contact</a></p>
</section>""")


def build_meta():
    paths = ["/", "/work/", "/services/", "/about/", "/contact/"] + [f"/work/{w['slug']}/" for w in WORK]
    urls = "".join(f"<url><loc>{URL}{p}</loc><lastmod>{TODAY}</lastmod></url>" for p in paths)
    (OUT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n',
        encoding="utf-8",
    )
    (OUT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nDisallow: /thanks/\n\nSitemap: {URL}/sitemap.xml\n", encoding="utf-8")
    llms = [
        f"# {S['name']}", "", f"> {S['role']} based in {S['location']}. {S['availability']['remote']} {S['availability']['relocation']}", "",
        "## Pages", f"- [Work]({URL}/work/)", f"- [Services]({URL}/services/)", f"- [About]({URL}/about/)", f"- [Contact]({URL}/contact/)", "",
        "## Case studies",
    ] + [f"- [{w['title']}]({URL}/work/{w['slug']}/): {w['summary']}" for w in WORK] + [
        "", "## Contact", f"- Email: {S['email']}", f"- LinkedIn: {S['linkedin']}", "",
    ]
    (OUT / "llms.txt").write_text("\n".join(llms), encoding="utf-8")


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    build_home()
    build_work_index()
    for i, w in enumerate(WORK):
        build_case(i, w)
    build_services()
    build_about()
    build_contact()
    build_404()
    build_meta()
    print(f"Built {len(WORK) + 7} pages into {OUT.relative_to(ROOT)}/")
