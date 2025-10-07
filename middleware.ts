import { auth, clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


const isPublicRoute = createRouteMatcher([
  "/",
  "/api/upcoming",       // your public routes
  "/sign-in(.*)",
  "/sign-up(.*)",
]);


export default clerkMiddleware();


export const config = {
  matcher: [
    // Run the middleware on all routes except Next.js internals
    "/((?!_next|.*\\..*).*)",
    "/",
  ],
}