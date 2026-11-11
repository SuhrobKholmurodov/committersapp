import { Link } from "react-router-dom";
import { CONTINENTS, WORLDWIDE_SLUG, continentPath, countryPath } from "@/entities/country";
import { buildHomeFaq } from "../lib/faq";

export const AboutRanking = ({ countriesCount }: { countriesCount: number }) => {
  const faq = buildHomeFaq(countriesCount);

  return (
    <section
      aria-labelledby="about-ranking-title"
      className="max-w-4xl pt-10 mx-auto mt-16 border-t border-gray-200 dark:border-gray-800"
    >
      <h2
        id="about-ranking-title"
        className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100"
      >
        Most active GitHub users by country
      </h2>
      <p className="leading-relaxed text-gray-600 dark:text-gray-400">
        CommittersTop shows who contributes the most to open source in every
        country. Browse the{" "}
        <Link
          to={countryPath(WORLDWIDE_SLUG)}
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          worldwide GitHub ranking
        </Link>
        , compare developers by continent or open a country to see its top
        committers, their commit counts and public profiles.
      </p>

      <nav aria-label="Rankings by continent" className="mt-6">
        <ul className="flex flex-wrap gap-2">
          {CONTINENTS.map((continent) => (
            <li key={continent.slug}>
              <Link
                to={continentPath(continent.slug)}
                className="inline-block px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {continent.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <h2 className="mt-10 mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Frequently asked questions
      </h2>
      <div className="space-y-3">
        {faq.map((item) => (
          <details
            key={item.question}
            className="p-4 bg-white border border-gray-200 group rounded-xl dark:bg-gray-900 dark:border-gray-800"
          >
            <summary className="font-semibold text-gray-800 cursor-pointer dark:text-gray-100">
              {item.question}
            </summary>
            <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};
