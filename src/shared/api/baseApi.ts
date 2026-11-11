import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL, API_KEY, API_KEY_HEADER } from "@/shared/config";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      if (API_KEY) headers.set(API_KEY_HEADER, API_KEY);
      return headers;
    },
  }),
  endpoints: () => ({}),
});
