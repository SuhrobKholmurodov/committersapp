import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import { ChevronRight, GitCommit, Medal, Users } from "lucide-react";
import {
  summarizeCommitters,
  useGetCountryCommittersQuery,
  type Committer,
} from "@/entities/committer";
import { countryPath, type Country } from "@/entities/country";
import { formatNumber } from "@/shared/lib/format";

const TOP_USERS_LIMIT = 3;

const MEDAL_STYLES = [
  { dot: "bg-yellow-400", icon: "text-yellow-500 fill-yellow-500/20" },
  { dot: "bg-gray-300", icon: "text-gray-400 fill-gray-400/20" },
  { dot: "bg-orange-500", icon: "text-orange-500 fill-orange-500/20" },
];

const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-gray-200 rounded dark:bg-gray-700 animate-pulse ${className}`} />
);

interface CountryCardProps {
  country: Country;
  flagUrl?: string;
  onUserClick: (user: Committer) => void;
}

export const CountryCard = ({ country, flagUrl, onUserClick }: CountryCardProps) => {
  const { data, isLoading } = useGetCountryCommittersQuery({
    country: country.slug,
    mode: "all",
  });

  const users = data?.users ?? [];
  const topUsers = users.slice(0, TOP_USERS_LIMIT);
  const { count: totalUsers, totalCommits, averageCommits } = summarizeCommitters(users);

  const handleUserClick = (event: MouseEvent, user: Committer) => {
    event.preventDefault();
    event.stopPropagation();
    onUserClick(user);
  };

  return (
    <Link
      to={countryPath(country.slug)}
      className="block group"
      aria-label={`Top GitHub committers in ${country.name}`}
    >
      <article className="p-5 bg-white border rounded-2xl dark:bg-gray-900 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {flagUrl ? (
                <img
                  src={flagUrl}
                  width={40}
                  height={28}
                  className="object-cover w-10 border rounded shadow-sm h-7 dark:border-gray-800"
                  alt={`${country.name} flag`}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex items-center justify-center w-10 border rounded h-7 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700">
                  <span className="text-xs font-bold text-gray-500" aria-hidden="true">
                    🏳️
                  </span>
                </div>
              )}
              <div className="absolute w-4 h-4 border-2 border-white rounded-full -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 dark:border-gray-900" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {country.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{country.slug}</p>
            </div>
          </div>

          {isLoading ? (
            <Skeleton className="w-[60px] h-[30px] rounded-full" />
          ) : (
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20">
              {totalUsers > 0 ? (
                <Tippy
                  content={
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      Avg commits per dev
                    </span>
                  }
                  placement="top"
                  className="!bg-blue-50 dark:!bg-blue-900 !border !border-blue-200 dark:!border-blue-700 !text-blue-800 dark:!text-blue-200"
                  arrow={false}
                >
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <GitCommit
                      className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                      {formatNumber(averageCommits)}
                    </span>
                  </div>
                </Tippy>
              ) : (
                <Tippy
                  content="No data available"
                  className="!bg-gray-100 dark:!bg-gray-800 !border !border-gray-200 dark:!border-gray-700 !text-gray-800 dark:!text-gray-200"
                  arrow={false}
                >
                  <span className="text-xs text-gray-500 cursor-help">—</span>
                </Tippy>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-1 mb-5">
          {isLoading ? (
            <Skeleton className="h-4 w-[130px]" />
          ) : (
            <span className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Users className="w-4 h-4 text-gray-400" aria-hidden="true" />
              {formatNumber(totalUsers)} devs
            </span>
          )}
          {isLoading ? (
            <Skeleton className="h-4 w-[130px]" />
          ) : (
            <span className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              <GitCommit className="w-4 h-4 text-gray-400" aria-hidden="true" />
              {formatNumber(totalCommits)} commits
            </span>
          )}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <Skeleton className="h-4 mx-auto w-28" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Top Contributors
              </span>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700" />
            </div>
          )}

          {isLoading ? (
            <div className="space-y-2">
              {MEDAL_STYLES.map((style) => (
                <div key={style.dot} className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div>
                      <Skeleton className="w-24 h-4 mb-1" />
                      <Skeleton className="w-16 h-3" />
                    </div>
                  </div>
                  <Skeleton className="w-4 h-4" />
                </div>
              ))}
            </div>
          ) : (
            <ol className="space-y-2">
              {topUsers.map((user, index) => (
                <li
                  key={user.username}
                  onClick={(event) => handleUserClick(event, user)}
                  className="flex items-center justify-between p-2 transition-colors rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        width={32}
                        height={32}
                        className="w-8 h-8 border-2 border-white rounded-full shadow-sm dark:border-gray-800"
                        alt={`${user.username} avatar`}
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className={`absolute -bottom-[2px] -right-[2px] w-[14px] h-[14px] rounded-full border-2 border-white dark:border-gray-800 ${MEDAL_STYLES[index].dot}`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {user.username}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        <GitCommit className="w-3 h-3" aria-hidden="true" />
                        {formatNumber(user.commits)} commits
                      </p>
                    </div>
                  </div>
                  <Medal
                    aria-label={`Rank ${index + 1}`}
                    className={`w-4 h-4 ${MEDAL_STYLES[index].icon}`}
                  />
                </li>
              ))}
            </ol>
          )}
        </div>

        {isLoading ? (
          <div className="pt-4 mt-5 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center">
              <Skeleton className="h-6 w-[180px]" />
            </div>
          </div>
        ) : (
          totalUsers > 0 && (
            <div className="pt-4 mt-5 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                <span>View all contributors</span>
                <ChevronRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
            </div>
          )
        )}
      </article>
    </Link>
  );
};
