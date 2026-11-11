import type { ContinentSlug } from "./continents";

export interface CountryResponse {
  slug: string;
  name: string;
}

export interface Country extends CountryResponse {
  code: string | null;
  continent: ContinentSlug | null;
  definite: boolean;
  known: boolean;
}

export interface CountryMeta {
  flagUrl: string;
  continent: string;
}

export type CountryMetaMap = Record<string, CountryMeta>;
