/**
 * Authentication Types
 * Comprehensive type definitions for auth system
 */

/**
 * User Role Enum
 */
export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  GUEST = "guest",
  DEVELOPER = "developer",
}

/**
 * Login Status Enum
 */
export enum LoginStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

/**
 * User Profile
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

/**
 * Auth Response
 */
export interface AuthResponse {
  user: UserProfile;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
}

/**
 * Password Reset Request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password Reset Confirmation
 */
export interface PasswordResetConfirm {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Auth Error
 */
export interface AuthErrorType {
  code: string;
  message: string;
  field?: string;
  timestamp: Date;
}

/**
 * Session
 */
export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivity: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Auth State
 */
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  status: LoginStatus;
  errors: AuthErrorType[];
  session: Session | null;
  rememberMe: boolean;
}

/**
 * Permission
 */
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

/**
 * Role with Permissions
 */
export interface RoleWithPermissions {
  role: UserRole;
  permissions: Permission[];
}

/**
 * OAuth Provider
 */
export enum OAuthProvider {
  GOOGLE = "google",
  GITHUB = "github",
  MICROSOFT = "microsoft",
  FACEBOOK = "facebook",
}

/**
 * OAuth Config
 */
export interface OAuthConfig {
  provider: OAuthProvider;
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scope?: string[];
}

/**
 * Two Factor Auth
 */
export interface TwoFactorAuth {
  enabled: boolean;
  method: "email" | "sms" | "app";
  verified: boolean;
}

/**
 * Login History Entry
 */
export interface LoginHistoryEntry {
  id: string;
  userId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed";
  reason?: string;
}
