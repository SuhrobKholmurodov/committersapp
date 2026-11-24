import {
  deploymentEnv,
  routes,
  type RouteType,
  type VercelConfig,
} from "@vercel/config/v1";

const responseHeaders = (src: string, headers: Record<string, string>): RouteType => ({
  src,
  headers,
  continue: true,
});

const apiProxy = routes.rewrite("/api/(.*)", `${deploymentEnv("API_URL")}/$1`, {
  requestHeaders: {
    "x-api-key": deploymentEnv("API_KEY"),
  },
}) as RouteType;

export const config: VercelConfig = {
  cleanUrls: true,
  trailingSlash: false,
  routes: [
    responseHeaders("/(.*)", {
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    }),
    responseHeaders("/assets/(.*)", {
      "Cache-Control": "public, max-age=31536000, immutable",
    }),
    apiProxy,
  ],
};
