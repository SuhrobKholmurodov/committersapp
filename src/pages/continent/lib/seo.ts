import {
  continentPath,
  countryLocation,
  countryPath,
  type Continent,
  type Country,
} from "@/entities/country";
import { SITE_LANGUAGE } from "@/shared/config";
import {
  WEBSITE_ID,
  absoluteUrl,
  breadcrumbNode,
  type JsonLdNode,
} from "@/shared/seo";

export const buildContinentHeading = (continent: Continent) =>
  `Top GitHub Committers in ${continent.name}`;

export const buildContinentTitle = (continent: Continent, countriesCount: number) =>
  `${buildContinentHeading(continent)} – Rankings for ${countriesCount} Countries`;

export const buildContinentDescription = (continent: Continent, countries: Country[]) =>
  `Compare the most active GitHub users in ${countries.length} countries of ${continent.name}. See top open-source developers and commit rankings for each country.`;

export const buildContinentJsonLd = (
  continent: Continent,
  countries: Country[],
  title: string,
  description: string,
): JsonLdNode[] => {
  const path = continentPath(continent.slug);
  const url = absoluteUrl(path);
  const breadcrumbId = `${url}#breadcrumb`;

  return [
    {
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: SITE_LANGUAGE,
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": breadcrumbId },
      about: { "@type": "Continent", name: continent.name },
      mainEntity: {
        "@type": "ItemList",
        name: `GitHub committers rankings in ${continent.name}`,
        numberOfItems: countries.length,
        itemListElement: countries.map((country, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `Top GitHub committers ${countryLocation(country)}`,
          url: absoluteUrl(countryPath(country.slug)),
        })),
      },
    },
    breadcrumbNode(breadcrumbId, [
      { name: "Home", path: "/" },
      { name: continent.name, path },
    ]),
  ];
};
