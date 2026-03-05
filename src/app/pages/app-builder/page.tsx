"use client";
import React from "react";
import dynamicImport from "next/dynamic";

const AppBuilder = dynamicImport(() => import("@/AppBuilder/AppBuilder"), {
  ssr: false,
});

const AppBuilderPage = () => {
  return <AppBuilder />;
};

export default AppBuilderPage;
