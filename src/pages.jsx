import { useEffect, useState } from "react";
import { Link, useRouter } from "./router.jsx";
import { POSTS, SITE, WORK, findCase, findPost, withBase } from "./data.js";
import { getCachedNote, loadNote } from "./notes.js";
import { AuthorBox, Portrait, statusText } from "./components.jsx";

const fmtDate = (d, opts = { day: "numeric", month: "short", year: "numeric" }) => {
  try { return new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { ...opts, timeZone: "UTC" }); }
  catch { return d; }
};
const readMins = (html) => Math.max(1, Math.round(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200));

function NoteList({ items, summaries = true }) {
  return (
    <ul className="list">
      {items.map((p) => (
        <li key={p.slug}>
          <span className="list-date">{fmtDate(p.date, { day: "numeric", month: "short" })}</span>
          <span>
            <Link href={`/notes/${p.slug}/`}>{p.title}</Link>
            {summaries && p.summary && <span className="list-sub">{p.summary}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

function WorkList({ items }) {
  return (
    <ul className="list list-plain">
      {items.map((w) => (
        <li key={w.slug}>
          <Link href={`/work/${w.slug}/`}>{w.title}</Link>
          <span className="list-sub">{w.client} · {w.region} · {w.result}</span>
        </li>
      ))}
    </ul>
  );
}

function Experience() {
  return (
    <ul className="list">
      {SITE.timeline.map(([when, role, org, text]) => (
        <li key={when + org}>
          <span className="list-date">{when}</span>
          <span><strong>{role}</strong>, {org}<span className="list-sub">{text}</span></span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- home */

function Home() {
  return (
    <div className="column page">
      <section className="intro">
        <Portrait size={88} eager />
        <div>
          <h1 className="intro-title">I build and look after SharePoint and Microsoft 365 for companies that depend on it.</h1>
        </div>
      </section>
      <p className="lede">I'm {SITE.name}. Right now I run SharePoint, Microsoft 365 and the Power Platform on my own for a five-company industrial group in Saudi Arabia: seven production systems in the last twelve months. Before that I was at EY Global Delivery Services and Avasoft, working for clients in the US, UK, Canada and the Gulf.</p>
      <p>I'm open to SharePoint developer, Microsoft 365 consultant and Power Platform roles in Saudi Arabia, the wider GCC, Singapore or India, and I take on consulting work. <Link href="/hire/">Here's what recruiters usually ask for</Link>, or <Link href="/contact/">get in touch</Link>.</p>

      <h2>Recent work</h2>
      <WorkList items={WORK.slice(0, 5)} />
      <p><Link href="/work/">All {WORK.length} case studies →</Link></p>

      {POSTS.length > 0 && (
        <>
          <h2>Notes</h2>
          <NoteList items={POSTS.slice(0, 4)} summaries={false} />
          <p><Link href="/notes/">All notes →</Link></p>
        </>
      )}

      <h2>Working with me</h2>
      <p>For a one-off question, I do one-hour review calls at $35. For bigger pieces of work (a migration, an InfoPath retirement, a security clean-up, an SPFx build) I quote per project. <Link href="/services/">More about consulting</Link>.</p>
    </div>
  );
}

/* ---------------------------------------------------------------- work */

function Work() {
  return (
    <div className="column page">
      <h1>Work</h1>
      <p className="lede">Each case study starts with what was broken or missing, then what I did and what changed. Client names are shown where I'm allowed to.</p>
      <WorkList items={WORK} />
    </div>
  );
}

function Case({ c }) {
  const i = WORK.indexOf(c);
  const prev = WORK[i - 1];
  const next = WORK[i + 1];
  return (
    <article className="column page">
      <p className="meta"><Link href="/work/">Work</Link> · {c.kind}</p>
      <h1>{c.title}</h1>
      <p className="meta">{c.client} · {c.region} · {c.duration} · {statusText(c.status)}</p>
      <p className="lede">{c.summary}</p>

      <h2>{c.before_title}</h2>
      <ul>{c.before.map((t) => <li key={t}>{t}</li>)}</ul>
      {c.situation.map((p) => <p key={p}>{p}</p>)}

      <h2>What I did</h2>
      <ol>{c.work.map((t) => <li key={t}>{t}</li>)}</ol>

      <h2>What changed</h2>
      <ul>{c.outcome.map((t) => <li key={t}>{t}</li>)}</ul>

      <p className="meta">Tools: {c.stack.join(", ")}</p>

      <AuthorBox />
      <nav className="prev-next" aria-label="More case studies">
        {prev ? <Link href={`/work/${prev.slug}/`}>← {prev.title}</Link> : <span />}
        {next ? <Link href={`/work/${next.slug}/`}>{next.title} →</Link> : <span />}
      </nav>
    </article>
  );
}

/* ---------------------------------------------------------------- notes */

function Notes() {
  return (
    <div className="column page">
      <h1>Notes</h1>
      <p className="lede">Short, practical notes on SharePoint, the Power Platform and running Microsoft 365. Some are for beginners, some are for people who already run a tenant. <a href={withBase("/notes/rss.xml")}>RSS feed</a>.</p>
      {POSTS.length ? <NoteList items={POSTS} /> : <p>The first notes are on their way.</p>}
    </div>
  );
}

function Note({ meta }) {
  const [note, setNote] = useState(() => getCachedNote(meta.slug));
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (note) return;
    let live = true;
    loadNote(meta.slug).then((n) => live && setNote(n)).catch(() => live && setFailed(true));
    return () => { live = false; };
  }, [meta.slug, note]);
  const more = POSTS.filter((p) => p.slug !== meta.slug).slice(0, 4);

  return (
    <article className="column page">
      <p className="meta"><Link href="/notes/">Notes</Link> · {fmtDate(meta.date, { day: "numeric", month: "long", year: "numeric" })}{note ? ` · ${readMins(note.html)} min read` : ""}</p>
      <h1>{meta.title}</h1>
      {meta.summary && <p className="lede">{meta.summary}</p>}
      {note ? <div className="prose" dangerouslySetInnerHTML={{ __html: note.html }} />
        : failed ? <p role="alert">This note couldn't load. Check your connection and <a href={withBase(`/notes/${meta.slug}/`)}>reload the page</a>.</p>
        : <p className="muted" role="status">Loading…</p>}
      {meta.tags.length > 0 && <p className="meta">Filed under {meta.tags.join(", ")}</p>}

      <AuthorBox />
      {more.length > 0 && (
        <>
          <h2 className="small-heading">More notes</h2>
          <NoteList items={more} summaries={false} />
        </>
      )}
    </article>
  );
}

/* ---------------------------------------------------------------- about */

function About() {
  return (
    <div className="column page">
      <h1>About</h1>
      <section className="intro intro-small">
        <Portrait size={72} eager />
        <p className="lede">{SITE.role}. {SITE.location}.</p>
      </section>
      {SITE.about.map((p) => <p key={p}>{p}</p>)}

      <h2>Experience</h2>
      <Experience />

      <h2>Certification and education</h2>
      <ul>{SITE.credentials.map(([a, b]) => <li key={a}>{a}: {b}</li>)}</ul>

      <h2>Where I'll work</h2>
      <p>{SITE.availability.remote} {SITE.availability.relocation}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- hire */

function Hire() {
  return (
    <div className="column page">
      <h1>Hire me</h1>
      <p className="lede">{SITE.name}: SharePoint developer and Microsoft 365 architect, five years in SharePoint, Microsoft 365, the Power Platform and Azure. Based in Saudi Arabia with a transferable Iqama.</p>
      <p className="actions">
        <a className="button" href={withBase(SITE.cv_url)} download>Download my CV (PDF)</a>
        <a href={`mailto:${SITE.email}?subject=${encodeURIComponent("Role opportunity")}`}>{SITE.email}</a>
        <a href={SITE.linkedin} rel="me noopener" target="_blank">LinkedIn</a>
      </p>

      <h2>Roles I'm looking for</h2>
      <p>{SITE.target_roles.join(", ")}.</p>
      <p><strong>Locations:</strong> {SITE.target_locations}</p>

      <h2>Quick facts</h2>
      <dl className="facts">
        {SITE.quick_facts.map(([a, b]) => [<dt key={a + "t"}>{a}</dt>, <dd key={a + "d"}>{b}</dd>])}
      </dl>

      <h2>Highlights</h2>
      <ul>{SITE.highlights.map(([slug, text]) => <li key={slug}><Link href={`/work/${slug}/`}>{text}</Link></li>)}</ul>

      <h2>Skills</h2>
      <dl className="facts">
        {SITE.keyword_groups.map(([a, b]) => [<dt key={a + "t"}>{a}</dt>, <dd key={a + "d"}>{b}</dd>])}
      </dl>

      <h2>Experience</h2>
      <Experience />
    </div>
  );
}

/* ---------------------------------------------------------------- consulting */

function Services() {
  return (
    <div className="column page">
      <h1>Consulting</h1>
      <p className="lede">I work with companies directly and remotely, in any time zone. If you're not sure what you need, start with a one-hour call.</p>
      {SITE.offers.map((o) => (
        <section key={o.name}>
          <h2>{o.name} <span className="price">{o.price}{o.price === "$35" ? " an hour" : ` · ${o.unit}`}</span></h2>
          <p>{o.text} <Link href={`/contact/?topic=${encodeURIComponent(o.subject)}`}>{o.cta} →</Link></p>
        </section>
      ))}
      <h2>What I help with</h2>
      <dl className="facts">{SITE.help_with.map(([a, b]) => [<dt key={a + "t"}>{a}</dt>, <dd key={a + "d"}>{b}</dd>])}</dl>
      <h2>How a first call goes</h2>
      <p>Send a few lines about what's going on: what you run on Microsoft 365, what's failing or slow, and any deadline. I'll reply with a time that works across our time zones. Afterwards you get a short written summary: what I'd fix first, roughly how long it takes, and whether you need me for it or can do it in-house.</p>
    </div>
  );
}

/* ---------------------------------------------------------------- contact */

const TOPICS = ["Microsoft 365 review call", "Career guidance call", "Project enquiry", "Ongoing support enquiry", "Job or contract role", "Something else"];
const DRAFT_KEY = "contact-draft";
function readDraft() { try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch { return null; } }
function writeDraft(v) { try { v ? localStorage.setItem(DRAFT_KEY, JSON.stringify(v)) : localStorage.removeItem(DRAFT_KEY); } catch { /* storage blocked */ } }

function Contact() {
  const { navigate } = useRouter();
  const [form, setForm] = useState({ name: "", email: "", company: "", topic: TOPICS[0], message: "" });
  const [state, setState] = useState("idle"); // idle | sending | offline | error

  useEffect(() => {
    const draft = readDraft();
    const topic = new URLSearchParams(location.search).get("topic");
    setForm((f) => ({ ...f, ...(draft || {}), ...(topic && TOPICS.includes(topic) ? { topic } : {}) }));
  }, []);

  const update = (k) => (e) => { const next = { ...form, [k]: e.target.value }; setForm(next); writeDraft(next); };
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(form.topic)}&body=${encodeURIComponent(
    `${form.message}\n\n— ${form.name}${form.company ? `, ${form.company}` : ""}\n${form.email}`)}`;
  const formspree = SITE.formspree_id ? `https://formspree.io/f/${SITE.formspree_id}` : "";

  async function onSubmit(e) {
    e.preventDefault();
    if (!formspree) { location.href = mailto; return; }
    if (!navigator.onLine) { setState("offline"); return; }
    setState("sending");
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch(formspree, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(e.currentTarget), signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(String(res.status));
      writeDraft(null);
      navigate("/thanks/");
    } catch {
      setState(navigator.onLine ? "error" : "offline");
    }
  }

  return (
    <div className="column page">
      <h1>Contact</h1>
      <p className="lede">Tell me what you're working on. A few lines is plenty, and I read every message myself. You can also email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or message me on <a href={SITE.linkedin} rel="me noopener" target="_blank">LinkedIn</a>.</p>
      <form className="form" name="contact" method="POST" action={formspree || `mailto:${SITE.email}`} onSubmit={onSubmit}>
        <input type="hidden" name="_subject" value={`Website: ${form.topic}`} />
        <p className="hp"><label>Leave this empty <input name="_gotcha" tabIndex={-1} autoComplete="off" /></label></p>
        <label htmlFor="f-name">Your name</label>
        <input id="f-name" name="name" autoComplete="name" required value={form.name} onChange={update("name")} />
        <label htmlFor="f-email">Email</label>
        <input id="f-email" name="email" type="email" autoComplete="email" required value={form.email} onChange={update("email")} />
        <label htmlFor="f-company">Company <span className="muted">(optional)</span></label>
        <input id="f-company" name="company" autoComplete="organization" value={form.company} onChange={update("company")} />
        <label htmlFor="f-topic">What's it about?</label>
        <select id="f-topic" name="topic" value={form.topic} onChange={update("topic")}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        <label htmlFor="f-message">Message</label>
        <textarea id="f-message" name="message" rows={7} required value={form.message} onChange={update("message")} />
        <p className="actions">
          <button className="button" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</button>
          {state === "idle" && <span className="muted">{formspree ? "Goes straight to my inbox." : "Opens your email app with the message filled in."}</span>}
        </p>
        {state === "offline" && <p className="notice" role="status">You're offline. Your message is saved on this device. Send it again when you're back online, or <a href={mailto}>send it by email</a>.</p>}
        {state === "error" && <p className="notice" role="alert">That didn't go through. Your message is saved. Try again, or <a href={mailto}>send it by email</a>.</p>}
      </form>
    </div>
  );
}

function Thanks() {
  return (
    <div className="column page" role="status">
      <h1>Thanks, I've got your message.</h1>
      <p className="lede">I'll reply from {SITE.email} as soon as I can. If it's urgent, LinkedIn works too.</p>
      <p><Link href="/work/">Meanwhile, have a look at the work →</Link></p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="column page">
      <h1>That page isn't here.</h1>
      <p className="lede">The site was rebuilt recently, so an old link may have moved. Try the <Link href="/">home page</Link>, <Link href="/work/">work</Link> or <Link href="/notes/">notes</Link>.</p>
    </div>
  );
}

export function Route({ path }) {
  const c = findCase(path);
  if (c) return <Case c={c} />;
  const post = findPost(path);
  if (post) return <Note meta={post} key={post.slug} />;
  switch (path) {
    case "/": return <Home />;
    case "/hire/": return <Hire />;
    case "/notes/": return <Notes />;
    case "/work/": return <Work />;
    case "/services/": return <Services />;
    case "/about/": return <About />;
    case "/contact/": return <Contact />;
    case "/thanks/": return <Thanks />;
    default: return <NotFound />;
  }
}
