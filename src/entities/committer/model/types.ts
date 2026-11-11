export const COMMITTER_MODES = ["commits", "contributions", "all"] as const;

export const COMMITTER_SORTS = [
  "commits-desc",
  "commits-asc",
  "alphabetical-asc",
  "alphabetical-desc",
] as const;

export type CommitterMode = (typeof COMMITTER_MODES)[number];

export type CommitterSort = (typeof COMMITTER_SORTS)[number];

export const DEFAULT_COMMITTER_MODE: CommitterMode = "commits";

export const DEFAULT_COMMITTER_SORT: CommitterSort = "commits-desc";

export interface Committer {
  rank: number;
  username: string;
  realname?: string;
  profile: string;
  commits: number;
  avatar: string;
  rankMessage?: string;
}

export interface CountryCommitters {
  users: Committer[];
  generatedAt: string;
}

export interface CountryCommittersArg {
  country: string;
  mode: CommitterMode;
}
