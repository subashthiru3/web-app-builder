/**
 * AUTHENTICATION SYSTEM IMPLEMENTATION GUIDE
 * 
 * This file demonstrates how to integrate and use all authentication components
 * throughout your application.
 */

// ============================================================================
// 1. SETUP: Add AuthProvider to your root layout
// ============================================================================

/*
// src/app/layout.tsx
import { AuthProvider } from "@/lib/AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
*/

// ============================================================================
// 2. LOGIN PAGE USAGE (Already Implemented)
// ============================================================================

/*
// The LoginPage.tsx already includes:
// - Email input with MUI TextField
// - Password input with show/hide toggle
// - Remember me checkbox
// - Form validation
// - Error handling
// - Loading states
// - Progressive error clearing
// - Real-time field validation

// Login page location: src/AppBuilder/login/LoginPage.tsx
*/

// ============================================================================
// 3. PROTECTING ROUTES
// ============================================================================

/*
// Option 1: Using ProtectedRoute component
// src/app/dashboard/page.tsx
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Dashboard />
    </ProtectedRoute>
  );
}

// Option 2: Using useAuth hook to manually check
// src/components/Dashboard.tsx
"use client";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
*/

// ============================================================================
// 4. USING THE useAuth HOOK
// ============================================================================

/*
"use client";
import { useAuth } from "@/lib/useAuth";

export default function MyComponent() {
  const {
    user,                    // Current authenticated user
    isAuthenticated,         // Boolean - is user logged in
    isLoading,              // Boolean - is auth operation in progress
    errors,                 // Array of auth errors
    rememberMe,             // Boolean - was remember me checked
    
    login,                  // Function to login
    logout,                 // Function to logout
    clearErrors,            // Clear error messages
    
    // Utility functions
    getToken,              // Get auth token
    hasError,              // Check if error exists
    getErrorMessage,       // Get specific error message
    isFormValid,           // Validate form inputs
  } = useAuth();

  const handleLogin = async () => {
    await login({
      email: "user@example.com",
      password: "password123",
      rememberMe: true,
    });
  };

  return (
    <div>
      {isAuthenticated && (
        <p>Hello, {user?.name}!</p>
      )}
      {errors.length > 0 && (
        <div>
          {errors.map((err) => (
            <p key={err.message}>{err.message}</p>
          ))}
        </div>
      )}
    </div>
  );
}
*/

// ============================================================================
// 5. USING THE AUTH STORE DIRECTLY
// ============================================================================

/*
"use client";
import { useAuthStore } from "@/lib/authStore";

export default function MyComponent() {
  const store = useAuthStore();

  // State
  console.log(store.user);              // Current user
  console.log(store.isAuthenticated);   // Auth status
  console.log(store.isLoading);         // Loading status
  console.log(store.errors);            // Error array
  console.log(store.rememberMe);        // Remember me flag

  // Actions
  const handleLogin = () => {
    store.login({
      email: "user@example.com",
      password: "password123",
      rememberMe: true,
    });
  };

  const handleLogout = () => {
    store.logout();
  };

  const handleClearErrors = () => {
    store.clearErrors();
  };

  // Validation
  console.log(store.validateEmail("user@example.com"));
  console.log(store.validatePassword("password123"));

  return (
    // Your JSX
  );
}
*/

// ============================================================================
// 6. USING AUTH SERVICE FOR API CALLS
// ============================================================================

/*
import { authService } from "@/lib/authService";

// Login with API
const user = await authService.login({
  email: "user@example.com",
  password: "password123",
});

// Logout
await authService.logout();

// Refresh token
const newUser = await authService.refreshToken();

// Validate email
const isValid = authService.validateEmail("user@example.com");

// Check password strength
const strength = authService.validatePasswordStrength("MyPass123!");
console.log(strength.strength);      // "strong"
console.log(strength.suggestions);   // Array of improvement suggestions

// Reset password
await authService.requestPasswordReset("user@example.com");
await authService.resetPassword(resetToken, "newPassword123");

// Token management
authService.setToken("jwt-token");
const token = authService.getToken();
authService.clearToken();

// Verify auth
const isAuthed = await authService.verifyAuth();
*/

// ============================================================================
// 7. USING AUTH UTILITIES
// ============================================================================

