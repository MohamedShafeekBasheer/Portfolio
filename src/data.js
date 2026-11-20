import SITE from "./content/site.json";
import WORK from "./content/work.json";
import POSTS from "./content/posts.json";

export { SITE, WORK, POSTS };

/* The site can live at a domain root ("/") or under a sub-path such as
   "/Portfolio/" on GitHub Pages. BASE comes from Vite's `base` setting. */
export const BASE = import.meta.env.BASE_URL || "/";
export const withBase = (p) => (typeof p === "string" && p.startsWith("/") && !p.startsWith("//") ? BASE + p.slice(1) : p);
export function stripBase(pathname) {
  if (BASE !== "/" && pathname.startsWith(BASE)) return "/" + pathname.slice(BASE.length);
  if (BASE !== "/" && pathname === BASE.slice(0, -1)) return "/";
  return pathname;
}
const ORIGIN = (import.meta.env.VITE_SITE_ORIGIN || SITE.site_url).replace(/\/$/, "");
export const URL_BASE = ORIGIN + BASE.replace(/\/$/, "");

export const NAV = [
  ["/work/", "Work"],
  ["/services/", "Services"],
  ["/about/", "About"],
  ["/contact/", "Contact"],
];

export const ROUTES = [
  "/", "/hire/", "/work/", "/services/", "/about/", "/contact/", "/thanks/",
  ...WORK.map((w) => `/work/${w.slug}/`),
  "/notes/",
  ...POSTS.map((p) => `/notes/${p.slug}/`),
];

