"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authWindow = void 0;
const electron_1 = require("electron");
const qs_1 = __importDefault(require("qs"));
const url_1 = __importDefault(require("url"));
const framework_1 = require("../framework");
const authWindow = (config) => {
    const baseWinConfig = {
        width: 800,
        height: 800,
        alwaysOnTop: true,
        backgroundColor: "#202020",
    };
    const baseLogoutWin = Object.assign(Object.assign({}, baseWinConfig), { title: "Log out", skipTaskbar: true, show: false, frame: false });
    return framework_1.context("authWindow", {
        /**
         * Open a browser window to get an auth code, passing through the first part of the PKCE pair (PKCE first leg)
         */
        login: (pair) => new Promise((resolve, reject) => {
            var _a, _b;
            const scopes = config.auth0.scopes.split(" ");
            if (config.refreshTokens) {
                scopes.push("offline_access");
            }
            const authCodeUrl = `https://${config.auth0.domain}/authorize?` +
                qs_1.default.stringify(Object.assign({ audience: config.auth0.audience, scope: scopes.join(" "), response_type: "code", client_id: config.auth0.clientId, code_challenge: pair.challenge, code_challenge_method: "S256", redirect_uri: config.auth0.redirectUri }, (_a = config.login) === null || _a === void 0 ? void 0 : _a.authorizeParams));
            const loginWindow = new electron_1.BrowserWindow(Object.assign(Object.assign(Object.assign({}, baseWinConfig), { title: "Log in" }), (_b = config.login) === null || _b === void 0 ? void 0 : _b.windowConfig));
            loginWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription, validatedURL) => {
                if (errorDescription === "ERR_CONNECTION_REFUSED") {
                    const location = url_1.default.parse(validatedURL);
                    if (location.href.replace(location.search || "", "") ==
                        config.auth0.redirectUri) {
                        const query = qs_1.default.parse(location.search || "", {
                            ignoreQueryPrefix: true,
                        });
                        resolve(query.code);
                        loginWindow.destroy();
                    }
                }
            });
            loginWindow.webContents.on("did-navigate", (event, href) => {
                const location = url_1.default.parse(href);
                if (location.href.replace(location.search || "", "") ==
                    config.auth0.redirectUri) {
                    const query = qs_1.default.parse(location.search || "", {
                        ignoreQueryPrefix: true,
                    });
                    resolve(query.code);
                    loginWindow.destroy();
                }
            });
            loginWindow.on("close", () => {
                reject();
            });
            loginWindow.on("page-title-updated", (event) => {
                event.preventDefault();
            });
            loginWindow.loadURL(authCodeUrl);
        }),
        /**
         * Remote logout from Auth0, deleting cookies etc.
         */
        logout: () => new Promise((resolve, reject) => {
            var _a;
            const logoutWindow = new electron_1.BrowserWindow(Object.assign(Object.assign({}, baseLogoutWin), (_a = config.logout) === null || _a === void 0 ? void 0 : _a.windowConfig));
            logoutWindow.webContents.on("did-navigate", () => {
                logoutWindow.destroy();
                resolve();
            });
            logoutWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
                if (errorDescription === "ERR_CONNECTION_REFUSED") {
                    logoutWindow.destroy();
                    resolve();
                }
            });
            logoutWindow.on("page-title-updated", (event) => {
                event.preventDefault();
            });
            logoutWindow.loadURL(`https://${config.auth0.domain}/v2/logout`);
            setTimeout(() => reject(new Error("Logout timed out")), 60 * 1000);
        }),
    });
};
exports.authWindow = authWindow;
