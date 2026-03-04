/**
 * useAuth Hook
 * Custom hook for accessing authentication state and actions
 */

"use client";

import { useCallback } from "react";
import { useAuthStore, LoginCredentials, AuthUser, AuthError } from "./authStore";
import { authService } from "./authService";

export interface UseAuthReturn {
  // State
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  errors: AuthError[];
  rememberMe: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearErrors: () => void;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => boolean;
  getToken: () => string | null;

  // Utility functions
  hasError: (field?: string) => boolean;
  getErrorMessage: (field?: string) => string | undefined;
  isFormValid: (email: string, password: string) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const store = useAuthStore();

  // Validate form inputs
  const isFormValid = useCallback(
    (email: string, password: string): boolean => {
      return (
        store.validateEmail(email) &&
        store.validatePassword(password) &&
        email.trim().length > 0 &&
        password.length > 0
      );
    },
    [store]
  );

  // Check if there are errors
  const hasError = useCallback(
    (field?: string): boolean => {
      return store.errors.some((error) =>
        field ? error.field === field : true
      );
    },
    [store.errors]
  );

  // Get error message for specific field
  const getErrorMessage = useCallback(
    (field?: string): string | undefined => {
      const error = store.errors.find((err) =>
        field ? err.field === field : !err.field
      );
      return error?.message;
    },
    [store.errors]
  );

  // Get stored token
  const getToken = useCallback((): string | null => {
    return authService.getToken() || store.user?.token || null;
  }, [store.user?.token]);

  return {
    // State
    user: store.user,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    errors: store.errors,
    rememberMe: store.rememberMe,

    // Actions
    login: store.login,
    logout: store.logout,
    clearErrors: store.clearErrors,
    validateEmail: store.validateEmail,
    validatePassword: store.validatePassword,

    // Utility functions
    getToken,
    hasError,
    getErrorMessage,
    isFormValid,
  };
};
