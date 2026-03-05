"use client";

export const dynamic = "force-dynamic";

import LoginPage from "@/AppBuilder/login/LoginPage";
import { useAuthStore } from "@/lib/authStore";
import { useBuilderStore } from "@/lib/store";
import Loader from "./components/Loader/Loader";
import AppLayout from "./layout/AppLayout";

export default function Home({ children }: { children: React.ReactNode }) {
  const deployStatus = useBuilderStore((state) => state.deployStatus);
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {deployStatus === "in_progress" && <Loader />}
      {isAuthenticated ? <AppLayout>{children}</AppLayout> : <LoginPage />}
    </>
  );
}
