import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  CONTINENTS,
  continentName,
  continentPath,
  countriesInContinent,
  countryPath,
  isWorldwide,
  type Country,
} from "@/entities/country";

interface RelatedCountriesProps {
  country: Country;
  countries: Country[];
}

const linkClassName =
  "inline-block px-3 py-1.5 text-sm text-gray-600 transition-colors bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400";

export const RelatedCountries = ({ country, countries }: RelatedCountriesProps) => {
  if (isWorldwide(country) || !country.continent) {
    return (
      <nav aria-labelledby="related-title" className="max-w-4xl mx-auto mb-12">
        <h2 id="related-title" className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
          GitHub rankings by continent
        </h2>
        <ul className="flex flex-wrap gap-2">
          {CONTINENTS.map((continent) => (
            <li key={continent.slug}>
              <Link to={continentPath(continent.slug)} className={linkClassName}>
                {continent.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  const continent = continentName(country.continent);
  const neighbours = countriesInContinent(countries, country.continent).filter(
    (item) => item.slug !== country.slug,
  );

  if (neighbours.length === 0) return null;

  return (
    <nav aria-labelledby="related-title" className="max-w-4xl mx-auto mb-12">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 id="related-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">
          More GitHub rankings in {continent}
        </h2>
        <Link
          to={continentPath(country.continent)}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 whitespace-nowrap dark:text-blue-400 hover:underline"
        >
          All of {continent}
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
      <ul className="flex flex-wrap gap-2">
        {neighbours.map((item) => (
          <li key={item.slug}>
            <Link to={countryPath(item.slug)} className={linkClassName}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
