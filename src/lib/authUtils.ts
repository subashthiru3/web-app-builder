/**
 * Auth Utilities
 * Helper functions for authentication
 */

import { UserRole } from "./authTypes";

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate email format with advanced rules
 */
export const isValidEmailAdvanced = (email: string): boolean => {
  const advancedRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return advancedRegex.test(email);
};

/**
 * Validate password strength
 */
export interface PasswordValidation {
  isValid: boolean;
  strength: "weak" | "medium" | "strong" | "very-strong";
  score: number;
  feedback: string[];
}

export const validatePasswordStrength = (password: string): PasswordValidation => {
  const feedback: string[] = [];
  let score = 0;

  // Length checks
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (password.length < 6) {
    feedback.push("Password must be at least 6 characters long");
  }

  // Character type checks
  if (/[a-z]/.test(password)) score += 15;
  else feedback.push("Add lowercase letters (a-z)");

  if (/[A-Z]/.test(password)) score += 15;
  else feedback.push("Add uppercase letters (A-Z)");

  if (/[0-9]/.test(password)) score += 15;
  else feedback.push("Add numbers (0-9)");

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;
  else feedback.push("Add special characters (!@#$%^&*)");

  // Determine strength
  let strength: "weak" | "medium" | "strong" | "very-strong";
  if (score >= 80) strength = "very-strong";
  else if (score >= 60) strength = "strong";
  else if (score >= 40) strength = "medium";
  else strength = "weak";

  return {
    isValid: password.length >= 6,
    strength,
    score: Math.min(score, 100),
    feedback,
  };
};

/**
 * Check if user has specific role
 */
export const hasRole = (userRole: UserRole | undefined, requiredRole: UserRole): boolean => {
  if (!userRole) return false;

  // Admin has all permissions
  if (userRole === UserRole.ADMIN) return true;

  return userRole === requiredRole;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (userRole: UserRole | undefined, roles: UserRole[]): boolean => {
  if (!userRole) return false;
  if (userRole === UserRole.ADMIN) return true;
  return roles.includes(userRole);
};

/**
 * Format user name
 */
export const formatUserName = (firstName?: string, lastName?: string, email?: string): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (lastName) {
    return lastName;
  }
  return email || "User";
};

/**
 * Generate form error message
 */
export const getFieldErrorMessage = (field: string, value: string): string | null => {
  switch (field) {
    case "email":
      if (!value.trim()) return "Email is required";
      if (!isValidEmail(value)) return "Please enter a valid email address";
      return null;

    case "password":
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      return null;

    case "firstName":
      if (!value.trim()) return "First name is required";
      if (value.length < 2) return "First name must be at least 2 characters";
      return null;

    case "lastName":
      if (!value.trim()) return "Last name is required";
      if (value.length < 2) return "Last name must be at least 2 characters";
      return null;

    case "confirmPassword":
      if (!value) return "Please confirm your password";
      return null;

    default:
      return null;
  }
};

/**
 * Check if passwords match
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword && password.length >= 6;
};

/**
 * Generate secure random token
 */
export const generateToken = (length: number = 32): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

/**
 * Extract initials from user name
 */
export const getInitials = (email: string, firstName?: string, lastName?: string): string => {
  if (firstName && lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
  }
  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }
  return email.substring(0, 2).toUpperCase();
};

/**
 * Get user avatar URL
 */
export const getUserAvatarUrl = (
  email: string,
  avatar?: string
): string => {
  if (avatar) return avatar;

  // Fallback to gravatar
  const hash = btoa(email.toLowerCase()).replace(/[^a-zA-Z0-9]/g, "");
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (expiresAt: Date | string): boolean => {
  const expireDate = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return expireDate < new Date();
};

/**
 * Get time until token expiration
 */
export const getTimeUntilExpiration = (expiresAt: Date | string): number => {
  const expireDate = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return expireDate.getTime() - new Date().getTime();
};

/**
 * Format error response
 */
export const formatErrorResponse = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unexpected error occurred";
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .substring(0, 255);
};

/**
 * Validate form fields
 */
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateLoginForm = (email: string, password: string): FormValidation => {
  const errors: Record<string, string> = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get JWT payload (without verification)
 * Note: Only use for reading claims, always verify on server
 */
export const parseJWT = (token: string): Record<string, unknown> | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Check if user is within session timeout
 */
export const isSessionActive = (lastActivity: Date, timeoutMinutes: number = 30): boolean => {
  const lastActivityTime = typeof lastActivity === "string" ? new Date(lastActivity) : lastActivity;
  const currentTime = new Date();
  const diffMinutes = (currentTime.getTime() - lastActivityTime.getTime()) / (1000 * 60);
  return diffMinutes < timeoutMinutes;
};
