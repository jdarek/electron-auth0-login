"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.hasRefreshToken = exports.isLoggedIn = exports.getIDToken = exports.getToken = void 0;
/**
 * Return a usable auth token or, failing that, try to get a new one
 * You should use this whenever you want to auth e.g. an API request
 */
function getToken(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authAPI, logger: { warn, debug }, tokens, refreshTokens } = ctx;
        debug('Retrieving token from store');
        const token = yield tokens.get();
        if (token && tokens.expiresIn() > 60) {
            debug('Using fresh token from store');
            return token.access_token;
        }
        if (refreshTokens) {
            debug('Falling back to refresh token');
            const refreshToken = yield refreshTokens.get();
            if (refreshToken) {
                try {
                    debug('Attempting to use refresh token');
                    const token = yield authAPI.exchangeRefreshToken(refreshToken);
                    yield tokens.set(token);
                    return token.access_token;
                }
                catch (err) {
                    warn(`Could not use refresh token, may have been revoked`);
                    yield refreshTokens.delete();
                }
            }
        }
        debug('No valid token or refresh token available; starting new login flow');
        return login(ctx);
    });
}
exports.getToken = getToken;
/**
 * Return a usable ID token or, failing that, try to get a new one
 * You should use this whenever you want to auth e.g. an API request
 */
function getIDToken(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authAPI, logger: { warn, debug }, tokens, refreshTokens } = ctx;
        debug('Retrieving token from store');
        const token = yield tokens.get();
        if (token && tokens.expiresIn() > 60) {
            debug('Using fresh token from store');
            return token.id_token;
        }
        if (refreshTokens) {
            debug('Falling back to refresh token');
            const refreshToken = yield refreshTokens.get();
            if (refreshToken) {
                try {
                    debug('Attempting to use refresh token');
                    const token = yield authAPI.exchangeRefreshToken(refreshToken);
                    yield tokens.set(token);
                    return token.id_token;
                }
                catch (err) {
                    warn(`Could not use refresh token, may have been revoked`);
                    yield refreshTokens.delete();
                }
            }
        }
        debug('No valid token or refresh token available; starting new login flow');
        return login(ctx);
    });
}
exports.getIDToken = getIDToken;
/**
 * Check whether we are logged in
 */
function isLoggedIn(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        return !!(yield ctx.tokens.get());
    });
}
exports.isLoggedIn = isLoggedIn;
/**
 * Check whether a refresh token exists
 */
function hasRefreshToken(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { refreshTokens } = ctx;
        if (!refreshTokens) {
            return false;
        }
        ;
        const refreshToken = yield refreshTokens.get();
        return !!refreshToken;
    });
}
exports.hasRefreshToken = hasRefreshToken;
/**
 * Manually start a login flow.
 * If you just want a token, use getToken(), which will log in only if we don't have a token available.
 */
function login(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authAPI, authWindow, cryptography, logger: { debug }, refreshTokens, tokens } = ctx;
        debug('Beginning login');
        const pkcePair = cryptography.getPKCEChallengePair();
        const authCode = yield authWindow.login(pkcePair);
        const token = yield authAPI.exchangeAuthCode(authCode, pkcePair);
        debug('Received token from Auth0');
        const { id_token, refresh_token } = token;
        if (refreshTokens) {
            if (refresh_token) {
                debug('Setting refresh token');
                yield refreshTokens.set(refresh_token);
            }
            else {
                debug('Refresh tokens are enabled but none was returned by API');
            }
        }
        yield tokens.set(token);
        debug('Login successful');
        return id_token;
    });
}
exports.login = login;
/**
 * Log the user out
 */
function logout(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const { authWindow, refreshTokens, logger: { debug }, tokens } = ctx;
        yield Promise.all([
            tokens.delete(),
            authWindow.logout(),
            refreshTokens && refreshTokens.delete()
        ]);
        debug('Logged out successfully');
    });
}
exports.logout = logout;
