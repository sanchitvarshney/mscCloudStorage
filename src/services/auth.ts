import { baseApiInstance } from "./apiInstance";



const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
   
      loginGoogle: builder.mutation({
      query: (credentials) => ({
        url: "/login/google",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
    }),
  
  }),
  overrideExisting: false,
});

export const {
  useLoginGoogleMutation,
  
} = extendedAuthApi;
