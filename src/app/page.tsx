"use client";
import React from "react";
import MainLayout from "@/components/templates/main-layout/main-layout";
import PolygonList from "@/components/organisms/polygon-list";
// import Map from "@/components/organisms/map";
import ErrorBoundary from "@/components/molecules/error-boundary";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/organisms/map"), { ssr: false });


export default function Home() {
  return (
    <ErrorBoundary>
      <MainLayout sidebar={<PolygonList />}>
        <Map />
      </MainLayout>
    </ErrorBoundary>
  );
}
