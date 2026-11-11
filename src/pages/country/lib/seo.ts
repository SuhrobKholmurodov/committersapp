import type { Committer } from "@/entities/committer";
import { countryPath } from "@/entities/country";
import { SITE_LANGUAGE } from "@/shared/config";
import {
  WEBSITE_ID,
  absoluteUrl,
  breadcrumbNode,
  type JsonLdNode,
} from "@/shared/seo";

const STRUCTURED_USERS_LIMIT = 10;

export const buildCountryHeading = (countryName: string) =>
  `Top GitHub Committers in ${countryName}`;

export const buildCountryTitle = (countryName: string, year: number) =>
  `Top GitHub Committers in ${countryName} (${year}) – Most Active Developers`;

export const buildCountryDescription = (countryName: string, usersCount: number) => {
  const subject =
    usersCount > 0
      ? `the ${usersCount} most active GitHub users`
      : "the most active GitHub users";

  return `Ranking of ${subject} in ${countryName} by public commits and contributions. Discover top open-source developers and software engineers from ${countryName}.`;
};

interface CountryJsonLdOptions {
  slug: string;
  countryName: string;
  title: string;
  description: string;
  users: Committer[];
  updatedAt: Date | null;
}

export const buildCountryJsonLd = ({
  slug,
  countryName,
  title,
  description,
  users,
  updatedAt,
}: CountryJsonLdOptions): JsonLdNode[] => {
  const url = absoluteUrl(countryPath(slug));
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
      ...(updatedAt && { dateModified: updatedAt.toISOString() }),
      about: { "@type": "Country", name: countryName },
      mainEntity: {
        "@type": "ItemList",
        name: `Most active GitHub users in ${countryName}`,
        numberOfItems: users.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: users.slice(0, STRUCTURED_USERS_LIMIT).map((user, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Person",
            name: user.realname || user.username,
            alternateName: user.username,
            url: user.profile,
            image: user.avatar,
          },
        })),
      },
    },
    breadcrumbNode(breadcrumbId, [
      { name: "Home", path: "/" },
      { name: countryName, path: countryPath(slug) },
    ]),
  ];
};
