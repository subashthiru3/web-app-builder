"use client";

export const dynamic = "force-dynamic";

import LoginPage from "@/AppBuilder/login/LoginPage";
import dynamicImport from "next/dynamic";
import { useAuthStore } from "@/lib/authStore";
import { useBuilderStore } from "@/lib/store";
import Loader from "./components/Loader/Loader";

const AppBuilder = dynamicImport(() => import("@/AppBuilder/AppBuilder"), {
  ssr: false,
});

export default function Home() {
  const deployStatus = useBuilderStore((state) => state.deployStatus);
  const { isAuthenticated, isLoading } = useAuthStore();

  return (
    <>
      {deployStatus === "in_progress" && <Loader />}
      {isAuthenticated ? <AppBuilder /> : <LoginPage />}
    </>
  );
}
