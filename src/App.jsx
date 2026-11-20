import { RouterProvider, useRouter } from "./router.jsx";
import { ErrorBoundary, Footer, Header, LoadingBar } from "./components.jsx";
import { Page } from "./pages.jsx";

function Shell() {
  const { path } = useRouter();
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <LoadingBar />
      <Header />
      <main id="main" key={path} className="page">
        <ErrorBoundary resetKey={path}>
          <Page path={path} />
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
