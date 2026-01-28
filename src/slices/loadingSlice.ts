import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  isDeleting: boolean;
  isFavoriting: boolean;
  isRestoring: boolean;
  isFetching: boolean;
  isViewing: boolean;
  deletingFileId: string | null;
  favoritingFileId: string | null;
  restoringFileId: string | null;
  viewingFileId: string | null;
}

const initialState: LoadingState = {
  isDeleting: false,
  isFavoriting: false,
  isRestoring: false,
  isFetching: false,
  isViewing: false,
  deletingFileId: null,
  favoritingFileId: null,
  restoringFileId: null,
  viewingFileId: null,
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
    resetLoading: (state) => {
      state.isDeleting = false;
      state.isFavoriting = false;
      state.isRestoring = false;
      state.isFetching = false;
      state.isViewing = false;
      state.deletingFileId = null;
      state.favoritingFileId = null;
      state.restoringFileId = null;
      state.viewingFileId = null;
    },
  },
});

export const {
  setDeleting,
  setFavoriting,
  setRestoring,
  setFetching,
  setViewing,
  resetLoading,
} = loadingSlice.actions;
export default loadingSlice.reducer;
