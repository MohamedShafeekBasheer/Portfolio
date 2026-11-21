import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { isKnown, meta, normalise, stripBase, withBase } from "./data.js";
import { trackPage } from "./analytics.js";

/*
 * A tiny router. Every page is also a real prerendered HTML file, so links
 * work without JavaScript; with JavaScript, navigation stays in-page,
 * shows a short loading bar and uses a view transition where supported.
 */

const RouterCtx = createContext({ path: "/", navigate: () => {}, loading: false });

export function useRouter() {
  return useContext(RouterCtx);
}

function applyMeta(path) {
  const m = meta(path);
  document.title = m.title;
  const set = (sel, attr, val) => {
    const el = document.querySelector(sel);
    if (el) el.setAttribute(attr, val);
  };
  set('meta[name="description"]', "content", m.description);
  set('meta[property="og:title"]', "content", m.title);
  set('meta[property="og:description"]', "content", m.description);
  set('link[rel="canonical"]', "href", location.origin + withBase(m.path));
}

export function RouterProvider({ initialPath, children }) {
  const [path, setPath] = useState(normalise(initialPath));
  const [loading, setLoading] = useState(false);
  const timer = useRef(0);

  const go = useCallback((next, { push = true } = {}) => {
    const swap = () => {
      setPath(next);
      if (push) window.scrollTo(0, 0);
      applyMeta(next);
      trackPage();
      requestAnimationFrame(() => {
        const h1 = document.querySelector("main h1");
        if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
      });
    };
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), 420);
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(swap);
    } else {
      swap();
    }
  }, []);

  const navigate = useCallback((href) => {
    const url = new URL(withBase(href), location.href);
    const next = normalise(stripBase(url.pathname));
    if (url.origin !== location.origin || !isKnown(next)) {
      location.href = url.href;
      return;
    }
    if (withBase(next) + url.search === location.pathname + location.search) return;
    history.pushState({}, "", withBase(next) + url.search + url.hash);
    go(next);
  }, [go]);

  useEffect(() => {
    const onPop = () => go(normalise(stripBase(location.pathname)), { push: false });
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, [go]);

  return <RouterCtx.Provider value={{ path, navigate, loading }}>{children}</RouterCtx.Provider>;
}

export function Link({ href, children, ...rest }) {
  const { navigate } = useRouter();
  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target === "_blank") return;
    e.preventDefault();
    navigate(href);
  };
  return <a href={withBase(href)} onClick={onClick} {...rest}>{children}</a>;
}
