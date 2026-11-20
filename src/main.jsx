import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BASE, isKnown, normalise, stripBase } from "./data.js";
import { preloadNote } from "./notes.js";
import "./styles.css";

const root = document.getElementById("root");
const here = stripBase(location.pathname);
const path = isKnown(here) ? normalise(here) : "/404.html";

// A prerendered note page carries its own content, so it hydrates without a network request.
const embedded = document.getElementById("note-data");
if (embedded) {
  try { preloadNote(JSON.parse(embedded.textContent)); } catch { /* fetch on demand instead */ }
}
const app = <App path={path} />;

// The HTML is already prerendered, so the page is readable before this runs.
// If hydration fails for any reason, React re-renders on the client instead of crashing.
if (root.hasChildNodes()) {
  hydrateRoot(root, app, { onRecoverableError: () => {} });
} else {
  createRoot(root).render(app);
}
document.documentElement.classList.add("js");

// Offline support: cache pages and assets so repeat visits load instantly
// and the site still opens on a bad connection.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  addEventListener("load", () => {
    navigator.serviceWorker.register(BASE + "sw.js", { scope: BASE }).catch(() => {});
  });
}
