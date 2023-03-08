import { Context } from '../types';
/**
 * Return a usable auth token or, failing that, try to get a new one
 * You should use this whenever you want to auth e.g. an API request
 */
export declare function getToken(ctx: Context): Promise<string>;
/**
 * Return a usable ID token or, failing that, try to get a new one
 * You should use this whenever you want to auth e.g. an API request
 */
export declare function getIDToken(ctx: Context): Promise<string>;
/**
 * Check whether we are logged in
 */
export declare function isLoggedIn(ctx: Context): Promise<boolean>;
/**
 * Check whether a refresh token exists
 */
export declare function hasRefreshToken(ctx: Context): Promise<boolean>;
/**
 * Manually start a login flow.
 * If you just want a token, use getToken(), which will log in only if we don't have a token available.
 */
export declare function login(ctx: Context): Promise<string>;
/**
 * Log the user out
 */
export declare function logout(ctx: Context): Promise<void>;
