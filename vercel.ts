import {
  deploymentEnv,
  routes,
  type Rewrite,
  type VercelConfig,
} from "@vercel/config/v1";

const apiProxy = routes.rewrite("/api/(.*)", `${deploymentEnv("API_URL")}/$1`, {
  requestHeaders: {
    "x-api-key": deploymentEnv("API_KEY"),
  },
}) as Rewrite;

export const config: VercelConfig = {
  cleanUrls: true,
  trailingSlash: false,
  rewrites: [apiProxy],
  headers: [
    routes.cacheControl("/assets/(.*)", {
      public: true,
      maxAge: "1 year",
      immutable: true,
    }),
    routes.header("/(.*)", [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ]),
  ],
};
