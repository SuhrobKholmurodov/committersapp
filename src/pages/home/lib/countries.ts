import {
  UNKNOWN_CONTINENT,
  compareCountriesByName,
  findCountryMeta,
  type Country,
  type CountryMetaMap,
} from "@/entities/country";

export type SortDirection = "asc" | "desc";

export interface ContinentGroup {
  id: string;
  name: string;
  countries: Country[];
}

export const toContinentId = (continent: string) =>
  `continent-${continent.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

export const filterAndSortCountries = (
  countries: Country[],
  query: string,
  direction: SortDirection,
) => {
  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? countries.filter(
        (country) =>
          country.name.toLowerCase().includes(normalized) ||
          country.slug.toLowerCase().includes(normalized),
      )
    : [...countries];

  filtered.sort(compareCountriesByName);
  return direction === "asc" ? filtered : filtered.reverse();
};

export const groupByContinent = (
  countries: Country[],
  meta: CountryMetaMap | undefined,
): ContinentGroup[] => {
  const groups = new Map<string, Country[]>();

  countries.forEach((country) => {
    const continent = findCountryMeta(meta, country)?.continent || UNKNOWN_CONTINENT;
    groups.set(continent, [...(groups.get(continent) ?? []), country]);
  });

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "en"))
    .map(([name, items]) => ({ id: toContinentId(name), name, countries: items }));
};
