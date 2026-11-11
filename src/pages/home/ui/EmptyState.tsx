import { Search } from "lucide-react";

export const EmptyState = ({ searchQuery }: { searchQuery: string }) => (
  <div className="flex flex-col items-center justify-center col-span-3 py-16 text-center animate-fade-in">
    <div className="p-4 mb-4 text-gray-400 rounded-full bg-gray-50 dark:bg-gray-800/50 dark:text-gray-600">
      <Search className="w-8 h-8" aria-hidden="true" />
    </div>
    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
      Nothing found
    </h2>
    <p className="max-w-xs mt-2 text-sm text-gray-400">
      No countries found matching{" "}
      <span className="font-semibold text-blue-500">"{searchQuery}"</span>.
      Please check your spelling or try another search.
    </p>
  </div>
);
