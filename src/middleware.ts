// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that do not require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboarding(.*)',
  '/api/onboard-user', // CRUCIAL: This API route MUST be public for the onboarding flow
  // Add any other public API routes or pages here
]);

// Define ignored routes that Clerk middleware should completely skip
const isIgnoredRoute = createRouteMatcher([
  '/api/webhooks(.*)', // For Clerk webhooks (e.g., user created, user updated)
  // Add other routes to ignore if necessary (e.g., internal Next.js paths like /_next/static)
]);

export default clerkMiddleware((auth, req) => {
  const path = req.nextUrl.pathname;
  console.log(`[Middleware] Request Path: ${path}`);
  console.log(`[Middleware] Is Public Route: ${isPublicRoute(req)}`);
  console.log(`[Middleware] Is Ignored Route: ${isIgnoredRoute(req)}`);

  if (isPublicRoute(req)) {
    console.log(`[Middleware] Path "${path}" is public. Allowing.`);
    return; // Allow the request to proceed without authentication check
  }

  if (isIgnoredRoute(req)) {
    console.log(`[Middleware] Path "${path}" is ignored. Bypassing Clerk processing.`);
    return; // Allow the request to proceed, completely bypassing Clerk
  }

  // For all other routes (private routes), protect them.
  console.log(`[Middleware] Path "${path}" is private. Protecting...`);
  auth.protect(); // This will redirect to sign-in if not authenticated
});

export const config = {
  matcher: [
    // This matcher ensures the middleware runs on all relevant routes.
    // It specifically excludes static files (like .ico, .png, .css, .js)
    // and internal Next.js paths (like /_next).
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/', // Ensure the root path is included if not caught by the above
    '/(api|trpc)(.*)', // Explicitly include all /api and /trpc routes
  ],
};