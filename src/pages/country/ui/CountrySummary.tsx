import { summarizeCommitters, type Committer, type CommitterMode } from "@/entities/committer";
import { formatDate, formatNumber } from "@/shared/lib/format";

const MODE_LABELS: Record<CommitterMode, string> = {
  commits: "public commits",
  contributions: "public contributions",
  all: "public commits and contributions",
};

interface CountrySummaryProps {
  countryName: string;
  users: Committer[];
  mode: CommitterMode;
  updatedAt: Date | null;
}

export const CountrySummary = ({ countryName, users, mode, updatedAt }: CountrySummaryProps) => {
  const { count, totalCommits, leader } = summarizeCommitters(users);

  return (
    <section
      aria-labelledby="country-summary-title"
      className="max-w-2xl mx-auto mt-10 mb-12 text-center duration-1000 animate-in fade-in"
    >
      <h2
        id="country-summary-title"
        className="mb-4 text-3xl font-bold dark:text-white"
      >
        Most Active GitHub Users in {countryName}
      </h2>
      <p className="leading-relaxed text-gray-600 dark:text-gray-400">
        This leaderboard ranks the {formatNumber(count)} most active GitHub users
        in {countryName} by {MODE_LABELS[mode]}. Together they have made{" "}
        {formatNumber(totalCommits)} contributions
        {leader && (
          <>
            , led by <strong>{leader.realname || leader.username}</strong> with{" "}
            {formatNumber(leader.commits)}
          </>
        )}
        .
      </p>
      <p className="mt-4 leading-relaxed text-gray-600 dark:text-gray-400">
        Rankings are based on the location set in each public GitHub profile and
        are refreshed every few days.
        {updatedAt && <> Last updated on {formatDate(updatedAt)}.</>} Not on the
        list? Set your GitHub profile location to "{countryName}" to be included.
      </p>
    </section>
  );
};
