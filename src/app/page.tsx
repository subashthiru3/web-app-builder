"use client";

export const dynamic = "force-dynamic";

import { useBuilderStore } from "@/lib/store";
import dynamicImport from "next/dynamic";
import Loader from "./components/Loader/Loader";
import AppLayout from "./layout/AppLayout";

const AppBuilder = dynamicImport(() => import("@/AppBuilder/AppBuilder"), {
  ssr: false,
});

export default function Home({ children }: { children: React.ReactNode }) {
  const deployStatus = useBuilderStore((state) => state.deployStatus);

  return (
    <>
      {deployStatus === "in_progress" && <Loader />}
      <AppLayout>{children}</AppLayout>
    </>
  );
}