export function normalise(path) {
  if (!path) return "/";
  path = path.split(/[?#]/)[0];
  if (path.endsWith("/index.html")) path = path.slice(0, -10);
  if (!path.endsWith("/") && !path.includes(".")) path += "/";
  return path;
}

export function findCase(path) {
  const m = /^\/work\/([^/]+)\/$/.exec(path);
  return m ? WORK.find((w) => w.slug === m[1]) || null : null;
}

export function findPost(path) {
  const m = /^\/notes\/([^/]+)\/$/.exec(path);
  return m ? POSTS.find((p) => p.slug === m[1]) || null : null;
}

export function isKnown(path) {
  return ROUTES.includes(normalise(path));
}

/* ---------- structured data ---------- */

const PERSON = {
  "@type": "Person",
  "@id": `${URL_BASE}/#person`,
  name: SITE.name,
  jobTitle: SITE.role,
  url: `${URL_BASE}/`,
  image: `${URL_BASE}/img/portrait-card-hero.jpg`,
  email: `mailto:${SITE.email}`,
  sameAs: [SITE.linkedin],
  address: { "@type": "PostalAddress", addressLocality: "Abha", addressCountry: "SA" },
  worksFor: { "@type": "Organization", name: "Abdul Hadi Abdullah Al-Qahtani & Sons Beverage Company (AQS-PEPSI)" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Anna University" },
  knowsLanguage: ["en", "ta"],
  hasOccupation: SITE.target_roles.map((r) => ({
    "@type": "Occupation",
    name: r,
    occupationLocation: ["Saudi Arabia", "United Arab Emirates", "Qatar", "Singapore", "India"].map((c) => ({ "@type": "Country", name: c })),
    skills: "SharePoint Online, SPFx, Power Apps, Power Automate, Microsoft 365, Azure Functions, Microsoft Entra ID, Conditional Access",
  })),
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: "PL-900: Microsoft Power Platform Fundamentals",
    credentialCategory: "certification",
  },
  knowsAbout: [
    "SharePoint Online", "Microsoft 365", "Power Apps", "Power Automate", "SharePoint Framework (SPFx)",
    "InfoPath modernisation", "Google Workspace to Microsoft 365 migration", "Microsoft Entra ID",
    "Conditional Access", "Data loss prevention", "Azure Functions", "Dynamics 365 Finance & Operations integration", "Microsoft Copilot",
  ],
};

const SERVICE = {
  "@type": "ProfessionalService",
  "@id": `${URL_BASE}/#service`,
  name: `${SITE.name} — Microsoft 365 consulting`,
  url: `${URL_BASE}/services/`,
  image: `${URL_BASE}/og.png`,
  founder: { "@id": `${URL_BASE}/#person` },
  areaServed: "Worldwide",
  priceRange: "$35+/hour",
  email: SITE.email,
  address: { "@type": "PostalAddress", addressLocality: "Abha", addressCountry: "SA" },
  makesOffer: SITE.offers.map((o) => ({
    "@type": "Offer",
    name: o.name,
    description: o.text,
    ...(o.price === "$35" ? { price: "35", priceCurrency: "USD" } : {}),
  })),
};

const crumbs = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([p, n], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${URL_BASE}${p}` })),
});

/* ---------- per-page metadata ---------- */

export function meta(rawPath) {
  const path = normalise(rawPath);
  const c = findCase(path);
  const base = { path, ogType: "website", noindex: false, schema: [] };

  if (path === "/")
    return { ...base, title: SITE.home_title, description: SITE.home_description,
      schema: [SERVICE, { "@type": "WebSite", url: `${URL_BASE}/`, name: SITE.name }] };
  const post = findPost(path);
  if (path === "/notes/")
    return { ...base, title: `Notes — ${SITE.name}`,
      description: "Short, practical notes on SharePoint, SPFx, Power Platform, PnP PowerShell and Microsoft 365 governance from a working Microsoft 365 architect.",
      schema: [crumbs([["/", "Home"], ["/notes/", "Notes"]])] };
  if (post)
    return { ...base, ogType: "article", title: `${post.title} — ${SITE.name}`, description: post.summary,
      schema: [crumbs([["/", "Home"], ["/notes/", "Notes"], [path, post.title]]), {
        "@type": "BlogPosting", headline: post.title, description: post.summary, datePublished: post.date,
        author: { "@id": `${URL_BASE}/#person` }, mainEntityOfPage: `${URL_BASE}${path}`, keywords: post.tags.join(", "),
      }] };
  if (path === "/hire/")
    return { ...base, ogType: "profile", title: `Hire ${SITE.name} — SharePoint Developer, Microsoft 365 Consultant, Power Platform Developer`,
      description: "For recruiters: SharePoint Developer / Microsoft 365 Architect with 5 years in SPFx, Power Apps, Power Automate, Azure and M365 security. KSA-based, Iqama transferable. Open to Saudi Arabia, UAE, GCC, Singapore, India and remote. CV download.",
      schema: [crumbs([["/", "Home"], ["/hire/", "For recruiters"]]), { "@type": "ProfilePage", mainEntity: { "@id": `${URL_BASE}/#person` } }] };
  if (path === "/work/")
    return { ...base, title: `Case studies — ${SITE.name}`,
      description: "What was failing and how it was fixed: a contract platform on SPFx and Azure, InfoPath retirement, a 45,000-document migration, Dynamics 365 integration, SharePoint security remediation and more.",
      schema: [crumbs([["/", "Home"], ["/work/", "Work"]]), {
        "@type": "ItemList",
        itemListElement: WORK.map((w, i) => ({ "@type": "ListItem", position: i + 1, url: `${URL_BASE}/work/${w.slug}/`, name: w.title })),
      }] };
  if (c)
    return { ...base, ogType: "article", title: `${c.title} — ${SITE.name}`, description: c.summary,
      schema: [crumbs([["/", "Home"], ["/work/", "Work"], [path, c.title]]), {
        "@type": "Article", headline: c.title, description: c.summary, author: { "@id": `${URL_BASE}/#person` },
        image: `${URL_BASE}/og.png`, mainEntityOfPage: `${URL_BASE}${path}`, about: c.stack,
      }] };
  if (path === "/services/")
    return { ...base, title: `SharePoint & Microsoft 365 consulting — ${SITE.name}`,
      description: "Hire a SharePoint and Microsoft 365 consultant: $35/hour review calls, InfoPath and legacy SharePoint rescues, migrations, SPFx and Power Apps projects. Remote, worldwide.",
      schema: [SERVICE, crumbs([["/", "Home"], ["/services/", "Services"]])] };
  if (path === "/about/")
    return { ...base, ogType: "profile", title: `About — ${SITE.name}, Microsoft 365 consultant`,
      description: `${SITE.name}: Microsoft 365 and SharePoint architect at AQS-PEPSI, ex-EY GDS and Avasoft. Open to roles across the GCC, Singapore and India.`,
      schema: [crumbs([["/", "Home"], ["/about/", "About"]]), { "@type": "ProfilePage", mainEntity: { "@id": `${URL_BASE}/#person` } }] };
  if (path === "/contact/")
    return { ...base, title: `Contact — ${SITE.name}`,
      description: "Contact Mohamed Shafeek for SharePoint, Power Apps and Microsoft 365 consulting, projects, or roles abroad.",
      schema: [crumbs([["/", "Home"], ["/contact/", "Contact"]]), { "@type": "ContactPage", url: `${URL_BASE}/contact/` }] };
  if (path === "/thanks/")
    return { ...base, noindex: true, title: `Thanks — ${SITE.name}`, description: "Message sent." };
  return { ...base, path: "/404.html", noindex: true, title: `Page not found — ${SITE.name}`, description: "Page not found." };
}

export function jsonLd(m) {
  return { "@context": "https://schema.org", "@graph": [PERSON, ...m.schema] };
}
