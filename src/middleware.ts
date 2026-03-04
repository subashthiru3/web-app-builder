/**
 * Authentication Middleware
 * Next.js 13+ middleware for route protection
 * 
 * Place this file as middleware.ts in your project root
 * or in src/middleware.ts
 */

import { NextRequest, NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/privacy",
  "/terms",
];

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/admin",
];

// Admin-only routes
const adminRoutes = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies or headers
  const token = request.cookies.get("auth_token")?.value;
  const isAuthenticated = !!token;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    // Redirect authenticated users away from login
    if (isAuthenticated && pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protect routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Admin routes (would need to verify role, not just token)
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // TODO: Verify user has admin role
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
