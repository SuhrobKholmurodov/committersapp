export interface Country {
  slug: string;
  name: string;
}

export interface CountryMeta {
  flagUrl: string;
  continent: string;
}

export type CountryMetaMap = Record<string, CountryMeta>;
