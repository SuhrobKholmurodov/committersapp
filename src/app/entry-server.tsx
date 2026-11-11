import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import type { HelmetServerState } from "react-helmet-async";
import { StaticRouter, matchPath } from "react-router-dom";
import {
  DEFAULT_COMMITTER_MODE,
  committerApi,
  type CountryCommittersArg,
} from "@/entities/committer";
import {
  CONTINENTS,
  continentPath,
  countryApi,
  countryPath,
  findContinent,
  type Country,
} from "@/entities/country";
import { baseApi } from "@/shared/api";
import { SITE_URL } from "@/shared/config";
import { parseApiDate } from "@/shared/lib/format";
import { App } from "./App";
import { AppProviders } from "./providers/AppProviders";
import {
  PRELOADED_DATA_ELEMENT_ID,
  applyPreloadedData,
  serializePreloadedData,
  type PreloadedData,
} from "./store/preloadedData";
import { makeStore, type AppStore } from "./store/store";

export interface PrerenderedPage {
  path: string;
  status: number;
  head: string;
  html: string;
  preloadedData: string;
  lastModified: string | null;
}

export { CONTINENTS, PRELOADED_DATA_ELEMENT_ID, SITE_URL, continentPath, countryPath };

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async <T,>(task: () => Promise<T>): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt < RETRY_ATTEMPTS) await wait(RETRY_DELAY_MS * attempt);
    }
  }

  throw lastError;
};

const releaseStore = (store: AppStore) => {
  store.dispatch(baseApi.util.resetApiState());
};

export const fetchCountries = async (): Promise<Country[]> => {
  const store = makeStore();

  try {
    return await withRetry(() =>
      store
        .dispatch(
          countryApi.endpoints.getCountries.initiate(undefined, {
            subscribe: false,
            forceRefetch: true,
          }),
        )
        .unwrap(),
    );
  } finally {
    releaseStore(store);
  }
};

const fetchCountryCommitters = (store: AppStore, arg: CountryCommittersArg) =>
  withRetry(() =>
    store
      .dispatch(
        committerApi.endpoints.getCountryCommitters.initiate(arg, {
          subscribe: false,
          forceRefetch: true,
        }),
      )
      .unwrap(),
  );

const renderHead = ({ helmet }: { helmet?: HelmetServerState }) =>
  helmet
    ? [helmet.priority, helmet.title, helmet.meta, helmet.link, helmet.script]
        .map((datum) => datum.toString())
        .filter(Boolean)
        .join("\n    ")
    : "";

export const renderPage = async (
  path: string,
  countries: Country[],
): Promise<PrerenderedPage> => {
  const store = makeStore();
  const preloadedData: PreloadedData = { countries };
  applyPreloadedData(store, preloadedData);

  let status = 200;
  let lastModified: string | null = null;

  const continentMatch = matchPath("/continent/:continent", path);

  if (continentMatch) {
    status = findContinent(continentMatch.params.continent) ? 200 : 404;
  } else if (path !== "/") {
    const slug = matchPath("/:slug", path)?.params.slug;
    const isKnownCountry = Boolean(slug && countries.some((country) => country.slug === slug));

    if (slug && isKnownCountry) {
      const arg: CountryCommittersArg = { country: slug, mode: DEFAULT_COMMITTER_MODE };

      try {
        const data = await fetchCountryCommitters(store, arg);
        preloadedData.countryCommitters = { arg, data };
        lastModified = parseApiDate(data.generatedAt)?.toISOString() ?? null;
      } catch (error) {
        console.warn(`Prerender: no committers data for "${slug}"`, error);
        releaseStore(store);
        applyPreloadedData(store, { countries });
      }
    } else {
      status = 404;
    }
  }

  const helmetContext: { helmet?: HelmetServerState } = {};

  try {
    const html = renderToString(
      <StrictMode>
        <AppProviders store={store} helmetContext={helmetContext}>
          <StaticRouter location={path}>
            <App />
          </StaticRouter>
        </AppProviders>
      </StrictMode>,
    );

    return {
      path,
      status,
      head: renderHead(helmetContext),
      html,
      preloadedData: serializePreloadedData(preloadedData),
      lastModified,
    };
  } finally {
    releaseStore(store);
  }
};
