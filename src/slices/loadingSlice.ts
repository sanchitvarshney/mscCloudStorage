import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  isDeleting: boolean;
  isFavoriting: boolean;
  isRestoring: boolean;
  isFetching: boolean;
  isViewing: boolean;
  isDownloading: boolean;
  deletingFileId: string | null;
  favoritingFileId: string | null;
  restoringFileId: string | null;
  viewingFileId: string | null;
  downloadingFileId: string | null;
  totalSpace: number;
  freeSpace: number;
}

const initialState: LoadingState = {
  isDeleting: false,
  isFavoriting: false,
  isRestoring: false,
  isFetching: false,
  isViewing: false,
  isDownloading: false,
  deletingFileId: null,
  favoritingFileId: null,
  restoringFileId: null,
  viewingFileId: null,
  downloadingFileId: null,
  totalSpace: 0,
  freeSpace: 0,

};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setDeleting: (
      state,
      action: PayloadAction<{ loading: boolean; fileId?: string | null }>,
    ) => {
      state.isDeleting = action.payload.loading;
      state.deletingFileId = action.payload.fileId || null;
    },
    setFavoriting: (
      state,
      action: PayloadAction<{ loading: boolean; fileId?: string | null }>,
    ) => {
      state.isFavoriting = action.payload.loading;
      state.favoritingFileId = action.payload.fileId || null;
    },
    setRestoring: (
      state,
      action: PayloadAction<{ loading: boolean; fileId?: string | null }>,
    ) => {
      state.isRestoring = action.payload.loading;
      state.restoringFileId = action.payload.fileId || null;
    },
    setFetching: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.isFetching = action.payload.loading;
    },
    setViewing: (
      state,
      action: PayloadAction<{ loading: boolean; fileId?: string | null }>,
    ) => {
      state.isViewing = action.payload.loading;
      state.viewingFileId = action.payload.fileId || null;
    },
    setDownloading: (
      state,
      action: PayloadAction<{ loading: boolean; fileId?: string | null }>,
    ) => {
      state.isDownloading = action.payload.loading;
      state.downloadingFileId = action.payload.fileId || null;
    },
      setSpace: (
      state,
      action: PayloadAction<{ totalSpace: number; freeSpace: number  }>,
    ) => {
      state.totalSpace = action.payload.totalSpace;
      state.freeSpace = action.payload.freeSpace ;
    },
    resetLoading: (state) => {
      state.isDeleting = false;
      state.isFavoriting = false;
      state.isRestoring = false;
      state.isFetching = false;
      state.isViewing = false;
      state.isDownloading = false;
      state.deletingFileId = null;
      state.favoritingFileId = null;
      state.restoringFileId = null;
      state.viewingFileId = null;
      state.downloadingFileId = null;
    },
  },
});

export const {
  setDeleting,
  setFavoriting,
  setRestoring,
  setFetching,
  setViewing,
  setDownloading,
  resetLoading,
  setSpace
} = loadingSlice.actions;
export default loadingSlice.reducer;
