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
  const { fetchCountries, renderPage, countryPath, PRELOADED_DATA_ELEMENT_ID, SITE_URL } =
    await import(serverEntry);

  const template = await readFile(path.join(DIST_DIR, "index.html"), "utf8");
  const countries = await fetchCountries();

  if (!Array.isArray(countries) || countries.length === 0) {
    throw new Error("Countries list is empty, refusing to prerender");
  }

  const paths = ["/", ...countries.map((country) => countryPath(country.slug)), NOT_FOUND_PATH];

  const pages = await runWithConcurrency(paths, CONCURRENCY, async (pagePath) => {
    const page = await renderPage(pagePath, countries);
    const file = outputFileFor(pagePath);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, injectPage(template, page, PRELOADED_DATA_ELEMENT_ID), "utf8");
    return page;
  });

  const countryPages = pages.filter((page) => page.path !== "/" && page.path !== NOT_FOUND_PATH);
  const latestUpdate = countryPages
    .map((page) => page.lastModified)
    .filter(Boolean)
    .sort()
    .at(-1);

  const sitemapPages = pages.map((page) =>
    page.path === "/" ? { ...page, lastModified: latestUpdate ?? null } : page,
  );

  await writeFile(path.join(DIST_DIR, "sitemap.xml"), buildSitemap(SITE_URL, sitemapPages), "utf8");
  await rm(SSR_DIR, { recursive: true, force: true });

  const missingData = countryPages.filter((page) => !page.lastModified).map((page) => page.path);
  if (missingData.length > 0) {
    console.warn(`Prerender: pages without committers data: ${missingData.join(", ")}`);
  }

  console.log(
    `Prerendered ${pages.length} pages and sitemap.xml in ${((Date.now() - startedAt) / 1000).toFixed(1)}s`,
  );
};

main().catch((error) => {
  console.error("Prerender failed:", error);
  process.exit(1);
});
