/**
 * Auth Provider Component
 * Wraps the app to provide authentication context and global state
 */

"use client";

import React, { ReactNode, useEffect } from "react";
import { useAuthStore } from "./authStore";
import { authService } from "./authService";

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setUser, setLoading, setErrors } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Check if user is already authenticated
        const token = authService.getToken();
        if (token) {
          // Verify token validity (optional - can skip if using JWT)
          const isValid = await authService.verifyAuth();
          if (!isValid) {
            authService.clearToken();
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        authService.clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setUser, setLoading, setErrors]);

  return <>{children}</>;
};

export default AuthProvider;
