import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownAZ, ArrowUpAZ, ChevronRight, Globe, Search } from "lucide-react";
import type { Committer } from "@/entities/committer";
import {
  continentPath,
  isWorldwide,
  useGetCountriesQuery,
  useGetCountryMetaQuery,
  type Country,
} from "@/entities/country";
import { GitHubUserDialog } from "@/features/github-user-dialog";
import { useActiveSection, useInfiniteScroll, useScrolledPast } from "@/shared/lib/hooks";
import { cn } from "@/shared/lib/utils";
import { Seo } from "@/shared/seo";
import { ContinentNav } from "@/widgets/continent-nav";
import { CountryCard } from "@/widgets/country-card";
import { Header } from "@/widgets/header";
import {
  filterAndSortCountries,
  groupByContinent,
  resolveFlagFallback,
  type SortDirection,
} from "../lib/countries";
import {
  HOME_HEADING,
  HOME_TITLE,
  buildHomeDescription,
  buildHomeJsonLd,
} from "../lib/seo";
import { AboutRanking } from "./AboutRanking";
import { CountryDirectory } from "./CountryDirectory";
import { EmptyState } from "./EmptyState";
import { HomeSkeleton } from "./HomeSkeleton";

const COUNTRIES_PER_PAGE = 20;
const FLOATING_NAV_OFFSET = 400;
const EMPTY_COUNTRIES: Country[] = [];

const scrollToSection = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export const HomePage = () => {
  const { data: countries = EMPTY_COUNTRIES, isLoading } = useGetCountriesQuery();
  const hasUnknownCountries = countries.some((country) => !country.known);
  const { data: countryMeta } = useGetCountryMetaQuery(undefined, {
    skip: !hasUnknownCountries,
  });

  const [selectedUser, setSelectedUser] = useState<Committer | null>(null);
  const [visibleCount, setVisibleCount] = useState(COUNTRIES_PER_PAGE);
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isGrouped, setIsGrouped] = useState(false);
  const isScrolled = useScrolledPast(FLOATING_NAV_OFFSET);

  const filteredCountries = useMemo(
    () => filterAndSortCountries(countries, search, sortDirection),
    [countries, search, sortDirection],
  );

  const groups = useMemo(
    () => (isGrouped ? groupByContinent(filteredCountries, countryMeta) : []),
    [isGrouped, filteredCountries, countryMeta],
  );

  const sections = useMemo(
    () => groups.map(({ id, name }) => ({ id, name })),
    [groups],
  );

  const sectionIds = useMemo(() => sections.map(({ id }) => id), [sections]);
  const activeSection = useActiveSection(sectionIds, isGrouped);

  const visibleCountries = filteredCountries.slice(0, visibleCount);
  const hasMore = !isGrouped && visibleCount < filteredCountries.length;

  const loadMore = useCallback(
    () => setVisibleCount((count) => count + COUNTRIES_PER_PAGE),
    [],
  );

  const sentinelRef = useInfiniteScroll({
    enabled: hasMore,
    cursor: visibleCount,
    onLoadMore: loadMore,
  });

  const trackedCount = countries.filter((country) => !isWorldwide(country)).length;
  const description = buildHomeDescription(trackedCount);
  const jsonLd = useMemo(
    () => buildHomeJsonLd(countries, description),
    [countries, description],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setVisibleCount(COUNTRIES_PER_PAGE);
  };

  const toggleSortDirection = () => {
    setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    setVisibleCount(COUNTRIES_PER_PAGE);
  };

  const renderCard = (country: Country) => (
    <CountryCard
      key={country.slug}
      country={country}
      fallbackFlagUrl={resolveFlagFallback(country, countryMeta)}
      onUserClick={setSelectedUser}
    />
  );

  const continentNavProps = {
    enabled: isGrouped,
    onEnabledChange: setIsGrouped,
    sections,
    activeId: activeSection,
    onSelect: scrollToSection,
  };

  return (
    <div className="relative min-h-screen p-4 mx-auto max-w-7xl">
      <Seo title={HOME_TITLE} description={description} path="/" jsonLd={jsonLd} />

      <div className="mb-[60px] sm:mb-[65px]">
        <Header
          title={HOME_HEADING}
          compactTitle
          hint="Explore the most active GitHub contributors by country. Click on any country to see detailed rankings."
        />
      </div>

      <div className="flex items-center justify-center max-w-2xl gap-3 mx-auto mb-5">
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search countries..."
            aria-label="Search countries"
            className="w-full pl-12 pr-4 py-[10px] border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 dark:text-gray-200 shadow-lg"
          />
        </div>

        <button
          type="button"
          onClick={toggleSortDirection}
          aria-label={sortDirection === "asc" ? "Sort countries Z to A" : "Sort countries A to Z"}
          className="flex items-center justify-center p-[10px] w-[46px] h-[46px] border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-lg text-gray-600 dark:text-gray-400"
        >
          {sortDirection === "asc" ? (
            <ArrowDownAZ className="w-5 h-5 text-blue-500" aria-hidden="true" />
          ) : (
            <ArrowUpAZ className="w-5 h-5 text-blue-500" aria-hidden="true" />
          )}
        </button>

        {!isLoading && <ContinentNav {...continentNavProps} />}
      </div>

      {isLoading ? (
        <HomeSkeleton />
      ) : filteredCountries.length === 0 ? (
        <div className="grid grid-cols-3 gap-6 md:grid-cols-1 lg:grid-cols-2 sm:grid-cols-1">
          <EmptyState searchQuery={search} />
        </div>
      ) : isGrouped ? (
        <div className="grid grid-cols-3 gap-6 md:grid-cols-1 lg:grid-cols-2 sm:grid-cols-1">
          {groups.map((group) => (
            <section
              key={group.id}
              id={group.id}
              aria-labelledby={`${group.id}-title`}
              className="col-span-3 scroll-mt-[100px] animate-fade-in-up"
            >
              <div className="flex items-center gap-4 mt-4 mb-8">
                <div
                  className={cn(
                    "p-2.5 rounded-xl",
                    activeSection === group.id
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
                  )}
                >
                  <Globe className="w-4 h-4" aria-hidden="true" />
                </div>
                <h2
                  id={`${group.id}-title`}
                  className="text-2xl font-black tracking-tight uppercase dark:text-white sm:text-lg"
                >
                  {group.name}
                </h2>
                <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800" />
                <span className="px-3 py-1 text-xs font-bold text-gray-400 bg-gray-100 border rounded-full dark:bg-gray-800 dark:border-gray-700 whitespace-nowrap">
                  {group.countries.length} <span className="sm:hidden">countries</span>
                </span>
                {group.slug && (
                  <Link
                    to={continentPath(group.slug)}
                    aria-label={`Top GitHub committers in ${group.name}`}
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 whitespace-nowrap dark:text-blue-400 hover:underline"
                  >
                    <span className="sm:hidden">View {group.name}</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
                {group.countries.map(renderCard)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <section aria-labelledby="countries-title">
          <h2 id="countries-title" className="sr-only">
            Countries
          </h2>
          <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
            {visibleCountries.map(renderCard)}
          </div>
          {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
        </section>
      )}

      {!isLoading && <CountryDirectory countries={countries} />}

      <AboutRanking countriesCount={trackedCount} />

      {isScrolled && !isLoading && (
        <div className="hidden sm:flex fixed bottom-[85px] right-6 z-50 flex-col gap-3 animate-fade-in-up">
          <ContinentNav {...continentNavProps} floating />
        </div>
      )}

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
