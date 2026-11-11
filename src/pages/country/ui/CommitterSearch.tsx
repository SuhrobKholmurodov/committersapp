import { Search, X } from "lucide-react";

interface CommitterSearchProps {
  value: string;
  countryName: string;
  onChange: (value: string) => void;
}

export const CommitterSearch = ({ value, countryName, onChange }: CommitterSearchProps) => (
  <div className="relative flex-1">
    <Search
      aria-hidden="true"
      className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2"
    />
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={`Search in ${countryName}...`}
      aria-label={`Search GitHub users in ${countryName}`}
      className="w-full pl-12 pr-12 py-[11px] border rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 dark:text-gray-200 shadow-sm"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        aria-label="Clear search"
        className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>
    )}
  </div>
);
