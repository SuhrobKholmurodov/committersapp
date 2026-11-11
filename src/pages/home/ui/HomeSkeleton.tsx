import { Loader2 } from "lucide-react";

const PLACEHOLDERS = Array.from({ length: 6 }, (_, index) => index);

export const HomeSkeleton = () => (
  <div className="w-full" role="status">
    <div className="flex flex-col items-center justify-center py-10 animate-pulse">
      <Loader2 className="w-10 h-10 mb-4 text-blue-500 animate-spin" aria-hidden="true" />
      <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
        Fetching global data...
      </p>
      <p className="mt-2 text-sm text-gray-400">Preparing the leaderboard</p>
    </div>

    <div className="grid grid-cols-3 gap-6 mt-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
      {PLACEHOLDERS.map((index) => (
        <div
          key={index}
          className="h-[400px] border rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 animate-pulse border-gray-100 dark:border-gray-800"
        />
      ))}
    </div>
  </div>
);
