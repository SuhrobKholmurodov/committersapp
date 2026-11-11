import { baseApi } from "@/shared/api";
import { enrichCountry } from "../lib/country";
import type { Country, CountryResponse } from "../model/types";

const isCountryResponse = (item: unknown): item is CountryResponse =>
  typeof item === "object" &&
  item !== null &&
  typeof (item as CountryResponse).slug === "string" &&
  typeof (item as CountryResponse).name === "string";

export const countryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCountries: build.query<Country[], void>({
      query: () => "countries",
      transformResponse: (response: unknown) =>
        Array.isArray(response)
          ? response.filter(isCountryResponse).map(enrichCountry)
          : [],
    }),
  }),
});

export const { useGetCountriesQuery } = countryApi;