/*
import {
  isValidEmail,
  validatePasswordStrength,
  hasRole,
  hasAnyRole,
  formatUserName,
  getInitials,
  getUserAvatarUrl,
  validateLoginForm,
  UserRole,
} from "@/lib/authUtils";

// Email validation
const isValid = isValidEmail("user@example.com");

// Password strength check
const validation = validatePasswordStrength("MyPass123!");
console.log(validation.strength);      // "medium", "strong", etc.
console.log(validation.feedback);      // Array of suggestions
console.log(validation.score);         // 0-100

// Role checking
const canAccess = hasRole(user?.role, UserRole.ADMIN);
const hasPermission = hasAnyRole(user?.role, [UserRole.ADMIN, UserRole.DEVELOPER]);

// User name formatting
const fullName = formatUserName("John", "Doe", "john@example.com");

// Get initials for avatars
const initials = getInitials("john@example.com", "John", "Doe"); // "JD"

// Get avatar URL
const avatarUrl = getUserAvatarUrl("john@example.com", user?.avatar);

// Validate entire form
const { isValid, errors } = validateLoginForm("john@example.com", "pass");
// errors = {
//   email?: "email error message",
//   password?: "password error message"
// }
*/

// ============================================================================
// 8. EXAMPLE: COMPLETE LOGIN FORM WITH VALIDATION
// ============================================================================

/*
"use client";
import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { TextField, Button, Box } from "@mui/material";

export default function LoginForm() {
  const { login, isLoading, errors, clearErrors } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password, rememberMe: false });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      {errors.length > 0 && (
        <div>
          {errors.map((err) => (
            <p key={err.message} style={{ color: "red" }}>
              {err.message}
            </p>
          ))}
        </div>
      )}
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        fullWidth
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </Box>
  );
}
*/

// ============================================================================
// 9. EXAMPLE: PROTECTED DASHBOARD WITH LOGOUT
// ============================================================================

/*
"use client";
import { useAuth } from "@/lib/useAuth";
import { Button, AppBar, Toolbar, Box, Typography } from "@mui/material";

export default function ProtectedDashboard() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Not authenticated</p>;
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flex: 1 }}>
            Dashboard
          </Typography>
          <Typography>{user?.name}</Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <h1>Welcome, {user?.name}!</h1>
        <p>Role: {user?.role}</p>
      </Box>
    </Box>
  );
}
*/

// ============================================================================
// 10. EXAMPLE: API INTERCEPTOR WITH AUTH TOKEN
// ============================================================================

/*
// src/lib/apiClient.ts
import { useAuth } from "./useAuth";

export function createAuthenticatedFetch() {
  const { getToken } = useAuth();

  return async (url: string, options: RequestInit = {}) => {
    const token = getToken();

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };
}

// Usage in components
const authenticatedFetch = createAuthenticatedFetch();
const response = await authenticatedFetch("/api/protected-endpoint");
*/

// ============================================================================
// 11. FEATURE CHECKLIST
// ============================================================================

/*
IMPLEMENTED FEATURES:
✅ User login with email and password
✅ Form validation (email format, password strength)
✅ Remember me functionality
✅ Error handling and display
✅ Loading states
✅ Password visibility toggle
✅ Real-time field validation
✅ Zustand state management
✅ Persistent storage (localStorage)
✅ Protected routes
✅ Custom hooks (useAuth)
✅ Authentication service
✅ Comprehensive utilities
✅ Type safety (TypeScript)
✅ MUI components
✅ Responsive design
✅ Dark mode support

READY TO IMPLEMENT:
⏳ Two-factor authentication
⏳ OAuth integration (Google, GitHub)
⏳ Session management
⏳ Role-based access control
⏳ Password reset flow
⏳ Email verification
⏳ Account creation/registration
⏳ Activity logging
⏳ Account lockout protection
*/

// ============================================================================
// 12. CONFIGURATION
// ============================================================================

/*
Environment variables to set (.env.local):

// API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_TIMEOUT=30000

// Auth Configuration
NEXT_PUBLIC_AUTH_ENDPOINT=/api/auth
NEXT_PUBLIC_SESSION_TIMEOUT=1800000  // 30 minutes

// OAuth Configuration (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id

// Feature Flags
NEXT_PUBLIC_ENABLE_2FA=false
NEXT_PUBLIC_ENABLE_OAUTH=false
*/

export {};
