import { Component, useEffect, useState } from "react";
import { Link, useRouter } from "./router.jsx";
import { SITE, withBase } from "./data.js";

/* ---------- icons (16px line icons, no icon font) ---------- */
const PATHS = {
  overview: "M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z",
  work: "M3 2.5h7l3 3v8H3zM10 2.5v3h3M5.5 8.5h5M5.5 11h5",
  services: "M2.5 5.5h11v8h-11zM6 5.5V3.5h4v2M2.5 9h11",
  about: "M8 8a2.75 2.75 0 1 0 0-5.5A2.75 2.75 0 0 0 8 8zM3 13.5c.6-2.4 2.6-3.5 5-3.5s4.4 1.1 5 3.5",
  writing: "M10.5 2.5l3 3-7.5 7.5H3v-3zM9 4l3 3",
  contact: "M2.5 3.5h11v9h-11zM2.5 4l5.5 4.5L13.5 4",
  hire: "M2.5 4h11v9h-11zM5.5 7a1.25 1.25 0 1 0 0-.01M4 11c.3-1 1-1.5 1.5-1.5S6.7 10 7 11M9 7h3M9 9.5h3",
  linkedin: "M3 6v7M3 3.2v.1M6.5 13V6M6.5 9c0-1.8 1-3 2.6-3S11.5 7.2 11.5 9v4",
  external: "M6 3.5H3.5v9h9V10M9 3h4v4M13 3L7.5 8.5",
};
export function Icon({ name, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}

const MAIN_NAV = [
  ["/", "Overview", "overview"],
  ["/hire/", "For recruiters", "hire"],
  ["/work/", "Case studies", "work"],
  ["/services/", "Services", "services"],
  ["/about/", "About", "about"],
  ["/contact/", "Contact", "contact"],
];

function isActive(path, href) {
  return href === "/" ? path === "/" : path.startsWith(href);
}

/* Local time — placeholder on the server, filled in on the client. */
export function Clock() {
  const [t, setT] = useState("--:--");
  useEffect(() => {
    const f = () => {
      try {
        setT(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: SITE.timezone }).format(new Date()));
      } catch { /* keep placeholder */ }
    };
    f();
    const id = setInterval(f, 30000);
    return () => clearInterval(id);
  }, []);
  return <span className="mono">{t}</span>;
}

export function Nav() {
  const { path } = useRouter();
  return (
    <nav className="nav" aria-label="Main">
      <Link className="brand" href="/" aria-label={`${SITE.name} — home`}>
        <span className="brandMark" aria-hidden="true">MS</span>
        <span className="brandName"><strong>{SITE.name}</strong><span>M365 &amp; SharePoint Architect</span></span>
      </Link>

      <div className="navGroup">
        <p className="navLabel">Portfolio</p>
        {MAIN_NAV.slice(0, 5).map(([href, label, icon]) => (
          <Link key={href} href={href} title={label}
            className={`navItem${isActive(path, href) ? " navItemActive" : ""}`}
            aria-current={isActive(path, href) ? "page" : undefined}>
            <Icon name={icon} /><span className="navText">{label}</span>
          </Link>
        ))}
        <Link href="/notes/" title="Notes"
          className={`navItem${isActive(path, "/notes/") ? " navItemActive" : ""}`}
          aria-current={isActive(path, "/notes/") ? "page" : undefined}>
          <Icon name="writing" /><span className="navText">Notes</span>
        </Link>
      </div>

      <div className="navGroup">
        <p className="navLabel">Get in touch</p>
        <Link href="/contact/" title="Contact"
          className={`navItem${isActive(path, "/contact/") ? " navItemActive" : ""}`}
          aria-current={isActive(path, "/contact/") ? "page" : undefined}>
          <Icon name="contact" /><span className="navText">Contact</span>
        </Link>
        <a className="navItem" href={SITE.linkedin} rel="me noopener" target="_blank" title="LinkedIn (opens in a new tab)">
          <Icon name="linkedin" /><span className="navText">LinkedIn</span><span className="navHint"><Icon name="external" size={12} /></span>
        </a>
      </div>

      <div className="navSpacer" />
      <div className="navFoot">
        <span className="statusPill statusPillDark">Available</span>
        <p>Consulting, projects and roles abroad. <Clock /> in Abha.</p>
      </div>
    </nav>
  );
}

export function TabBar() {
  const { path } = useRouter();
  return (
    <nav className="tabbar" aria-label="Main">
      {MAIN_NAV.map(([href, label, icon]) => (
        <Link key={href} href={href} className={isActive(path, href) ? "navItemActive" : undefined}
          aria-current={isActive(path, href) ? "page" : undefined}>
          <Icon name={icon} size={18} /><span>{{ "Case studies": "Work", "For recruiters": "Hire" }[label] || label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function Header({ title, crumb, primary = true }) {
  const { loading } = useRouter();
  return (
    <header className="header">
      <div className="headerTitle">
        {crumb && <span className="crumb">{crumb[0] ? <Link href={crumb[0]}>{crumb[1]}</Link> : crumb[1]} /</span>}
        <strong>{title}</strong>
      </div>
      <div className="headerActions printHide">
        <a className="button buttonGhost" href={`mailto:${SITE.email}`}>Email</a>
        {primary && <Link className="button buttonPrimary" href="/contact/?topic=Microsoft%20365%20review%20call">Book a call</Link>}
      </div>
      <div className="progressTrack" aria-hidden="true"><div className={`progressFill${loading ? " isOn" : ""}`} /></div>
    </header>
  );
}

export function StatusBar() {
  return (
    <footer className="statusBar">
      <span>© {new Date().getFullYear()} {SITE.name}</span>
      <span>{SITE.location} · <Clock /> local time</span>
      <span><a href={`mailto:${SITE.email}`}>{SITE.email}</a></span>
      <span>No cookies, no trackers</span>
    </footer>
  );
}

export function Portrait({ eager = false }) {
  return (
    <picture className="portrait">
      <source type="image/webp" srcSet={withBase("/img/portrait-card-320.webp")} />
      <img src={withBase("/img/portrait-card-hero.jpg")} width="96" height="96" alt={`Portrait of ${SITE.name}`}
        decoding="async" loading={eager ? "eager" : "lazy"} />
    </picture>
  );
}

export function StatusPill({ status }) {
  const done = /complete/i.test(status);
  return <span className={`statusPill${done ? "" : " statusPillWarn"}`}>{done ? "Completed" : "In rollout"}</span>;
}

/* If a page throws, show a working fallback instead of a blank screen. */
export class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidUpdate(prev) { if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null }); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="content"><div className="card empty" role="alert">
        <h1 className="emptyTitle">This page hit an error.</h1>
        <p className="emptyBody">Reloading usually fixes it. The rest of the site still works.</p>
        <div className="introActions">
          <a className="button buttonPrimary" href={typeof location !== "undefined" ? location.pathname : withBase("/")}>Reload</a>
          <a className="button buttonGhost" href={withBase("/")}>Overview</a>
        </div>
      </div></div>
    );
  }
}
