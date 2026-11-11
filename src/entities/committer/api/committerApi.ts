import { baseApi } from "@/shared/api";
import type { CountryCommitters, CountryCommittersArg } from "../model/types";

export const committerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCountryCommitters: build.query<CountryCommitters, CountryCommittersArg>({
      query: ({ country, mode }) =>
        `committers/${encodeURIComponent(country)}/${mode}`,
    }),
  }),
});

export const { useGetCountryCommittersQuery } = committerApi;
