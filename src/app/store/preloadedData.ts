import {
  committerApi,
  type CountryCommitters,
  type CountryCommittersArg,
} from "@/entities/committer";
import { countryApi, type Country } from "@/entities/country";
import type { AppStore } from "./store";

export const PRELOADED_DATA_ELEMENT_ID = "__PRELOADED_DATA__";

export interface PreloadedData {
  countries?: Country[];
  countryCommitters?: {
    arg: CountryCommittersArg;
    data: CountryCommitters;
  };
}

export const applyPreloadedData = (store: AppStore, data: PreloadedData) => {
  if (data.countries) {
    store.dispatch(
      countryApi.util.upsertQueryEntries([
        { endpointName: "getCountries", arg: undefined, value: data.countries },
      ]),
    );
  }

  if (data.countryCommitters) {
    store.dispatch(
      committerApi.util.upsertQueryEntries([
        {
          endpointName: "getCountryCommitters",
          arg: data.countryCommitters.arg,
          value: data.countryCommitters.data,
        },
      ]),
    );
  }
};

export const serializePreloadedData = (data: PreloadedData) =>
  JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

export const readPreloadedData = (): PreloadedData | null => {
  const element = document.getElementById(PRELOADED_DATA_ELEMENT_ID);
  if (!element?.textContent) return null;

  try {
    return JSON.parse(element.textContent) as PreloadedData;
  } catch {
    return null;
  }
};
