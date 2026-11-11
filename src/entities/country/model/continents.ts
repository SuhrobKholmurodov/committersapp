export const CONTINENTS = [
  { slug: "africa", name: "Africa" },
  { slug: "asia", name: "Asia" },
  { slug: "europe", name: "Europe" },
  { slug: "north-america", name: "North America" },
  { slug: "south-america", name: "South America" },
  { slug: "oceania", name: "Oceania" },
] as const;

export type ContinentSlug = (typeof CONTINENTS)[number]["slug"];

export type Continent = (typeof CONTINENTS)[number];

export const findContinent = (slug: string | undefined): Continent | undefined =>
  CONTINENTS.find((continent) => continent.slug === slug);
