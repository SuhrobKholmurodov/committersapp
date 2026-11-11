import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SITE_NAME } from "@/shared/config";
import { Seo } from "@/shared/seo";

export const NOT_FOUND_TITLE = "Page not found";

export const NotFound = () => (
  <section className="flex flex-col items-center justify-center py-24 text-center">
    <Seo
      title={`${NOT_FOUND_TITLE} – ${SITE_NAME}`}
      description="The page you are looking for does not exist. Browse the most active GitHub users by country instead."
      noindex
    />
    <p className="font-black text-blue-600 text-7xl dark:text-blue-400">404</p>
    <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
      This page does not exist
    </h2>
    <p className="max-w-md mt-2 text-gray-500 dark:text-gray-400">
      The country may not be tracked yet or the link is broken.
    </p>
    <Link
      to="/"
      className="flex items-center gap-2 px-5 py-2 mt-8 text-sm font-semibold text-white transition-all bg-blue-600 shadow-md rounded-xl hover:bg-blue-700"
    >
      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      Browse all countries
    </Link>
  </section>
);
