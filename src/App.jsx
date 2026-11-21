import { RouterProvider, useRouter } from "./router.jsx";
import { ErrorBoundary, Footer, Header } from "./components.jsx";
import { Route } from "./pages.jsx";

function Shell() {
  const { path } = useRouter();
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <main id="main" key={path}>
        <ErrorBoundary resetKey={path}>
          <Route path={path} />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}

export default function App({ path }) {
  return (
    <RouterProvider initialPath={path}>
      <Shell />
    </RouterProvider>
  );
}
