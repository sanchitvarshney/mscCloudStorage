import { decryptedData } from "../utils";
import { baseApiInstance } from "./apiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    loginGoogle: builder.mutation({
      query: (credentials) => ({
        url: "/login/google",
        method: "POST",
        body: credentials,
      }),
      transformResponse: async (response: any) => {
        if (
          !response ||
          typeof response !== "object" ||
          !response.encryptedKey
        ) {
          return response;
        }
        return decryptedData(response);
      },
    }),
    getProfile: builder.query({
      query: ({}) => ({
        url: `/user/manage-profile`,
        method: "GET",
      }),
      transformResponse: async (response: any) => {
        if (
          !response ||
          typeof response !== "object" ||
          !response.encryptedKey
        ) {
          return response;
        }

        return decryptedData(response);
      },
    }),
  }),
  overrideExisting: false,
});

export const { useLoginGoogleMutation, useGetProfileQuery } = extendedAuthApi;
