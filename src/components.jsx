import { Component } from "react";
import { Link, useRouter } from "./router.jsx";
import { SITE, withBase } from "./data.js";

const NAV = [
  ["/work/", "Work"],
  ["/notes/", "Notes"],
  ["/about/", "About"],
  ["/hire/", "Hire me"],
];

const isActive = (path, href) => path.startsWith(href);

export function Header() {
  const { path, loading } = useRouter();
  return (
    <header className="site-header">
      <div className="column header-row">
        <Link className="site-name" href="/">{SITE.name}</Link>
        <nav aria-label="Main">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} aria-current={isActive(path, href) ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
      </div>
      <div className={`progress${loading ? " is-on" : ""}`} aria-hidden="true" />
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="column">
        <p>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          {" · "}<a href={SITE.linkedin} rel="me noopener" target="_blank">LinkedIn</a>
          {" · "}<Link href="/services/">Consulting</Link>
          {" · "}<a href={withBase("/notes/rss.xml")}>RSS</a>
        </p>
        <p className="muted">© {new Date().getFullYear()} {SITE.name} · {SITE.location}</p>
      </div>
    </footer>
  );
}

export function Portrait({ size = 72, eager = false }) {
  return (
    <picture className="portrait">
      <source type="image/webp" srcSet={withBase("/img/portrait-card-320.webp")} />
      <img src={withBase("/img/portrait-card-hero.jpg")} width={size} height={size} alt={`Photo of ${SITE.name}`}
        decoding="async" loading={eager ? "eager" : "lazy"} />
    </picture>
  );
}

/* Short "who wrote this" block shown under notes and case studies. */
export function AuthorBox() {
  return (
    <aside className="author" aria-label="About the author">
      <Portrait size={56} />
      <div>
        <p><strong>{SITE.name}</strong> runs SharePoint, Microsoft 365 and the Power Platform for a five-company group in Saudi Arabia. Previously at EY GDS and Avasoft.</p>
        <p><Link href="/hire/">Hiring?</Link> · <Link href="/contact/">Get in touch</Link></p>
      </div>
    </aside>
  );
}

export function statusText(status) {
  return /complete/i.test(status) ? "completed" : "in rollout";
}

/* If a page throws, show a working fallback instead of a blank screen. */
export class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidUpdate(prev) { if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null }); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="column page" role="alert">
        <h1>Something went wrong on this page.</h1>
        <p>Reloading usually fixes it. <a href={typeof location !== "undefined" ? location.pathname : withBase("/")}>Reload</a> or go to the <a href={withBase("/")}>home page</a>.</p>
      </div>
    );
  }
}
