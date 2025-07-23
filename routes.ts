/**
 * An array of routes that are accessable to the public
 * These routes does not require authentication
 * @type {string[]}
 */

export const publicRoutes = ["/settings"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged users to /
 * @type {string[]}
 */
export const authRoutes = ["/sign-in", "/sign-up"];

/**
 * The prefix for authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
