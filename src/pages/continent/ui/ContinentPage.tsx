import { useCallback, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Committer } from "@/entities/committer";
import {
  CONTINENTS,
  continentPath,
  countriesInContinent,
  countryPath,
  findContinent,
  useGetCountriesQuery,
  type Continent,
  type Country,
} from "@/entities/country";
import { GitHubUserDialog } from "@/features/github-user-dialog";
import { useInfiniteScroll } from "@/shared/lib/hooks";
import { Seo } from "@/shared/seo";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { LoadingSpinner } from "@/shared/ui/LoadingSpinner";
import { CountryCard } from "@/widgets/country-card";
import { Header } from "@/widgets/header";
import { NOT_FOUND_TITLE, NotFound } from "@/widgets/not-found";
import {
  buildContinentDescription,
  buildContinentHeading,
  buildContinentJsonLd,
  buildContinentTitle,
} from "../lib/seo";

const COUNTRIES_PER_PAGE = 12;
const EMPTY_COUNTRIES: Country[] = [];

const chipClassName =
  "inline-block px-3 py-1.5 text-sm text-gray-600 transition-colors bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400";

const ContinentView = ({ continent }: { continent: Continent }) => {
  const { data: allCountries = EMPTY_COUNTRIES, isLoading } = useGetCountriesQuery();
  const [selectedUser, setSelectedUser] = useState<Committer | null>(null);
  const [visibleCount, setVisibleCount] = useState(COUNTRIES_PER_PAGE);

  const countries = useMemo(
    () => countriesInContinent(allCountries, continent.slug),
    [allCountries, continent.slug],
  );

  const hasMore = visibleCount < countries.length;
  const loadMore = useCallback(
    () => setVisibleCount((count) => count + COUNTRIES_PER_PAGE),
    [],
  );
  const sentinelRef = useInfiniteScroll({
    enabled: hasMore,
    cursor: visibleCount,
    onLoadMore: loadMore,
  });

  const title = buildContinentTitle(continent, countries.length);
  const description = buildContinentDescription(continent, countries);
  const jsonLd = useMemo(
    () => buildContinentJsonLd(continent, countries, title, description),
    [continent, countries, title, description],
  );

  return (
    <div className="relative min-h-screen p-4 mx-auto max-w-7xl">
      <Seo
        title={title}
        description={description}
        path={continentPath(continent.slug)}
        jsonLd={jsonLd}
      />

      <div className="mb-[60px] sm:mb-[65px]">
        <Header
          title={buildContinentHeading(continent)}
          hint={`Rankings of the most active GitHub users in every tracked country of ${continent.name}.`}
        />
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: continent.name }]} className="mb-4" />
        <p className="leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <section aria-labelledby="continent-countries-title">
          <h2 id="continent-countries-title" className="sr-only">
            Countries in {continent.name}
          </h2>
          <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
            {countries.slice(0, visibleCount).map((country) => (
              <CountryCard key={country.slug} country={country} onUserClick={setSelectedUser} />
            ))}
          </div>
          {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
        </section>
      )}

      <nav
        aria-labelledby="continent-directory-title"
        className="max-w-4xl pt-10 mx-auto mt-16 border-t border-gray-200 dark:border-gray-800"
      >
        <h2
          id="continent-directory-title"
          className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100"
        >
          All countries in {continent.name}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {countries.map((country) => (
            <li key={country.slug}>
              <Link to={countryPath(country.slug)} className={chipClassName}>
                {country.name}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-10 mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
          Other continents
        </h2>
        <ul className="flex flex-wrap gap-2">
          {CONTINENTS.filter((item) => item.slug !== continent.slug).map((item) => (
            <li key={item.slug}>
              <Link to={continentPath(item.slug)} className={chipClassName}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {selectedUser && (
        <GitHubUserDialog
          key={selectedUser.username}
          username={selectedUser.username}
          open
          onOpenChange={(open) => !open && setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export const ContinentPage = () => {
  const { continent: slug } = useParams<{ continent: string }>();
  const continent = findContinent(slug);

  if (!continent) {
    return (
      <div className="relative min-h-screen p-4 mx-auto max-w-7xl">
        <div className="mb-[60px] sm:mb-[65px]">
          <Header title={NOT_FOUND_TITLE} />
        </div>
        <NotFound />
      </div>
    );
  }

  return <ContinentView key={continent.slug} continent={continent} />;
};
