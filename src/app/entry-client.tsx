import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { AppProviders } from "./providers/AppProviders";
import { applyPreloadedData, readPreloadedData } from "./store/preloadedData";
import { makeStore } from "./store/store";
import "./styles/index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root was not found");
}

const store = makeStore();
const preloadedData = readPreloadedData();

if (preloadedData) {
  applyPreloadedData(store, preloadedData);
}

const app = (
  <StrictMode>
    <AppProviders store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProviders>
  </StrictMode>
);

const canHydrate =
  container.dataset.prerenderedPath === window.location.pathname &&
  window.location.search === "";

if (canHydrate) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
