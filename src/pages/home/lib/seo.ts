import { countryLocation, countryPath, isWorldwide, type Country } from "@/entities/country";
import { AUTHOR, SITE_LANGUAGE, SITE_NAME } from "@/shared/config";
import { WEBSITE_ID, absoluteUrl, type JsonLdNode } from "@/shared/seo";
import { buildFaqJsonLd, buildHomeFaq } from "./faq";

export const buildHomeTitle = (countriesCount: number, year: number) =>
  countriesCount > 0
    ? `Top GitHub Committers by Country (${year}) – ${countriesCount} Country Rankings`
    : `Top GitHub Committers by Country (${year}) – Global Developer Ranking`;

export const HOME_HEADING = "Top GitHub Contributors Worldwide";

export const buildHomeDescription = (countriesCount: number) =>
  countriesCount > 0
    ? `Who commits the most in your country? Rankings of the most active GitHub users in ${countriesCount} countries, by commits and contributions. Updated every few days.`
    : "Who commits the most in your country? Rankings of the most active GitHub users in every country, by commits and contributions. Updated every few days.";

export const buildHomeJsonLd = (
  countries: Country[],
  title: string,
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
      publisher: {
        "@type": "Person",
        name: AUTHOR.name,
        url: AUTHOR.url,
      },
    },
    {
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
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
          name: `Top GitHub committers ${countryLocation(country)}`,
          url: absoluteUrl(countryPath(country.slug)),
        })),
      },
    },
    buildFaqJsonLd(buildHomeFaq(countries.filter((country) => !isWorldwide(country)).length)),
  ];
};
