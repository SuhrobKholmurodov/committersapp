import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadEnv } from "vite";

const ROOT_DIR = process.cwd();
const REQUIRED_ENV = ["API_URL"];
const DIST_DIR = path.join(ROOT_DIR, "dist");
const SSR_DIR = path.join(ROOT_DIR, "dist-ssr");
const CONCURRENCY = 8;
const ROOT_MARKUP = '<div id="root"></div>';
const NOT_FOUND_PATH = "/404";

const escapeAttribute = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const injectPage = (template, page, preloadedDataId) => {
  if (!template.includes(ROOT_MARKUP) || !template.includes("</head>")) {
    throw new Error("dist/index.html does not contain the expected root markup");
  }

  const root = [
    `<div id="root" data-prerendered-path="${escapeAttribute(page.path)}">${page.html}</div>`,
    `<script id="${preloadedDataId}" type="application/json">${page.preloadedData}</script>`,
  ].join("\n    ");

  return template
    .replace("</head>", () => `  ${page.head}\n  </head>`)
    .replace(ROOT_MARKUP, () => root);
};

const outputFileFor = (pagePath) => {
  if (pagePath === "/") return path.join(DIST_DIR, "index.html");
  if (pagePath === NOT_FOUND_PATH) return path.join(DIST_DIR, "404.html");
  return path.join(DIST_DIR, `${pagePath.replace(/^\//, "")}.html`);
};

const runWithConcurrency = async (items, limit, worker) => {
  const results = new Array(items.length);
  let cursor = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  });

  await Promise.all(runners);
  return results;
};

const buildSitemap = (siteUrl, pages) => {
  const urls = pages
    .filter((page) => page.status === 200)
    .map((page) => {
      const loc = `${siteUrl}${page.path === "/" ? "/" : page.path}`;
      const lastmod = page.lastModified ? `\n    <lastmod>${page.lastModified}</lastmod>` : "";
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmod}\n  </url>`;
    });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
};

const buildLlmsTxt = ({ siteUrl, countries, continents, countryPath, continentPath }) => {
  const link = (label, pagePath, note) =>
    `- [${label}](${siteUrl}${pagePath})${note ? `: ${note}` : ""}`;

  const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name, "en"));

  return [
    "# CommittersTop",
    "",
    `> Rankings of the most active GitHub users in ${countries.filter((country) => country.slug !== "worldwide").length} countries and regions, plus a worldwide ranking, refreshed every few days.`,
    "",
    "CommittersTop lists the most active GitHub users of every country by public commits, public contributions and all contributions. Data comes from committers.top and public GitHub profiles. Every page is static HTML with structured data.",
    "",
    "## Main pages",
    "",
    link("Home", "/", "all countries, search and grouping by continent"),
    link("Worldwide ranking", countryPath("worldwide"), "most active GitHub users in the world"),
    link("Sitemap", "/sitemap.xml", "every page with its last update date"),
    "",
    "## Continents",
    "",
    ...continents.map((continent) =>
      link(continent.name, continentPath(continent.slug), `top GitHub committers in ${continent.name}`),
    ),
    "",
    "## Countries",
    "",
    ...sortedCountries
      .filter((country) => country.slug !== "worldwide")
      .map((country) => link(country.name, countryPath(country.slug))),
    "",
  ].join("\n");
};

const loadBuildEnv = () => {
  const fileEnv = loadEnv("production", ROOT_DIR, "");

  Object.entries(fileEnv).forEach(([key, value]) => {
    if (process.env[key] === undefined) process.env[key] = value;
  });

  const missing = REQUIRED_ENV.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}. See .env.example`);
  }
};

const main = async () => {
  const startedAt = Date.now();
  loadBuildEnv();
  const serverEntry = pathToFileURL(path.join(SSR_DIR, "entry-server.js")).href;
  const {
    fetchCountries,
    renderPage,
    countryPath,
    continentPath,
    CONTINENTS,
    PRELOADED_DATA_ELEMENT_ID,
    SITE_URL,
  } = await import(serverEntry);

  const template = await readFile(path.join(DIST_DIR, "index.html"), "utf8");
  const countries = await fetchCountries();

  if (!Array.isArray(countries) || countries.length === 0) {
    throw new Error("Countries list is empty, refusing to prerender");
  }

  const continentPaths = new Map(CONTINENTS.map((continent) => [continentPath(continent.slug), continent.slug]));
  const countryByPath = new Map(countries.map((country) => [countryPath(country.slug), country]));

  const paths = [
    "/",
    ...continentPaths.keys(),
    ...countryByPath.keys(),
    NOT_FOUND_PATH,
  ];

  const pages = await runWithConcurrency(paths, CONCURRENCY, async (pagePath) => {
    const page = await renderPage(pagePath, countries);
    const file = outputFileFor(pagePath);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, injectPage(template, page, PRELOADED_DATA_ELEMENT_ID), "utf8");
    return page;
  });

  const countryPages = pages.filter((page) => countryByPath.has(page.path));
  const latestOf = (items) =>
    items
      .map((page) => page.lastModified)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;

  const sitemapPages = pages.map((page) => {
    if (page.path === "/") return { ...page, lastModified: latestOf(countryPages) };

    const continentSlug = continentPaths.get(page.path);
    if (!continentSlug) return page;

    const members = countryPages.filter(
      (countryPage) => countryByPath.get(countryPage.path)?.continent === continentSlug,
    );
    return { ...page, lastModified: latestOf(members) };
  });

  await writeFile(path.join(DIST_DIR, "sitemap.xml"), buildSitemap(SITE_URL, sitemapPages), "utf8");
  await writeFile(
    path.join(DIST_DIR, "llms.txt"),
    buildLlmsTxt({ siteUrl: SITE_URL, countries, continents: CONTINENTS, countryPath, continentPath }),
    "utf8",
  );
  await rm(SSR_DIR, { recursive: true, force: true });

  const missingData = countryPages.filter((page) => !page.lastModified).map((page) => page.path);
  if (missingData.length > 0) {
    console.warn(`Prerender: pages without committers data: ${missingData.join(", ")}`);
  }

  console.log(
    `Prerendered ${pages.length} pages and sitemap.xml, llms.txt in ${((Date.now() - startedAt) / 1000).toFixed(1)}s`,
  );
};

main().catch((error) => {
  console.error("Prerender failed:", error);
  process.exit(1);
});
