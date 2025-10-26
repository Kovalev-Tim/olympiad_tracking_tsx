import { auth, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/call_result(.*)",
  "/api/show_events(.*)",
  "/backend(.*)",
  "/result(.*)",
]);

export default clerkMiddleware((auth, request) => {
  if (isPublicRoute(request)) {
    // Public routes
    return;
  }
  auth.protect();
});


export const config = {
  matcher: [
    // skipping Next.js files
    "/((?!_next|.*\\..*).*)",
    "/",
  ],
}