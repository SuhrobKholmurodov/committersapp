import {
  COMMITTER_MODES,
  COMMITTER_SORTS,
  type Committer,
  type CommitterMode,
  type CommitterSort,
} from "../model/types";

const comparators: Record<CommitterSort, (a: Committer, b: Committer) => number> = {
  "commits-desc": (a, b) => b.commits - a.commits,
  "commits-asc": (a, b) => a.commits - b.commits,
  "alphabetical-asc": (a, b) => a.username.localeCompare(b.username, "en"),
  "alphabetical-desc": (a, b) => b.username.localeCompare(a.username, "en"),
};

export const isCommitterMode = (value: unknown): value is CommitterMode =>
  typeof value === "string" &&
  (COMMITTER_MODES as readonly string[]).includes(value);

export const isCommitterSort = (value: unknown): value is CommitterSort =>
  typeof value === "string" &&
  (COMMITTER_SORTS as readonly string[]).includes(value);

export const filterCommitters = (users: Committer[], query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return users;

  return users.filter(
    (user) =>
      user.username.toLowerCase().includes(normalized) ||
      user.realname?.toLowerCase().includes(normalized),
  );
};

export const sortCommitters = (users: Committer[], sort: CommitterSort) =>
  [...users].sort(comparators[sort]);

export const summarizeCommitters = (users: Committer[]) => {
  const totalCommits = users.reduce((sum, user) => sum + user.commits, 0);

  return {
    count: users.length,
    totalCommits,
    averageCommits: users.length > 0 ? Math.round(totalCommits / users.length) : 0,
    leader: users.reduce<Committer | undefined>(
      (best, user) => (!best || user.commits > best.commits ? user : best),
      undefined,
    ),
  };
};
