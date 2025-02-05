import { configureStore } from "@reduxjs/toolkit";
import polygonReducer from "./slice/polygon";
import sidebarReducer from "./slice/sidebar";

export const store = configureStore({
  reducer: {
    polygons: polygonReducer,
    sidebar: sidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
