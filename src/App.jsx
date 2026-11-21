import { RouterProvider, useRouter } from "./router.jsx";
import { ErrorBoundary, Nav, StatusBar, TabBar } from "./components.jsx";
import { Route } from "./pages.jsx";

function Shell() {
  const { path } = useRouter();
  return (
    <div className="shell">
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main" className="main" key={path}>
        <ErrorBoundary resetKey={path}>
          <Route path={path} />
        </ErrorBoundary>
        <StatusBar />
      </main>
      <TabBar />
    </div>
  );
}

export default function App({ path }) {
  return (
    <RouterProvider initialPath={path}>
      <Shell />
    </RouterProvider>
  );
}
