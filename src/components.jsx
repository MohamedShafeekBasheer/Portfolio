import { Component, useEffect, useState } from "react";
import { Link, useRouter } from "./router.jsx";
import { NAV, SITE, WORK } from "./data.js";

export function LoadingBar() {
  const { loading } = useRouter();
  return <div className={`loadbar${loading ? " is-on" : ""}`} aria-hidden="true" />;
}

export function Header() {
  const { path } = useRouter();
  return (
    <header className="top">
      <div className="wrap top-in">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">MS</span>
          <span className="brand-name">{SITE.name}</span>
        </Link>
        <nav aria-label="Main">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path === href || (href === "/work/" && path.startsWith("/work/")) ? "page" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <div>
          <p className="foot-name">{SITE.name}</p>
          <p>{SITE.role}<br />{SITE.location} · working worldwide</p>
        </div>
        <div className="foot-links">
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={SITE.linkedin} rel="me noopener" target="_blank">LinkedIn</a>
        </div>
        <p className="foot-small">© {new Date().getFullYear()} {SITE.name}. No cookies, no trackers.</p>
      </div>
    </footer>
  );
}

export function Portrait({ className = "portrait", eager = false }) {
  return (
    <picture className={className}>
      <source type="image/webp" sizes="(max-width: 760px) 70vw, 320px"
        srcSet="/img/portrait-card-320.webp 320w, /img/portrait-card-560.webp 560w, /img/portrait-card-760.webp 760w" />
      <img src="/img/portrait-card-hero.jpg" width="760" height="962" alt={`Portrait of ${SITE.name}`}
        decoding="async" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} />
    </picture>
  );
}

/* Local time — rendered as a placeholder on the server, filled in on the client. */
export function Clock() {
  const [t, setT] = useState("—");
  useEffect(() => {
    const f = () => {
      try {
        setT(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", weekday: "short", timeZone: SITE.timezone }).format(new Date()));
      } catch { /* keep placeholder */ }
    };
    f();
    const id = setInterval(f, 30000);
    return () => clearInterval(id);
  }, []);
  return <span className="clock">{t}</span>;
}

export function Status() {
  return (
    <dl className="status">
      <div><dt>Now</dt><dd>{SITE.current}</dd></div>
      <div><dt>Taking on</dt><dd>{SITE.availability.short}</dd></div>
      <div><dt>Local time</dt><dd><Clock /> in Abha</dd></div>
    </dl>
  );
}

/* Hero ticker: cycles through "before → after" from the case studies. */
export function Ticker() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % WORK.length), 3600);
    return () => clearInterval(id);
  }, [paused]);
  const w = WORK[i];
  return (
    <div className="ticker" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <p className="ticker-label"><span>Before</span><span>After</span></p>
      <Link href={`/work/${w.slug}/`} className="ticker-row" key={w.slug}>
        <s className="ticker-before">{w.swap[0]}</s>
        <span className="ticker-arrow" aria-hidden="true">→</span>
        <strong className="ticker-after">{w.swap[1]}</strong>
      </Link>
      <div className="ticker-dots" role="tablist" aria-label="Case studies">
        {WORK.map((x, n) => (
          <button key={x.slug} type="button" role="tab" aria-selected={n === i} aria-label={x.title}
            className={n === i ? "on" : ""} onClick={() => { setI(n); setPaused(true); }} />
        ))}
      </div>
    </div>
  );
}

export function WorkRows({ items }) {
  return (
    <ol className="rows">
      {items.map((w, n) => (
        <li key={w.slug}>
          <Link href={`/work/${w.slug}/`} className="row">
            <span className="row-no">{String(n + 1).padStart(2, "0")}</span>
            <span className="row-main">
              <span className="row-title">{w.title}</span>
              <span className="row-swap"><s>{w.swap[0]}</s> → <b>{w.swap[1]}</b></span>
            </span>
            <span className="row-meta">{w.client}<br />{w.region} · {w.status}</span>
            <span className="row-go" aria-hidden="true">↗</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function Offers() {
  return (
    <div className="offers">
      {SITE.offers.map((o) => (
        <article className="offer" key={o.name}>
          <h3>{o.name}</h3>
          <p className="price"><strong>{o.price}</strong> {o.unit}</p>
          <p className="offer-text">{o.text}</p>
          <Link className="link" href={`/contact/?topic=${encodeURIComponent(o.subject)}`}>{o.cta} →</Link>
        </article>
      ))}
    </div>
  );
}

export function Help({ items = SITE.help_with }) {
  return (
    <dl className="help">
      {items.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
    </dl>
  );
}

export function Timeline() {
  return (
    <ol className="timeline">
      {SITE.timeline.map(([when, role, org, text]) => (
        <li key={when + org}>
          <span className="tl-when">{when}</span>
          <div><h3>{role}</h3><p className="tl-org">{org}</p><p>{text}</p></div>
        </li>
      ))}
    </ol>
  );
}

export function Cta({ text = "Have a Microsoft 365 system that's failing — or a role abroad you think I'd fit?" }) {
  return (
    <section className="cta">
      <div className="wrap">
        <p className="cta-text">{text}</p>
        <p className="cta-actions">
          <Link className="btn btn-lime" href="/contact/">Get in touch</Link>
          <a className="cta-mail" href={`mailto:${SITE.email}`}>or email {SITE.email}</a>
        </p>
      </div>
    </section>
  );
}

/* If any page throws, show a working fallback instead of a blank screen. */
export class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidUpdate(prev) { if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null }); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <section className="wrap page-head narrow">
        <p className="kicker">Something went wrong</p>
        <h1>This page hit an error.</h1>
        <p className="lede">Reloading usually fixes it. Everything else on the site still works.</p>
        <p className="actions">
          <a className="btn" href={typeof location !== "undefined" ? location.pathname : "/"}>Reload</a>
          <a className="link" href="/">Home</a>
          <a className="link" href={`mailto:${SITE.email}`}>Email me</a>
        </p>
      </section>
    );
  }
}
