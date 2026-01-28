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
      query: ({ folderId, isTrash }) => {
        const params: any = {};

        if (folderId) {
          params.parent_key = folderId;
        }

        if (isTrash !== undefined) {
          params.isTrash = isTrash;
        }

        return {
          url: "/folder/list",
          method: "GET",
          params,
        };
      },
    }),
    uploadFiles: builder.mutation({
      query: (credentials) => ({
        url: "/file/upload",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
    }),
    viewFile: builder.mutation({
      query: ({ file_key }) => ({
        url: `/folder/list?file_key=${file_key}`,
        method: "GET",

        responseHandler: (response: any) => response.blob(),
      }),
    }),
    onDeleteFile: builder.mutation({
      query: (credentials) => ({
        url: "/folder/trash",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
    }),
    onRestoreFile: builder.mutation({
      query: (credentials) => ({
        url: "/folder/restore",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
    }),
    onFaviroteFile: builder.mutation({
      query: (credentials) => ({
        url: "/folder/favorite",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateFolderMutation,
  useFetchFilesQuery,
  useUploadFilesMutation,
  useViewFileMutation,
  useOnDeleteFileMutation,
  useOnRestoreFileMutation,
  useOnFaviroteFileMutation,
} = extendedAuthApi;
