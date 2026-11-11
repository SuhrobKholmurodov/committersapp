import { countryPath, type Country } from "@/entities/country";
import { SITE_LANGUAGE, SITE_NAME } from "@/shared/config";
import { WEBSITE_ID, absoluteUrl, type JsonLdNode } from "@/shared/seo";

export const HOME_TITLE = "Top GitHub Committers by Country – Global Developer Ranking";

export const HOME_HEADING = "Top GitHub Contributors Worldwide";

export const buildHomeDescription = (countriesCount: number) =>
  countriesCount > 0
    ? `Explore the most active GitHub users in ${countriesCount} countries. Compare commits, contributions and open-source leaders from around the world.`
    : "Explore the most active GitHub users in every country. Compare commits, contributions and open-source leaders from around the world.";

export const buildHomeJsonLd = (
  countries: Country[],
  description: string,
): JsonLdNode[] => {
  const url = absoluteUrl("/");

  return [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url,
      name: SITE_NAME,
      description,
      inLanguage: SITE_LANGUAGE,
    },
    {
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      name: HOME_TITLE,
      description,
      inLanguage: SITE_LANGUAGE,
      isPartOf: { "@id": WEBSITE_ID },
      mainEntity: {
        "@type": "ItemList",
        name: "GitHub committers rankings by country",
        numberOfItems: countries.length,
        itemListElement: countries.map((country, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `Top GitHub committers in ${country.name}`,
          url: absoluteUrl(countryPath(country.slug)),
        })),
      },
    },
  ];
};
