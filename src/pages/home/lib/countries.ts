import {
  UNKNOWN_CONTINENT,
  WORLDWIDE_LABEL,
  compareCountriesByName,
  continentName,
  continentSlugByName,
  findCountryMeta,
  isWorldwide,
  type ContinentSlug,
  type Country,
  type CountryMetaMap,
} from "@/entities/country";

export type SortDirection = "asc" | "desc";

export interface ContinentGroup {
  id: string;
  name: string;
  slug: ContinentSlug | null;
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
  if (direction === "desc") filtered.reverse();

  const worldwide = filtered.filter(isWorldwide);
  return [...worldwide, ...filtered.filter((country) => !isWorldwide(country))];
};

const resolveContinent = (
  country: Country,
  meta: CountryMetaMap | undefined,
): { name: string; slug: ContinentSlug | null } => {
  if (isWorldwide(country)) return { name: WORLDWIDE_LABEL, slug: null };
  if (country.continent) {
    return { name: continentName(country.continent) ?? UNKNOWN_CONTINENT, slug: country.continent };
  }

  const fallbackName = findCountryMeta(meta, country)?.continent;
  const fallbackSlug = continentSlugByName(fallbackName) ?? null;
  return {
    name: continentName(fallbackSlug) ?? UNKNOWN_CONTINENT,
    slug: fallbackSlug,
  };
};

const groupOrder = (name: string) => {
  if (name === WORLDWIDE_LABEL) return 0;
  if (name === UNKNOWN_CONTINENT) return 2;
  return 1;
};

export const groupByContinent = (
  countries: Country[],
  meta: CountryMetaMap | undefined,
): ContinentGroup[] => {
  const groups = new Map<string, ContinentGroup>();

  countries.forEach((country) => {
    const continent = resolveContinent(country, meta);
    const group = groups.get(continent.name) ?? {
      id: toContinentId(continent.name),
      name: continent.name,
      slug: continent.slug,
      countries: [],
    };
    group.countries.push(country);
    groups.set(continent.name, group);
  });

  return [...groups.values()].sort(
    (a, b) => groupOrder(a.name) - groupOrder(b.name) || a.name.localeCompare(b.name, "en"),
  );
};

export const resolveFlagFallback = (country: Country, meta: CountryMetaMap | undefined) =>
  country.known ? undefined : findCountryMeta(meta, country)?.flagUrl;
