import { baseApiInstance } from "../apiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    createFolder: builder.mutation({
      query: (credentials) => ({
        url: "/folder/create",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
    }),
     fetchFiles: builder.query({
      query: () => ({
        url: "/folder/list",
        method: "GET",
      
      }),
      transformResponse: (response: any) => response,
    }),
      uploadFiles: builder.mutation({
      query: (credentials) => ({
        url: "/file/upload",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
    }),
  }),
  overrideExisting: false,
});

export const { useCreateFolderMutation, useFetchFilesQuery, useUploadFilesMutation } = extendedAuthApi;
