"use client";
import React from "react";

import { Provider } from "react-redux";
import { store } from "@/store";
import MainLayout from "@/components/templates/main-layout/main-layout";
import PolygonList from "@/components/organisms/polygon-list";
import Map from "@/components/organisms/map";
import ErrorBoundary from "@/components/molecules/error-boundary";

export default function Home() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <MainLayout sidebar={<PolygonList />}>
          <Map />
        </MainLayout>
      </ErrorBoundary>
    </Provider>
  );
}
