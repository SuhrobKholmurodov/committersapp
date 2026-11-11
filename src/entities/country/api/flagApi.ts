import { baseApi } from "@/shared/api";
import { UNKNOWN_CONTINENT, normalizeCountryName } from "../lib/country";
import type { CountryMeta, CountryMetaMap } from "../model/types";

interface RestCountry {
  names?: {
    common?: string;
    official?: string;
    alternates?: string[];
  };
  codes?: { alpha_2?: string; alpha_3?: string };
  flag?: {
    url_png?: string;
    url_svg?: string;
  };
  continents?: string[];
}

interface RestCountriesResponse {
  data?: {
    objects?: RestCountry[];
  };
}

const resolveFlagUrl = (country: RestCountry) => {
  const code = country.codes?.alpha_2?.toLowerCase();
  if (code && /^[a-z]{2}$/.test(code)) return `https://flagcdn.com/w80/${code}.png`;
  return country.flag?.url_png || country.flag?.url_svg || "";
};

const collectNames = (country: RestCountry) =>
  [country.names?.common, country.names?.official, ...(country.names?.alternates ?? [])]
    .filter((name): name is string => Boolean(name))
    .map(normalizeCountryName)
    .filter(Boolean);

export const flagApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCountryMeta: build.query<CountryMetaMap, void>({
      query: () => "flags",
      transformResponse: (response: RestCountriesResponse) => {
        const countries = response?.data?.objects;
        if (!Array.isArray(countries)) return {};

        return countries.reduce<CountryMetaMap>((acc, country) => {
          const meta: CountryMeta = {
            flagUrl: resolveFlagUrl(country),
            continent: country.continents?.[0] || UNKNOWN_CONTINENT,
          };

          collectNames(country).forEach((name, index) => {
            if (index === 0 || !acc[name]) acc[name] = meta;
          });

          return acc;
        }, {});
      },
    }),
  }),
});

export const { useGetCountryMetaQuery } = flagApi;
