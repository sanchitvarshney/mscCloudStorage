// src/services/baseApi.ts

import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
} from "@reduxjs/toolkit/query/react";

const getBaseUrl = (): string => {
  const customDomain = localStorage.getItem("customDomain");
  const customPort = localStorage.getItem("customPort");

  if (customDomain) {
    const protocol =
      customDomain.includes("localhost") ||
      /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(customDomain)
        ? "http"
        : "https";

    if (customPort) {
      return `${protocol}://${customDomain}:${customPort}`;
    }
    return `${protocol}://${customDomain}`;
  }
  //@ts-ignore
  return import.meta.env.VITE_BASE_URL || "";
};

const baseUrl = getBaseUrl();
const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const user = localStorage.getItem("user");
      const token = user ? JSON.parse(user).token : null;
      if (token) {
        headers.set("x-csrf-token", `${token}`);
      }

      return headers;
    },
  });

  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    localStorage.removeItem("user");

    window.location.href = "/signin";
  }

  return result;
};

export const baseApiInstance = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
