import { capitalize } from "@/shared/lib/format";
import type { Country, CountryMeta, CountryMetaMap } from "../model/types";

export const UNKNOWN_CONTINENT = "Other";

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

export const countryPath = (slug: string) => `/${slug}`;

export const findCountryMeta = (
  meta: CountryMetaMap | undefined,
  country: Country,
): CountryMeta | undefined => meta?.[normalizeCountryName(country.name)];

export const compareCountriesByName = (a: Country, b: Country) =>
  a.name.localeCompare(b.name, "en");
