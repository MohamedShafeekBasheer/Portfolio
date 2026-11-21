import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { preloadNote } from "./notes.js";
export { meta, jsonLd, ROUTES, WORK, SITE, POSTS, URL_BASE, BASE, findPost } from "./data.js";

// `note` is the full note (with HTML) for a /notes/<slug>/ page, so it renders on the server.
export function render(path, note) {
  if (note) preloadNote(note);
  return renderToString(<App path={path} />);
}
