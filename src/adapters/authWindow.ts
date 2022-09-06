import { BrowserWindow } from "electron";
import qs from "qs";
import url from "url";
import { Adapter } from "../types";
import { context } from "../framework";

export const authWindow: Adapter = (config) => {
  const baseWinConfig = {
    width: 800,
    height: 800,
    alwaysOnTop: true,
    backgroundColor: "#202020",
  };

  const baseLogoutWin = {
    ...baseWinConfig,
    title: "Log out",
    skipTaskbar: true,
    show: false,
    frame: false,
  };

  return context("authWindow", {
    /**
     * Open a browser window to get an auth code, passing through the first part of the PKCE pair (PKCE first leg)
     */
    login: (pair) =>
      new Promise((resolve, reject) => {
        const scopes = config.auth0.scopes.split(" ");
        if (config.refreshTokens) {
          scopes.push("offline_access");
        }

        const authCodeUrl =
          `https://${config.auth0.domain}/authorize?` +
          qs.stringify({
            audience: config.auth0.audience,
            scope: scopes.join(" "),
            response_type: "code",
            client_id: config.auth0.clientId,
            code_challenge: pair.challenge,
            code_challenge_method: "S256",
            redirect_uri: config.auth0.redirectUri,
            // Custom parameters
            ...config.login?.authorizeParams,
          });

        const loginWindow = new BrowserWindow({
          ...baseWinConfig,
          title: "Log in",
          // Custom parameters
          ...config.login?.windowConfig,
        });

        loginWindow.webContents.on(
          "did-fail-load",
          (event, errorCode, errorDescription, validatedURL) => {
            if (errorDescription === "ERR_CONNECTION_REFUSED") {
              const location = url.parse(validatedURL);
              if (
                location.href.replace(location.search || "", "") ==
                config.auth0.redirectUri
              ) {
                const query = qs.parse(location.search || "", {
                  ignoreQueryPrefix: true,
                });
                resolve(query.code);
                loginWindow.destroy();
              }
            }
          }
        );

        loginWindow.webContents.on("did-navigate", (event, href) => {
          const location = url.parse(href);
          if (
            location.href.replace(location.search || "", "") ==
            config.auth0.redirectUri
          ) {
            const query = qs.parse(location.search || "", {
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
    logout: () =>
      new Promise((resolve, reject) => {
        const logoutWindow = new BrowserWindow({
          ...baseLogoutWin,
          // Custom parameters
          ...config.logout?.windowConfig,
        });

        logoutWindow.webContents.on("did-navigate", () => {
          logoutWindow.destroy();
          resolve();
        });

        logoutWindow.webContents.on(
          "did-fail-load",
          (event, errorCode, errorDescription) => {
            if (errorDescription === "ERR_CONNECTION_REFUSED") {
              logoutWindow.destroy();
              resolve();
            }
          }
        );

        logoutWindow.on("page-title-updated", (event) => {
          event.preventDefault();
        });

        logoutWindow.loadURL(`https://${config.auth0.domain}/v2/logout`);

        setTimeout(() => reject(new Error("Logout timed out")), 60 * 1000);
      }),
  });
};
