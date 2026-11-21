import { SITE } from "./data.js";

/* Anonymous visit counts with GoatCounter (https://www.goatcounter.com).
   No cookies, no third-party script, nothing that identifies a visitor: each page view
   sends one tiny image request. Off until `goatcounter_code` is set in site.json.
   Visitors who switch on "Do Not Track" are never counted. */
const code = SITE.goatcounter_code;
const endpoint = code ? `https://${code}.goatcounter.com/count` : "";

function send(params) {
  if (!endpoint || typeof window === "undefined") return;
  if (navigator.doNotTrack === "1" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;
  try {
    const q = new URLSearchParams({ ...params, rnd: Math.random().toString(36).slice(2) });
    new Image().src = `${endpoint}?${q}`;
  } catch { /* counting must never break the site */ }
}

export function trackPage() {
  send({
    p: location.pathname,
    t: document.title,
    r: document.referrer || "",
    s: `${screen.width},${screen.height},${window.devicePixelRatio || 1}`,
  });
}

/* Named events, e.g. "cv-download", show up as their own rows in GoatCounter. */
export function trackEvent(name) {
  send({ p: name, t: name, e: "true" });
}
