import { useEffect, useState } from "react";
import { Link, useRouter } from "./router.jsx";
import { SITE, WORK, findCase } from "./data.js";
import { Cta, Help, Offers, Portrait, Status, Ticker, Timeline, WorkRows } from "./components.jsx";

/* ---------------------------------------------------------------- home */

function Home() {
  const [a, b, c, d] = SITE.headline;
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <p className="kicker">{SITE.role} · {SITE.location}</p>
            <h1 className="mega">
              <span className="line">{a}</span>
              <span className="line"><mark>{b}</mark></span>
              <span className="line">{c}</span>
              <span className="line"><mark>{d}</mark></span>
            </h1>
          </div>
          <aside className="hero-side">
            <Portrait eager />
            <Status />
          </aside>
        </div>
        <div className="wrap hero-low">
          <div className="lede">{SITE.intro.map((p) => <p key={p}>{p}</p>)}</div>
          <Ticker />
        </div>
        <div className="wrap actions">
          <Link className="btn" href="/contact/">Start a conversation</Link>
          <Link className="link" href="/work/">See what I've fixed →</Link>
        </div>
      </section>

      <section className="band">
        <ul className="wrap numbers">
          {SITE.numbers.map(([n, t]) => <li key={t}><strong>{n}</strong><span>{t}</span></li>)}
        </ul>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <p className="kicker">Selected work</p>
          <h2>What was failing, and what it looks like now.</h2>
        </div>
        <WorkRows items={WORK.slice(0, 5)} />
        <p className="more"><Link className="link" href="/work/">All {WORK.length} case studies →</Link></p>
      </section>

      <section className="wrap section split">
        <div className="section-head">
          <p className="kicker">Services</p>
          <h2>What I help with</h2>
        </div>
        <Help />
      </section>

      <section className="wrap section">
        <div className="section-head">
          <p className="kicker">Working together</p>
          <h2>Start with a one-hour call.</h2>
        </div>
        <Offers />
      </section>

      <section className="wrap section split">
        <div className="section-head">
          <p className="kicker">Experience</p>
          <h2>Where I've been</h2>
          <p className="muted">{SITE.availability.remote} {SITE.availability.relocation}</p>
          <p><Link className="link" href="/about/">More about me →</Link></p>
        </div>
        <Timeline />
      </section>
      <Cta />
    </>
  );
}

/* ---------------------------------------------------------------- work */

function Work() {
  return (
    <>
      <section className="wrap page-head">
        <p className="kicker">Work</p>
        <h1 className="big">What was failing. What I changed.</h1>
        <p className="lede">Legacy forms, leaking permissions, duplicate records, stalled migrations. Each case study starts with what was broken in the old system, then what I did about it.</p>
      </section>
      <section className="wrap section-tight">
        <WorkRows items={WORK} />
      </section>
      <Cta text="Got an old system that's starting to fail?" />
    </>
  );
}

