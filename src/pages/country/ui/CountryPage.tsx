import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { ArrowLeft, SearchX } from "lucide-react";
import {
  filterCommitters,
  sortCommitters,
  useGetCountryCommittersQuery,
  type Committer,
} from "@/entities/committer";
import {
  CountryFlag,
  countryLocation,
  countryPath,
  enrichCountry,
  formatCountrySlug,
  isWorldwide,
  useGetCountriesQuery,
  type Country,
} from "@/entities/country";
import { GitHubUserDialog } from "@/features/github-user-dialog";
import { parseApiDate } from "@/shared/lib/format";
import { useDebouncedValue, useInfiniteScroll } from "@/shared/lib/hooks";
import { Seo } from "@/shared/seo";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";
import { ErrorMessage } from "@/shared/ui/ErrorMessage";
import { LoadingSpinner } from "@/shared/ui/LoadingSpinner";
import { FilterBar } from "@/widgets/committers-filter";
import { CommittersTable } from "@/widgets/committers-table";
import { Header } from "@/widgets/header";
import { NOT_FOUND_TITLE, NotFound } from "@/widgets/not-found";
import {
  buildCountryBreadcrumbs,
  buildCountryDescription,
  buildCountryHeading,
  buildCountryJsonLd,
  buildCountryTitle,
} from "../lib/seo";
import { useCommitterSearchParams } from "../model/useCommitterSearchParams";
import { CommitterSearch } from "./CommitterSearch";
import { CountrySummary } from "./CountrySummary";
import { RelatedCountries } from "./RelatedCountries";

const PAGE_SIZE = 20;
const SEARCH_SYNC_DELAY = 300;
const EMPTY_USERS: Committer[] = [];
const EMPTY_COUNTRIES: Country[] = [];

const buildHint = (country: Country) =>
  isWorldwide(country)
    ? "Showing the most active GitHub users worldwide. Rankings update approximately every 5 days."
    : `Showing the most active GitHub users ${countryLocation(country)}. If you're not in the list, set your location to '${country.name}' in your GitHub profile. Rankings update approximately every 5 days.`;

const CountryView = ({ slug }: { slug: string }) => {
  const { mode, sort, search, setMode, setSort, setSearch } = useCommitterSearchParams();
  const [query, setQuery] = useState(search);
  const [selectedUser, setSelectedUser] = useState<Committer | null>(null);
  const debouncedQuery = useDebouncedValue(query, SEARCH_SYNC_DELAY);

  useEffect(() => {
    setSearch(debouncedQuery);
  }, [debouncedQuery, setSearch]);

  const { data: countries = EMPTY_COUNTRIES, isSuccess: hasCountries } = useGetCountriesQuery();
  const listedCountry = countries.find((item) => item.slug === slug);
  const isUnknownCountry = hasCountries && !listedCountry;
  const country = useMemo(
    () => listedCountry ?? enrichCountry({ slug, name: formatCountrySlug(slug) }),
    [listedCountry, slug],
  );

  const { data, error, isLoading, isFetching, refetch } = useGetCountryCommittersQuery(
    isUnknownCountry ? skipToken : { country: slug, mode },
    { refetchOnMountOrArgChange: true },
  );

  const users = data?.users ?? EMPTY_USERS;
  const generatedAt = data?.generatedAt;
  const updatedAt = useMemo(() => parseApiDate(generatedAt), [generatedAt]);

  const visibleSource = useMemo(
    () => sortCommitters(filterCommitters(users, query), sort),
    [users, query, sort],
  );

  const listKey = `${mode}|${sort}|${query}`;
  const [pagination, setPagination] = useState({ key: listKey, count: PAGE_SIZE });
  const visibleCount = pagination.key === listKey ? pagination.count : PAGE_SIZE;
  const visibleUsers = visibleSource.slice(0, visibleCount);
  const hasMore = visibleCount < visibleSource.length;

  const loadMore = useCallback(
    () =>
      setPagination((current) => ({
        key: listKey,
        count: (current.key === listKey ? current.count : PAGE_SIZE) + PAGE_SIZE,
      })),
    [listKey],
  );

  const sentinelRef = useInfiniteScroll({
    enabled: hasMore && !isFetching,
    cursor: visibleCount,
    onLoadMore: loadMore,
  });

  const handleRefresh = useCallback(async () => {
    const result = await refetch();
    return !result.error;
  }, [refetch]);

  const location = countryLocation(country);
  const title = buildCountryTitle(country, (updatedAt ?? new Date()).getUTCFullYear());
  const description = buildCountryDescription(country, users);
  const breadcrumbs = useMemo(() => buildCountryBreadcrumbs(country), [country]);
  const jsonLd = useMemo(
    () => buildCountryJsonLd({ country, title, description, users, updatedAt }),
    [country, title, description, users, updatedAt],
  );

  if (isUnknownCountry) {
    return (
      <div className="relative min-h-screen p-4 mx-auto max-w-7xl">
        <div className="mb-[60px] sm:mb-[65px]">
          <Header title={NOT_FOUND_TITLE} />
        </div>
        <NotFound />
      </div>
    );
  }

  const renderContent = () => {
    if (!data && (isLoading || isFetching)) {
      return (
        <div className="flex flex-col items-center py-32">
          <LoadingSpinner />
        </div>
      );
    }

    if (!data && error) {
      return <ErrorMessage title="Update Failed" message="Could not reach API." />;
    }

    if (visibleSource.length === 0) {
      return (
        <div className="py-24 text-center border-2 border-gray-200 border-dashed bg-gray-50 dark:bg-gray-900/50 rounded-3xl dark:border-gray-800">
          <SearchX className="w-20 h-20 mx-auto mb-6 text-gray-300" aria-hidden="true" />
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            No results found
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="duration-700 animate-in fade-in slide-in-from-bottom-4">
          <CommittersTable
            users={visibleUsers}
            location={location}
            onUserSelect={setSelectedUser}
          />
          {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
        </div>
        <CountrySummary country={country} users={users} mode={mode} updatedAt={updatedAt} />
      </>
    );
  };

  return (
    <div className="relative min-h-screen p-4 mx-auto max-w-7xl">
      <Seo title={title} description={description} path={countryPath(slug)} jsonLd={jsonLd} />

      <div className="mb-[60px] sm:mb-[65px]">
        <Header
          title={buildCountryHeading(country)}
          icon={<CountryFlag country={country} eager />}
          hint={buildHint(country)}
        />
      </div>

      <div className="flex flex-col max-w-2xl gap-3 mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Back to all countries"
            className="flex items-center justify-center w-[46px] h-[46px] border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
          <CommitterSearch value={query} location={location} onChange={setQuery} />
        </div>

        <FilterBar
          mode={mode}
          sort={sort}
          isFetching={isFetching}
          onModeChange={setMode}
          onSortChange={setSort}
          onRefresh={handleRefresh}
        />
      </div>

      <div className="w-full">{renderContent()}</div>

      <RelatedCountries country={country} countries={countries} />

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

export const CountryPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  return <CountryView key={slug} slug={slug} />;
};
