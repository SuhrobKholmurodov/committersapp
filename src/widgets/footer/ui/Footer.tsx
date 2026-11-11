import { Github, Star } from "lucide-react";
import { AUTHOR, REPOSITORY_URL, SITE_NAME } from "@/shared/config";

export const Footer = () => (
  <footer className="w-full py-6 mt-auto text-gray-700 border-t dark:text-gray-300 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
    <div className="container px-4 mx-auto">
      <section
        className="max-w-4xl mx-auto mb-4 text-center"
        aria-labelledby="footer-analytics-title"
      >
        <h2
          id="footer-analytics-title"
          className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-4"
        >
          GitHub Contribution Analytics
        </h2>
        <p className="max-w-2xl mx-auto text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {SITE_NAME} is an autonomous analytics engine tracking the global
          pulse of open-source development. By indexing public contribution
          data, we provide a transparent ranking of technical leadership across
          hundreds of regions. Data is synchronized every 120 hours.
        </p>
      </section>

      <div className="flex flex-col items-center gap-6 pt-2">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Support the project:
          </p>
          <a
            href={REPOSITORY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 text-gray-900 transition-all duration-300 bg-white border shadow-sm group rounded-xl dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700"
          >
            <Star
              size={16}
              aria-hidden="true"
              className="text-yellow-500 transition-all group-hover:fill-yellow-500"
            />
            <span className="text-sm font-semibold">Star on GitHub</span>
          </a>

          <a
            href={REPOSITORY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 text-white transition-all bg-gray-900 shadow-md rounded-xl dark:bg-blue-600 hover:opacity-90"
          >
            <Github size={16} aria-hidden="true" />
            <span className="text-sm font-semibold">View Source</span>
          </a>
        </div>

        <p className="text-xs text-center text-gray-400" suppressHydrationWarning>
          © {new Date().getFullYear()} {SITE_NAME}. Engineered with precision by{" "}
          <a
            href={AUTHOR.url}
            target="_blank"
            rel="noopener noreferrer author"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            {AUTHOR.name}
          </a>
        </p>
      </div>
    </div>
  </footer>
);