function Case({ c }) {
  const i = WORK.indexOf(c);
  const prev = WORK[i - 1];
  const next = WORK[i + 1];
  return (
    <article>
      <header className="wrap page-head">
        <p className="kicker"><Link href="/work/">Work</Link> / {c.kind} · <span className="pill">{c.status}</span></p>
        <h1 className="big">{c.title}</h1>
        <p className="lede">{c.summary}</p>
        <dl className="facts">
          <div><dt>Client</dt><dd>{c.client}</dd></div>
          <div><dt>Where</dt><dd>{c.region}</dd></div>
          <div><dt>Length</dt><dd>{c.duration}</dd></div>
          <div><dt>Result</dt><dd>{c.result}</dd></div>
        </dl>
      </header>

      <section className="wrap ba">
        <div className="ba-before">
          <p className="ba-label">Before</p>
          <h2>{c.before_title}</h2>
          <ul className="fails">{c.before.map((t) => <li key={t}>{t}</li>)}</ul>
          {c.situation.map((p) => <p key={p} className="ba-note">{p}</p>)}
        </div>
        <div className="ba-after">
          <p className="ba-label">After</p>
          <h2>What changed</h2>
          <ul className="wins">{c.outcome.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </section>

      <section className="wrap section-tight case-steps">
        <div className="section-head"><p className="kicker">How</p><h2>What I did</h2></div>
        <ol className="steps">{c.work.map((t) => <li key={t}>{t}</li>)}</ol>
      </section>

      <section className="wrap section-tight case-steps">
        <div className="section-head"><p className="kicker">Stack</p><h2>Tools</h2></div>
        <ul className="tags">{c.stack.map((t) => <li key={t}>{t}</li>)}</ul>
      </section>

      <nav className="wrap pager" aria-label="More case studies">
        {prev ? <Link href={`/work/${prev.slug}/`}><span>Previous</span>{prev.title}</Link> : <span />}
        {next ? <Link className="next" href={`/work/${next.slug}/`}><span>Next</span>{next.title}</Link> : <span />}
      </nav>
      <Cta text="Dealing with something like this?" />
    </article>
  );
}

/* ---------------------------------------------------------------- services */

function Services() {
  return (
    <>
      <section className="wrap page-head">
        <p className="kicker">Services</p>
        <h1 className="big">SharePoint, Power Platform and Microsoft 365 consulting.</h1>
        <p className="lede">I work with companies directly, remotely, in any time zone. Small calls, fixed-scope projects, or ongoing support — whichever fits.</p>
      </section>
      <section className="wrap section-tight"><Offers /></section>
      <section className="wrap section split">
        <div className="section-head"><p className="kicker">Scope</p><h2>What I help with</h2></div>
        <Help />
      </section>
      <section className="wrap section split">
        <div className="section-head"><p className="kicker">Toolkit</p><h2>What I use week to week</h2></div>
        <Help items={SITE.skills} />
      </section>
      <section className="wrap section split">
        <div className="section-head"><p className="kicker">Process</p><h2>How a first call goes</h2></div>
        <div className="prose">
          <p>Send me a few lines about what's going on — what you run on Microsoft 365, what's broken or slow, and any deadline. I'll reply with a time that works across our time zones.</p>
          <p>On the call we go through it together. Afterwards you get a short written summary: what I'd fix first, roughly how long it takes, and whether you need me for it or can do it in-house.</p>
        </div>
      </section>
      <Cta />
    </>
  );
}

/* ---------------------------------------------------------------- about */

function About() {
  return (
    <>
      <section className="wrap page-head about-head">
        <div>
          <p className="kicker">About</p>
          <h1 className="big">Hi, I'm Shafeek.</h1>
          <div className="prose lead-prose">{SITE.about.map((p) => <p key={p}>{p}</p>)}</div>
        </div>
        <aside><Portrait eager /><Status /></aside>
      </section>
      <section className="wrap section split">
        <div className="section-head"><p className="kicker">Experience</p><h2>Timeline</h2></div>
        <Timeline />
      </section>
      <section className="wrap section split">
        <div className="section-head"><p className="kicker">Credentials</p><h2>Certification & education</h2></div>
        <Help items={SITE.credentials} />
      </section>
      <section className="wrap section split">
        <div className="section-head"><p className="kicker">Location</p><h2>Where I'll work</h2></div>
        <div className="prose">
          <p>{SITE.availability.remote}</p>
          <p>{SITE.availability.relocation}</p>
          <p>I've already delivered for teams in the US, UK, Canada, the UAE and Saudi Arabia, so working across borders and time zones is normal for me.</p>
        </div>
      </section>
      <Cta />
    </>
  );
}

/* ---------------------------------------------------------------- contact */

const TOPICS = ["Microsoft 365 review call", "Career guidance call", "Project enquiry", "Ongoing support enquiry", "Job or contract role", "Something else"];
const DRAFT_KEY = "contact-draft";

function readDraft() {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch { return null; }
}
function writeDraft(v) {
  try { v ? localStorage.setItem(DRAFT_KEY, JSON.stringify(v)) : localStorage.removeItem(DRAFT_KEY); } catch { /* storage blocked */ }
}

function Contact() {
  const { navigate } = useRouter();
  const [form, setForm] = useState({ name: "", email: "", company: "", topic: TOPICS[0], message: "" });
  const [state, setState] = useState("idle"); // idle | sending | offline | error

  useEffect(() => {
    const draft = readDraft();
    const topic = new URLSearchParams(location.search).get("topic");
    setForm((f) => ({ ...f, ...(draft || {}), ...(topic && TOPICS.includes(topic) ? { topic } : {}) }));
  }, []);

  const update = (k) => (e) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    writeDraft(next);
  };

  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(form.topic)}&body=${encodeURIComponent(
    `${form.message}\n\n— ${form.name}${form.company ? `, ${form.company}` : ""}\n${form.email}`)}`;

  async function onSubmit(e) {
    e.preventDefault();
    if (!navigator.onLine) { setState("offline"); return; }
    setState("sending");
    const body = new URLSearchParams({ "form-name": "contact", ...form }).toString();
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 12000);
      const res = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body, signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(String(res.status));
      writeDraft(null);
      navigate("/thanks/");
    } catch {
      setState(navigator.onLine ? "error" : "offline");
    }
  }

  return (
    <section className="wrap page-head contact">
      <div>
        <p className="kicker">Contact</p>
        <h1 className="big">Tell me what you're working on.</h1>
        <p className="lede">A few lines is plenty. I read every message myself.</p>
        <dl className="facts facts-col">
          <div><dt>Email</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
          <div><dt>LinkedIn</dt><dd><a href={SITE.linkedin} rel="me noopener" target="_blank">linkedin.com/in/mdshafeek</a></dd></div>
          <div><dt>Based in</dt><dd>{SITE.location}</dd></div>
          <div><dt>Open to</dt><dd>Remote consulting worldwide, contracts, and full-time roles abroad (relocating with family)</dd></div>
        </dl>
      </div>
      <form className="form" name="contact" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="company_website" onSubmit={onSubmit}>
        <input type="hidden" name="form-name" value="contact" />
        <p className="hp"><label>Leave this empty <input name="company_website" tabIndex={-1} autoComplete="off" /></label></p>
        <label>Your name<input name="name" autoComplete="name" required value={form.name} onChange={update("name")} /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required value={form.email} onChange={update("email")} /></label>
        <label><span>Company <span className="opt">(optional)</span></span><input name="company" autoComplete="organization" value={form.company} onChange={update("company")} /></label>
        <label>What's this about?
          <select name="topic" value={form.topic} onChange={update("topic")}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        <label>Message<textarea name="message" rows={6} required value={form.message} onChange={update("message")}
          placeholder="What you run on Microsoft 365, what's failing, any deadline." /></label>
        <button className="btn" type="submit" disabled={state === "sending"}>
          {state === "sending" ? <><span className="spinner" aria-hidden="true" /> Sending…</> : "Send message"}
        </button>
        <div className="form-note" role="status" aria-live="polite">
          {state === "offline" && <p className="warn">You're offline. Your message is saved on this device — press send again when you're back online, or <a href={mailto}>send it by email</a>.</p>}
          {state === "error" && <p className="warn">That didn't go through. Your message is saved — try again, or <a href={mailto}>send it by email</a>.</p>}
          {(state === "idle" || state === "sending") && <p>Goes straight to my inbox. Prefer email? <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>}
        </div>
      </form>
    </section>
  );
}

function Thanks() {
  return (
    <section className="wrap page-head narrow">
      <p className="kicker">Message sent</p>
      <h1 className="big">Thanks — I've got it.</h1>
      <p className="lede">I'll reply from {SITE.email} as soon as I can. If it's urgent, LinkedIn works too.</p>
      <p className="actions"><Link className="link" href="/work/">Meanwhile, have a look at the work →</Link></p>
    </section>
  );
}

function NotFound() {
  return (
    <section className="wrap page-head narrow">
      <p className="kicker">404</p>
      <h1 className="big">That page isn't here.</h1>
      <p className="lede">The site was rebuilt recently, so an old link may have moved.</p>
      <p className="actions"><Link className="link" href="/">Home</Link> <Link className="link" href="/work/">Work</Link> <Link className="link" href="/contact/">Contact</Link></p>
    </section>
  );
}

export function Page({ path }) {
  const c = findCase(path);
  if (c) return <Case c={c} />;
  switch (path) {
    case "/": return <Home />;
    case "/work/": return <Work />;
    case "/services/": return <Services />;
    case "/about/": return <About />;
    case "/contact/": return <Contact />;
    case "/thanks/": return <Thanks />;
    default: return <NotFound />;
  }
}
