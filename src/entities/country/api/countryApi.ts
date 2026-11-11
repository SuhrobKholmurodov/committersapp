import { baseApi } from "@/shared/api";
import type { Country } from "../model/types";

export const countryApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCountries: build.query<Country[], void>({
      query: () => "countries",
      transformResponse: (response: unknown) =>
        Array.isArray(response)
          ? response.filter(
              (item): item is Country =>
                typeof item?.slug === "string" && typeof item?.name === "string",
            )
          : [],
    }),
  }),
});

export const { useGetCountriesQuery } = countryApi;
