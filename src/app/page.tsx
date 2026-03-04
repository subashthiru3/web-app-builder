"use client";

export const dynamic = "force-dynamic";

import LoginPage from "@/AppBuilder/login/LoginPage";
import dynamicImport from "next/dynamic";
import { useAuthStore } from "@/lib/authStore";
import { Box, CircularProgress } from "@mui/material";

const AppBuilder = dynamicImport(() => import("@/AppBuilder/AppBuilder"), {
  ssr: false,
});

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show AppBuilder if authenticated, LoginPage if not
  return isAuthenticated ? <AppBuilder /> : <LoginPage />;
}
