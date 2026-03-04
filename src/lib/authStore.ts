"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  token?: string;
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface AuthStore {
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
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setErrors: (errors: AuthError[]) => void;
  addError: (error: AuthError) => void;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => boolean;
}

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Mock authentication function
const authenticateUser = async (
  credentials: LoginCredentials
): Promise<AuthUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock validation
      if (credentials.email === "admin@example.com" && credentials.password === "password123") {
        const user: AuthUser = {
          id: "1",
          email: credentials.email,
          name: "Admin User",
          role: "admin",
          token: "mock-jwt-token-" + Date.now(),
        };
        resolve(user);
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1500);
  });
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isLoading: false,
      isAuthenticated: false,
      errors: [],
      rememberMe: false,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, errors: [] });

        const errors: AuthError[] = [];

        // Validate email
        if (!credentials.email.trim()) {
          errors.push({ message: "Email is required", field: "email" });
        } else if (!validateEmail(credentials.email)) {
          errors.push({
            message: "Please enter a valid email address",
            field: "email",
          });
        }

        // Validate password
        if (!credentials.password) {
          errors.push({ message: "Password is required", field: "password" });
        } else if (!validatePassword(credentials.password)) {
          errors.push({
            message: "Password must be at least 6 characters",
            field: "password",
          });
        }

        if (errors.length > 0) {
          set({ errors, isLoading: false });
          return;
        }

        try {
          const user = await authenticateUser(credentials);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            errors: [],
            rememberMe: credentials.rememberMe || false,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "An error occurred during login";
          set({
            errors: [{ message: errorMessage }],
            isLoading: false,
            isAuthenticated: false,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          errors: [],
          rememberMe: false,
        });
      },

      clearErrors: () => {
        set({ errors: [] });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setErrors: (errors) => {
        set({ errors });
      },

      addError: (error) => {
        set((state) => ({
          errors: [...state.errors, error],
        }));
      },

      validateEmail: (email) => validateEmail(email),
      validatePassword: (password) => validatePassword(password),
    }),
    {
      name: "auth-storage",
      partialize: (state) =>
        ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          rememberMe: state.rememberMe,
        }) as AuthStore,
    }
  )
);
