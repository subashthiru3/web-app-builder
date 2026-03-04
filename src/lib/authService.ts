/**
 * Authentication Service
 * Handles API calls and business logic for authentication
 */

import { LoginCredentials, AuthUser } from "./authStore";

export class AuthService {
  private baseURL: string;

  constructor(baseURL: string = "/api/auth") {
    this.baseURL = baseURL;
  }

  /**
   * Login with credentials
   * @param credentials - User login credentials (email and password)
   * @returns Promise with authenticated user data
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      throw error as Error;
    }
  }

  /**
   * Logout user
   * @returns Promise<void>
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseURL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  /**
   * Refresh auth token
   * @returns Promise with new user data and token
   */
  async refreshToken(): Promise<AuthUser> {
    const response = await fetch(`${this.baseURL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    return data.user;
  }

  /**
   * Verify if user is authenticated
   * @returns Promise<boolean>
   */
  async verifyAuth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/verify`, {
        method: "GET",
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Validate email format
   * @param email - Email address to validate
   * @returns boolean - True if valid email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns object with validation result and suggestions
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    strength: "weak" | "medium" | "strong";
    suggestions: string[];
  } {
    const suggestions: string[] = [];
    let strength: "weak" | "medium" | "strong" = "weak";

    if (password.length < 6) {
      suggestions.push("Password should be at least 6 characters");
    }
    if (!/[a-z]/.test(password)) {
      suggestions.push("Add lowercase letters");
    }
    if (!/[A-Z]/.test(password)) {
      suggestions.push("Add uppercase letters");
    }
    if (!/[0-9]/.test(password)) {
      suggestions.push("Add numbers");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      suggestions.push("Add special characters");
    }

    if (password.length >= 8 && suggestions.length <= 1) {
      strength = "strong";
    } else if (password.length >= 6 && suggestions.length <= 3) {
      strength = "medium";
    }

    return {
      isValid: password.length >= 6,
      strength,
      suggestions,
    };
  }

  /**
   * Request password reset
   * @param email - Email to send reset link
   * @returns Promise<void>
   */
  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Password reset request failed");
    }
  }

  /**
   * Reset password with token
   * @param token - Reset token
   * @param newPassword - New password
   * @returns Promise<void>
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!response.ok) {
      throw new Error("Password reset failed");
    }
  }

  /**
   * Get stored token from localStorage
   * @returns string | null
   */
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }

  /**
   * Set token in localStorage
   * @param token - Auth token
   */
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  /**
   * Clear token from localStorage
   */
  clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
