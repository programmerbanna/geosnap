import { configureStore } from "@reduxjs/toolkit";
import polygonReducer from "./slice/polygon";
import sidebarReducer from "./slice/sidebar";
import alertReducer from "./slice/alert";

export const store = configureStore({
  reducer: {
    polygons: polygonReducer,
    sidebar: sidebarReducer,
    alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
