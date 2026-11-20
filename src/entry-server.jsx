import { renderToString } from "react-dom/server";
import App from "./App.jsx";
export { meta, jsonLd, ROUTES, WORK, SITE, URL_BASE } from "./data.js";

export function render(path) {
  return renderToString(<App path={path} />);
}
