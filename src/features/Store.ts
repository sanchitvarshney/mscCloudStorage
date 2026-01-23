// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { baseApiInstance } from "../services/apiInstance";

export const store = configureStore({
  reducer: {
    [baseApiInstance.reducerPath]: baseApiInstance.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApiInstance.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
