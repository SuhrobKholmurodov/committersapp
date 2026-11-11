import { SITE_URL } from "@/shared/config";

export type JsonLdNode = Record<string, unknown>;

export const WEBSITE_ID = `${SITE_URL}/#website`;

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const serializeJsonLd = (nodes: JsonLdNode[]) =>
  JSON.stringify({ "@context": "https://schema.org", "@graph": nodes })
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

export const breadcrumbNode = (
  id: string,
  items: Array<{ name: string; path: string }>,
): JsonLdNode => ({
  "@type": "BreadcrumbList",
  "@id": id,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
