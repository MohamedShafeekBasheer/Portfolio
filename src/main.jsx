import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App.jsx";
import { isKnown, normalise } from "./data.js";
import "./styles.css";

const root = document.getElementById("root");
const path = isKnown(location.pathname) ? normalise(location.pathname) : "/404.html";
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
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
