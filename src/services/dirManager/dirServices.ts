import { decryptedData, encryptPayload } from "../../utils";
import { baseApiInstance } from "../apiInstance";

const extendedAuthApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    createFolder: builder.mutation({
      query: async (credentials) => {
        try {
          const encrypt = await encryptPayload(credentials);

          return {
            url: "/folder/create",
            method: "POST",
            body: encrypt,
          };
        } catch (err) {
          console.error("Encryption failed:", err);
          throw err;
        }
      },
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
    fetchFiles: builder.query({
      query: ({ folderId, isTrash }) => {
        const params: any = {};

        if (folderId) {
          params.parent_key = folderId;
        }

        return {
          url: isTrash ? "/folder/trash" : "/folder/list",
          method: "GET",
          params,
        };
      },
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
    onShareLink: builder.mutation({
      query: (credentials) => ({
        url: "/share/shareLink",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => response,
    }),
    onSearchUser: builder.mutation({
      query: async ({ search }) => ({
        url: `/user/user-list?search=${search}`,
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
        return  decryptedData(response);
      },
    }),
    fetchSharedFileInfo: builder.query({
      query: ({ share_key }) => ({
        url: `/share/validate/${share_key}`,
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

export const {
  useCreateFolderMutation,
  useFetchFilesQuery,
  useUploadFilesMutation,
  useViewFileMutation,
  useOnDeleteFileMutation,
  useOnRestoreFileMutation,
  useOnFaviroteFileMutation,
  useOnSearchUserMutation,
  useOnShareLinkMutation,
  useFetchSharedFileInfoQuery,
} = extendedAuthApi;
