import { useMemo } from "react";
import { Link } from "react-router-dom";
import { compareCountriesByName, countryPath, type Country } from "@/entities/country";

export const CountryDirectory = ({ countries }: { countries: Country[] }) => {
  const sorted = useMemo(() => [...countries].sort(compareCountriesByName), [countries]);

  if (sorted.length === 0) return null;

  return (
    <nav
      aria-labelledby="country-directory-title"
      className="pt-10 mt-16 border-t border-gray-200 dark:border-gray-800"
    >
      <h2
        id="country-directory-title"
        className="mb-6 text-lg font-bold text-gray-800 dark:text-gray-100"
      >
        Browse GitHub rankings by country
      </h2>
      <ul className="grid grid-cols-5 text-sm gap-x-6 gap-y-2 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {sorted.map((country) => (
          <li key={country.slug}>
            <Link
              to={countryPath(country.slug)}
              className="text-gray-600 transition-colors dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {country.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
