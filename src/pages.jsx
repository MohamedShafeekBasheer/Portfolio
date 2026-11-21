import { useEffect, useState } from "react";
import { Link, useRouter } from "./router.jsx";
import { POSTS, SITE, WORK, findCase, findPost, withBase } from "./data.js";
import { getCachedNote, loadNote } from "./notes.js";
import { Header, Portrait, StatusPill } from "./components.jsx";

function Page({ title, crumb, primary, children }) {
  return (
    <>
      <Header title={title} crumb={crumb} primary={primary} />
      <div className="content">{children}</div>
    </>
  );
}

/* ---------------------------------------------------------------- shared blocks */

function CaseTable({ items }) {
  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr><th scope="col">Ref</th><th scope="col">Engagement</th><th scope="col" className="hideMd">Client</th><th scope="col" className="hideSm">Region</th><th scope="col" className="hideMd">Length</th><th scope="col">Status</th></tr>
        </thead>
        <tbody>
          {items.map((w) => (
            <tr key={w.slug}>
              <td className="cellRef">{w.ref}</td>
              <td className="wrap"><Link href={`/work/${w.slug}/`}>{w.title}</Link></td>
              <td className="cellMuted hideMd">{w.client}</td>
              <td className="cellMuted hideSm">{w.region}</td>
              <td className="cellMuted hideMd">{w.duration}</td>
              <td><StatusPill status={w.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExperienceTable() {
  return (
    <div className="tableWrap">
      <table className="table">
        <thead><tr><th scope="col">Period</th><th scope="col">Role</th><th scope="col">Organisation</th><th scope="col" className="hideMd">Focus</th></tr></thead>
        <tbody>
          {SITE.timeline.map(([when, role, org, text]) => (
            <tr key={when + org}>
              <td className="cellRef">{when}</td>
              <td><strong>{role}</strong></td>
              <td className="cellMuted">{org}</td>
              <td className="wrap cellMuted hideMd">{text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Offers() {
  return (
    <div className="offerGrid">
      {SITE.offers.map((o) => (
        <article className="card offer" key={o.name}>
          <p className="cardLabel">{o.unit}</p>
          <h3>{o.name}</h3>
          <p className="price">{o.price}{o.price === "$35" && <span>/ hour</span>}</p>
          <p className="offerText">{o.text}</p>
          <Link className="button buttonGhost" href={`/contact/?topic=${encodeURIComponent(o.subject)}`}>{o.cta}</Link>
        </article>
      ))}
    </div>
  );
}

function Defs({ items }) {
  return (
    <dl className="defs">
      {items.map(([t, d]) => [<dt key={t + "t"}>{t}</dt>, <dd key={t + "d"}>{d}</dd>])}
    </dl>
  );
}

/* ---------------------------------------------------------------- overview */

function Home() {
  return (
    <Page title="Overview">
      <section className="intro">
        <Portrait eager />
        <div>
          <p className="eyebrow">{SITE.name} · {SITE.role}</p>
          <h1>{SITE.headline}</h1>
          <p className="lede">{SITE.intro[0]}</p>
          <div className="introActions">
            <Link className="button buttonGhost" href="/hire/">For recruiters &amp; CV</Link>
            <Link className="button buttonGhost" href="/work/">Read the case studies</Link>
            <Link className="button buttonGhost" href="/services/">Consulting &amp; rates</Link>
          </div>
          <p className="openTo"><strong>Open to:</strong> {SITE.target_roles.slice(0, 5).join(" · ")} — in Saudi Arabia, the GCC, Singapore, India or remote. Iqama transferable.</p>
        </div>
      </section>

      <section aria-label="Key figures" className="cardGrid">
        {SITE.numbers.map(([label, n, meta]) => (
          <div className="card" key={label}>
            <p className="cardLabel">{label}</p>
            <p className="cardValue">{n}</p>
            <p className="cardMeta">{meta}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="sectionHead"><h2>Case studies</h2><Link href="/work/">All {WORK.length} →</Link></div>
        <CaseTable items={WORK.slice(0, 5)} />
      </section>

      {POSTS.length > 0 && (
        <section>
          <div className="sectionHead"><h2>Latest notes</h2><Link href="/notes/">All notes →</Link></div>
          <NoteList items={POSTS.slice(0, 3)} />
        </section>
      )}

      <section>
        <div className="sectionHead"><h2>Ways to work together</h2><Link href="/services/">Details →</Link></div>
        <Offers />
      </section>

      <section>
        <div className="sectionHead"><h2>Experience</h2><Link href="/about/">About me →</Link></div>
        <ExperienceTable />
        <p className="muted afterTable">{SITE.availability.remote} {SITE.availability.relocation}</p>
      </section>
    </Page>
  );
}

/* ---------------------------------------------------------------- work */

function Work() {
  return (
    <Page title="Case studies">
      <section>
        <h1>Case studies</h1>
        <p className="lede">Each one is written up as a short report: what was failing in the old system, what I did, and what changed. Select a row to read it.</p>
      </section>
      <CaseTable items={WORK} />
    </Page>
  );
}

function Case({ c }) {
  const i = WORK.indexOf(c);
  const prev = WORK[i - 1];
  const next = WORK[i + 1];
  return (
    <Page title={c.ref} crumb={["/work/", "Case studies"]}>
      <article className="report">
        <header className="reportHead">
          <div className="reportMeta">
            <span className="cellRef">{c.ref}</span>
            <span className="eyebrow">{c.kind}</span>
            <StatusPill status={c.status} />
          </div>
          <h1 className="reportTitle">{c.title}</h1>
          <p className="reportLede">{c.summary}</p>
        </header>
        <dl className="facts">
          <div><dt>Client</dt><dd>{c.client}</dd></div>
          <div><dt>Region</dt><dd>{c.region}</dd></div>
          <div><dt>Length</dt><dd>{c.duration}</dd></div>
          <div><dt>Result</dt><dd>{c.result}</dd></div>
        </dl>

        <section className="reportSection">
          <h2 className="reportHeading">{c.before_title} <span className="count">{c.before.length} findings</span></h2>
          <div>
            {c.before.map((t, n) => (
              <div className="finding" key={t}>
                <span className="findingRef">F-{String(n + 1).padStart(2, "0")}</span>
                <p className="findingTitle">{t}</p>
                <span className="statusPill">Resolved</span>
              </div>
            ))}
          </div>
          {c.situation.length > 0 && <div className="reportBody muted">{c.situation.map((p) => <p key={p}>{p}</p>)}</div>}
        </section>

        <section className="reportSection">
          <h2 className="reportHeading">What I did</h2>
          <ol className="steps">{c.work.map((t) => <li key={t}>{t}</li>)}</ol>
        </section>

        <section className="reportSection">
          <h2 className="reportHeading">Outcome</h2>
          <ul className="outcomes">{c.outcome.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>

        <section className="reportSection">
          <h2 className="reportHeading">Stack</h2>
          <ul className="tags">{c.stack.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>

        <footer className="reportFoot">
          {c.ref} · {SITE.name} · Figures are from the delivery records of the engagement. Some clients are anonymised.
        </footer>
      </article>

      <nav className="pager printHide" aria-label="More case studies">
        {prev ? <Link className="card" href={`/work/${prev.slug}/`}><span className="cardLabel">Previous · {prev.ref}</span><span>{prev.title}</span></Link> : <span />}
        {next ? <Link className="card next" href={`/work/${next.slug}/`}><span className="cardLabel">Next · {next.ref}</span><span>{next.title}</span></Link> : <span />}
      </nav>
    </Page>
  );
}

/* ---------------------------------------------------------------- services */

function Services() {
  return (
    <Page title="Services">
      <section>
        <h1>Services &amp; rates</h1>
        <p className="lede">I work with companies directly and remotely, in any time zone. Start with a one-hour call if you're not sure what you need.</p>
      </section>
      <Offers />
      <section className="card">
        <h2>What I help with</h2>
        <Defs items={SITE.help_with} />
      </section>
      <section className="card">
        <h2>Toolkit</h2>
        <Defs items={SITE.skills} />
      </section>
      <section className="card">
        <h2>How a first call goes</h2>
        <div className="reportBody">
          <p>Send a few lines about what's going on: what you run on Microsoft 365, what's failing or slow, and any deadline. I'll reply with a time that works across our time zones.</p>
          <p>On the call we go through it together. Afterwards you get a short written summary: what I'd fix first, roughly how long it takes, and whether you need me for it or can do it in-house.</p>
        </div>
      </section>
    </Page>
  );
}

/* ---------------------------------------------------------------- about */

function About() {
  return (
    <Page title="About">
      <article className="report">
        <header className="reportHead">
          <div className="reportMeta"><span className="statusPill">Available</span><span className="eyebrow">{SITE.location}</span></div>
          <h1 className="reportTitle">Hi, I'm Shafeek.</h1>
          <p className="reportLede">{SITE.role}. {SITE.current}.</p>
        </header>
        <section className="reportSection">
          <div className="reportBody">{SITE.about.map((p) => <p key={p}>{p}</p>)}</div>
        </section>
        <section className="reportSection">
          <h2 className="reportHeading">Where I'll work</h2>
          <div className="reportBody">
            <p>{SITE.availability.remote} {SITE.availability.relocation}</p>
            <p>I've delivered for teams in the US, UK, Canada, the UAE and Saudi Arabia, so working across borders and time zones is normal for me.</p>
          </div>
        </section>
        <section className="reportSection">
          <h2 className="reportHeading">Credentials</h2>
          <Defs items={SITE.credentials} />
        </section>
      </article>
      <section>
        <div className="sectionHead"><h2>Experience</h2></div>
        <ExperienceTable />
      </section>
    </Page>
  );
}

/* ---------------------------------------------------------------- notes */

const fmtDate = (d) => {
  try { return new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }); }
  catch { return d; }
};

function NoteList({ items }) {
  return (
    <div className="tableWrap">
      <table className="table">
        <thead><tr><th scope="col">Date</th><th scope="col">Note</th><th scope="col" className="hideSm">Tags</th></tr></thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.slug}>
              <td className="cellRef">{fmtDate(p.date)}</td>
              <td className="wrap"><Link href={`/notes/${p.slug}/`}>{p.title}</Link><br /><span className="cellMuted">{p.summary}</span></td>
              <td className="cellMuted hideSm">{p.tags.slice(0, 3).join(" · ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Notes() {
  return (
    <Page title="Notes">
      <section>
        <h1>Notes</h1>
        <p className="lede">Short, practical notes on SharePoint, SPFx, the Power Platform, PnP PowerShell and Microsoft 365 governance — what changed, and what it means if you run a tenant.</p>
      </section>
      {POSTS.length ? <NoteList items={POSTS} /> : (
        <div className="card empty">
          <h2 className="emptyTitle">The first notes are on their way.</h2>
          <p className="emptyBody">In the meantime, the case studies show the work in detail.</p>
          <div className="introActions"><Link className="button buttonGhost" href="/work/">Read the case studies</Link></div>
        </div>
      )}
    </Page>
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

  return (
    <Page title={meta.title} crumb={["/notes/", "Notes"]}>
      <article className="report reportNote">
        <header className="reportHead">
          <div className="reportMeta">
            <span className="cellRef">{fmtDate(meta.date)}</span>
            {meta.tags.map((t) => <span className="eyebrow" key={t}>{t}</span>)}
          </div>
          <h1 className="reportTitle">{meta.title}</h1>
          {meta.summary && <p className="reportLede">{meta.summary}</p>}
        </header>
        <section className="reportSection">
          {note ? <div className="reportBody prose noteBody" dangerouslySetInnerHTML={{ __html: note.html }} />
            : failed ? <p className="notice" role="alert">This note couldn't load. Check your connection and <a href={withBase(`/notes/${meta.slug}/`)}>reload</a>.</p>
            : <p className="muted" role="status"><span className="spinner" aria-hidden="true" /> Loading…</p>}
        </section>
        <footer className="reportFoot">{SITE.name} · {SITE.role}. Questions or a similar problem? <Link href="/contact/">Get in touch</Link>.</footer>
      </article>
    </Page>
  );
}

/* ---------------------------------------------------------------- recruiters */

function Hire() {
  return (
    <Page title="For recruiters" primary={false}>
      <section className="intro">
        <Portrait eager />
        <div>
          <p className="eyebrow">For recruiters and hiring managers</p>
          <h1>{SITE.name} — SharePoint Developer &amp; Microsoft 365 Architect</h1>
          <p className="lede">5 years building on SharePoint, Microsoft 365, the Power Platform and Azure, for EY GDS, Avasoft clients in the US, UK and Canada, and a five-company Saudi industrial group. KSA-based, Iqama transferable.</p>
          <div className="introActions">
            <a className="button buttonPrimary" href={withBase(SITE.cv_url)} download>Download CV (PDF)</a>
            <a className="button buttonGhost" href={`mailto:${SITE.email}?subject=${encodeURIComponent("Role opportunity")}`}>Email me</a>
            <a className="button buttonGhost" href={SITE.linkedin} rel="me noopener" target="_blank">LinkedIn</a>
          </div>
        </div>
      </section>

      <section>
        <div className="sectionHead"><h2>Roles I'm open to</h2></div>
        <ul className="roleList">{SITE.target_roles.map((r) => <li key={r}>{r}</li>)}</ul>
        <p className="openTo"><strong>Locations:</strong> {SITE.target_locations}</p>
      </section>

      <section className="card">
        <h2>Quick facts</h2>
        <Defs items={SITE.quick_facts} />
      </section>

      <section className="card">
        <h2>Highlights</h2>
        <ul className="highlights">
          {SITE.highlights.map(([slug, text]) => (
            <li key={slug}><Link href={`/work/${slug}/`}>{text}</Link></li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Skills</h2>
        <Defs items={SITE.keyword_groups} />
      </section>

      <section>
        <div className="sectionHead"><h2>Experience</h2><Link href="/about/">Full profile →</Link></div>
        <ExperienceTable />
      </section>
    </Page>
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
      const res = await fetch(formspree, {
        method: "POST", headers: { Accept: "application/json" },
        body: new FormData(e.currentTarget), signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!res.ok) throw new Error(String(res.status));
      writeDraft(null);
      navigate("/thanks/");
    } catch {
      setState(navigator.onLine ? "error" : "offline");
    }
  }

  return (
    <Page title="Contact" primary={false}>
      <section>
        <h1>Contact</h1>
        <p className="lede">Tell me what you're working on. A few lines is plenty; I read every message myself.</p>
      </section>
      <div className="formGrid">
        <form className="card form" name="contact" method="POST" action={formspree || `mailto:${SITE.email}`} onSubmit={onSubmit}>
          <input type="hidden" name="_subject" value={`Website: ${form.topic}`} />
          <p className="hp"><label>Leave this empty <input name="_gotcha" tabIndex={-1} autoComplete="off" /></label></p>
          <div className="formRow"><label htmlFor="f-name">Your name</label><input id="f-name" className="input" name="name" autoComplete="name" required value={form.name} onChange={update("name")} /></div>
          <div className="formRow"><label htmlFor="f-email">Email</label><input id="f-email" className="input" name="email" type="email" autoComplete="email" required value={form.email} onChange={update("email")} /></div>
          <div className="formRow"><label htmlFor="f-company">Company <span className="opt">(optional)</span></label><input id="f-company" className="input" name="company" autoComplete="organization" value={form.company} onChange={update("company")} /></div>
          <div className="formRow"><label htmlFor="f-topic">Topic</label>
            <select id="f-topic" className="input" name="topic" value={form.topic} onChange={update("topic")}>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select></div>
          <div className="formRow"><label htmlFor="f-message">Message</label>
            <textarea id="f-message" className="input" name="message" rows={6} required value={form.message} onChange={update("message")}
              placeholder="What you run on Microsoft 365, what's failing, any deadline." /></div>
          <div className="formFoot">
            <button className="button buttonPrimary" type="submit" disabled={state === "sending"}>
              {state === "sending" ? <><span className="spinner" aria-hidden="true" />Sending</> : "Send message"}
            </button>
            {state === "idle" && <span className="muted">{formspree ? "Goes straight to my inbox." : "Opens your email app with the message ready."}</span>}
          </div>
          {state === "offline" && <p className="notice" role="status">You're offline. Your message is saved on this device. Send it again when you're back online, or <a href={mailto}>send it by email</a>.</p>}
          {state === "error" && <p className="notice" role="alert">That didn't go through. Your message is saved. Try again, or <a href={mailto}>send it by email</a>.</p>}
        </form>
        <aside className="card">
          <p className="cardLabel">Direct</p>
          <Defs items={[
            ["Email", <a className="textLink" href={`mailto:${SITE.email}`}>{SITE.email}</a>],
            ["LinkedIn", <a className="textLink" href={SITE.linkedin} rel="me noopener" target="_blank">linkedin.com/in/mdshafeek</a>],
            ["Based in", SITE.location],
            ["Open to", "Remote consulting worldwide, contracts, and full-time roles abroad (relocating with family)"],
          ]} />
        </aside>
      </div>
    </Page>
  );
}

function Thanks() {
  return (
    <Page title="Message sent">
      <div className="card empty" role="status">
        <span className="statusPill">Sent</span>
        <h1 className="emptyTitle">Thanks, I've got your message.</h1>
        <p className="emptyBody">I'll reply from {SITE.email} as soon as I can. If it's urgent, LinkedIn works too.</p>
        <div className="introActions"><Link className="button buttonGhost" href="/work/">Read the case studies</Link></div>
      </div>
    </Page>
  );
}

function NotFound() {
  return (
    <Page title="Not found">
      <div className="card empty">
        <h1 className="emptyTitle">That page isn't here.</h1>
        <p className="emptyBody">The site was rebuilt recently, so an old link may have moved.</p>
        <div className="introActions">
          <Link className="button buttonGhost" href="/">Overview</Link>
          <Link className="button buttonGhost" href="/work/">Case studies</Link>
        </div>
      </div>
    </Page>
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
