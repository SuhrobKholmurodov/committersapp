const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const readServerEnv = (name: string) =>
  import.meta.env.SSR ? process.env[name]?.trim() || undefined : undefined;

export const SITE_URL = trimTrailingSlash(
  import.meta.env.VITE_SITE_URL || "https://committers.app",
);

export const API_BASE_URL = import.meta.env.SSR
  ? trimTrailingSlash(readServerEnv("API_URL") ?? "")
  : "/api";

export const API_KEY = readServerEnv("API_KEY");

export const API_KEY_HEADER = "x-api-key";

export const SITE_NAME = "CommittersTop";

export const SITE_LOCALE = "en_US";

export const SITE_LANGUAGE = "en";

export const REPOSITORY_URL = "https://github.com/SuhrobKholmurodov/committerstop";

export const AUTHOR = {
  name: "Suhrob Kholmurodov",
  url: "https://github.com/SuhrobKholmurodov",
} as const;

export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  type: "image/jpeg",
  width: 1200,
  height: 630,
  alt: "CommittersTop — most active GitHub users by country",
} as const;
