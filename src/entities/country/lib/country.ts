import { capitalize } from "@/shared/lib/format";
import { CONTINENTS, findContinent, type ContinentSlug } from "../model/continents";
import { COUNTRY_PROFILES, WORLDWIDE_SLUG } from "../model/profiles";
import type { Country, CountryMeta, CountryMetaMap, CountryResponse } from "../model/types";

export const UNKNOWN_CONTINENT = "Other";

export const WORLDWIDE_LABEL = "Worldwide";

export const normalizeCountryName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/[^a-z0-9]/g, "");

export const formatCountrySlug = (slug: string) =>
  slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => (word === "and" || word === "of" ? word : capitalize(word)))
    .join(" ");

export const enrichCountry = ({ slug, name }: CountryResponse): Country => {
  const profile = COUNTRY_PROFILES[slug];

  return {
    slug,
    name: profile?.name ?? name,
    code: profile?.code ?? null,
    continent: profile?.continent ?? null,
    definite: profile?.definite ?? false,
    known: Boolean(profile),
  };
};

export const isWorldwide = (country: Pick<Country, "slug">) =>
  country.slug === WORLDWIDE_SLUG;

export const countryPath = (slug: string) => `/${slug}`;

export const continentPath = (slug: ContinentSlug) => `/continent/${slug}`;

export const flagUrl = (code: string, width: 20 | 40 | 80 | 160 = 40) =>
  `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`;

export const countryLocation = (country: Pick<Country, "slug" | "name" | "definite">) => {
  if (isWorldwide(country)) return "worldwide";
  if (country.definite) return `in the ${country.name}`;
  return `in ${country.name.replace(/^The\s/, "the ")}`;
};

export const countryOrigin = (country: Pick<Country, "slug" | "name" | "definite">) => {
  if (isWorldwide(country)) return "from around the world";
  return countryLocation(country).replace(/^in /, "from ");
};

export const countryHeadingLocation =(country: Pick<Country, "slug" | "name" | "definite">) =>
  isWorldwide(country) ? WORLDWIDE_LABEL : countryLocation(country);

export const continentName = (slug: ContinentSlug | null | undefined) =>
  findContinent(slug ?? undefined)?.name;

export const continentSlugByName = (name: string | undefined) =>
  CONTINENTS.find((continent) => continent.name.toLowerCase() === name?.toLowerCase())?.slug;

export const findCountryMeta = (
  meta: CountryMetaMap | undefined,
  country: Pick<Country, "name">,
): CountryMeta | undefined => meta?.[normalizeCountryName(country.name)];

export const compareCountriesByName = (a: Pick<Country, "name">, b: Pick<Country, "name">) =>
  a.name.localeCompare(b.name, "en");

export const countriesInContinent = (countries: Country[], slug: ContinentSlug) =>
  countries.filter((country) => country.continent === slug).sort(compareCountriesByName);
