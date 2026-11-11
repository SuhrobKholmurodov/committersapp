import { avatarUrl, type Committer } from "@/entities/committer";
import {
  continentName,
  continentPath,
  countryHeadingLocation,
  countryLocation,
  countryOrigin,
  countryPath,
  isWorldwide,
  type Country,
} from "@/entities/country";
import { AUTHOR, SITE_LANGUAGE } from "@/shared/config";
import {
  WEBSITE_ID,
  absoluteUrl,
  breadcrumbNode,
  type JsonLdNode,
} from "@/shared/seo";
import type { BreadcrumbItem } from "@/shared/ui/Breadcrumbs";

const STRUCTURED_USERS_LIMIT = 10;
const TITLE_LIMIT = 70;
const DESCRIPTION_LIMIT = 160;

export const buildCountryHeading = (country: Country) =>
  `Top GitHub Committers ${countryHeadingLocation(country)}`;

export const buildCountryTitle = (country: Country, year: number) => {
  const base = `${buildCountryHeading(country)} (${year})`;
  const full = `${base} – Most Active Developers`;
  return full.length <= TITLE_LIMIT ? full : base;
};

export const buildCountryDescription = (country: Country, users: Committer[]) => {
  const count = users.length;
  const leader = users[0];
  const subject = count > 0 ? `the ${count} most active GitHub users` : "the most active GitHub users";
  const leaderText = leader ? `, led by ${leader.realname || leader.username}` : "";
  const ranking = `Ranking of ${subject} ${countryLocation(country)} by public commits and contributions`;
  const discover = ` Discover top open-source developers ${countryOrigin(country)}.`;

  const candidates = [
    `${ranking}${leaderText}.${discover}`,
    `${ranking}${leaderText}.`,
    `${ranking}.${discover}`,
  ];

  return candidates.find((text) => text.length <= DESCRIPTION_LIMIT) ?? `${ranking}.`;
};

export const buildCountryBreadcrumbs = (country: Country): BreadcrumbItem[] => {
  const continent = continentName(country.continent);

  return [
    { label: "Home", to: "/" },
    ...(country.continent && continent
      ? [{ label: continent, to: continentPath(country.continent) }]
      : []),
    { label: country.name },
  ];
};

interface CountryJsonLdOptions {
  country: Country;
  title: string;
  description: string;
  users: Committer[];
  updatedAt: Date | null;
}

export const buildCountryJsonLd = ({
  country,
  title,
  description,
  users,
  updatedAt,
}: CountryJsonLdOptions): JsonLdNode[] => {
  const path = countryPath(country.slug);
  const url = absoluteUrl(path);
  const breadcrumbId = `${url}#breadcrumb`;
  const datasetName = `Most active GitHub users ${countryLocation(country)}`;
  const dateModified = updatedAt?.toISOString();

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
      ...(dateModified && { dateModified }),
      ...(!isWorldwide(country) && { about: { "@type": "Country", name: country.name } }),
      mainEntity: {
        "@type": "ItemList",
        name: datasetName,
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
            image: avatarUrl(user.avatar, 240),
          },
        })),
      },
    },
    {
      "@type": "Dataset",
      "@id": `${url}#dataset`,
      name: datasetName,
      description,
      url,
      isAccessibleForFree: true,
      ...(dateModified && { dateModified }),
      ...(!isWorldwide(country) && {
        spatialCoverage: { "@type": "Place", name: country.name },
      }),
      variableMeasured: ["Public commits", "Public contributions"],
      creator: {
        "@type": "Organization",
        name: "committers.top",
        url: "https://committers.top",
      },
      publisher: {
        "@type": "Person",
        name: AUTHOR.name,
        url: AUTHOR.url,
      },
      includedInDataCatalog: { "@id": WEBSITE_ID },
    },
    breadcrumbNode(
      breadcrumbId,
      buildCountryBreadcrumbs(country).map((item) => ({
        name: item.label,
        path: item.to ?? path,
      })),
    ),
  ];
};
