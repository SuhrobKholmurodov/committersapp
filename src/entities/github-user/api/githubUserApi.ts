import { baseApi } from "@/shared/api";
import type { GitHubUser } from "../model/types";

export const githubUserApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getGitHubUser: build.query<GitHubUser, string>({
      query: (username) => `github-user/${encodeURIComponent(username)}`,
    }),
  }),
});

export const { useGetGitHubUserQuery } = githubUserApi;
