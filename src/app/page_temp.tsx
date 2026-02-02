"use client";

export const dynamic = "force-dynamic";

import dynamicImport from "next/dynamic";

const AppBuilder = dynamicImport(() => import("@/AppBuilder/AppBuilder"), {
  ssr: false,
});

export default function Home() {
  return <AppBuilder />;
}
