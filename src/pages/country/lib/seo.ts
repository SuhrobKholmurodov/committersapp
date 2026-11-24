import { avatarUrl, sortCommitters, type Committer } from "@/entities/committer";
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
import { formatMonthYear, formatShortDate } from "@/shared/lib/format";
import {
  WEBSITE_ID,
  absoluteUrl,
  breadcrumbNode,
  type JsonLdNode,
} from "@/shared/seo";
import type { BreadcrumbItem } from "@/shared/ui/Breadcrumbs";

const STRUCTURED_USERS_LIMIT = 10;
const LEADERS_LIMIT = 3;
const TITLE_LIMIT = 70;
const DESCRIPTION_LIMIT = 160;

export const buildCountryHeading = (country: Country) =>
  `Top GitHub Committers ${countryHeadingLocation(country)}`;

export const buildCountryTitle = (
  country: Country,
  usersCount: number,
  updatedAt: Date | null,
) => {
  const period = formatMonthYear(updatedAt ?? new Date());
  const fallback = `${buildCountryHeading(country)} (${period})`;
  if (usersCount === 0) return fallback;

  const counted = `Top ${usersCount} GitHub Committers ${countryHeadingLocation(country)} (${period})`;
  const candidates = [`${counted} – Most Active Users`, counted];

  return candidates.find((text) => text.length <= TITLE_LIMIT) ?? fallback;
};

const committerName = (user: Committer) => user.realname?.trim() || user.username;

const joinNames = (names: string[]) =>
  names.length > 1
    ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
    : (names[0] ?? "");

export const buildCountryDescription = (
  country: Country,
  users: Committer[],
  updatedAt: Date | null,
) => {
  const count = users.length;
  const location = countryLocation(country);

  if (count === 0) {
    return `Ranking of the most active GitHub users ${location} by public commits and contributions. Discover top open-source developers ${countryOrigin(country)}.`;
  }

  const leaders = sortCommitters(users, "commits-desc").slice(0, LEADERS_LIMIT).map(committerName);
  const subject = `the ${count} most active GitHub users`;
  const intro = `See who commits the most ${location}`;
  const updated = updatedAt ? ` Updated ${formatShortDate(updatedAt)}.` : "";
  const topNames = `${intro}: ${joinNames(leaders)} ${leaders.length > 1 ? "lead" : "leads"} ${subject}.`;
  const topName = `${intro}: ${leaders[0]} leads ${subject}.`;
  const plain = `Ranking of ${subject} ${location} by public commits and contributions.`;

  const candidates = [
    `${topNames}${updated} Check your own rank.`,
    `${topNames}${updated}`,
    `${topName}${updated} Check your own rank.`,
    `${topName}${updated}`,
    `${plain}${updated}`,
  ];

  return candidates.find((text) => text.length <= DESCRIPTION_LIMIT) ?? plain;
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
