import { Helmet } from "react-helmet-async";
import { OG_IMAGE, SITE_NAME } from "@/shared/config";
import { absoluteUrl, serializeJsonLd, type JsonLdNode } from "./jsonLd";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
  jsonLd?: JsonLdNode[];
}

export const Seo = ({ title, description, path, noindex, jsonLd }: SeoProps) => {
  const url = path ? absoluteUrl(path) : undefined;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, follow"
            : "index, follow, max-image-preview:large, max-snippet:-1"
        }
      />
      {url && <link rel="canonical" href={url} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={OG_IMAGE.url} />
      <meta property="og:image:type" content={OG_IMAGE.type} />
      <meta property="og:image:width" content={String(OG_IMAGE.width)} />
      <meta property="og:image:height" content={String(OG_IMAGE.height)} />
      <meta property="og:image:alt" content={OG_IMAGE.alt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE.url} />
      <meta name="twitter:image:alt" content={OG_IMAGE.alt} />
      {jsonLd && jsonLd.length > 0 && (
        <script type="application/ld+json">{serializeJsonLd(jsonLd)}</script>
      )}
    </Helmet>
  );
};
