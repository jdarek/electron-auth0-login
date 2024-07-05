import got from 'got';
import { HttpsProxyAgent } from 'hpagent';
import { Adapter } from '../types';
import { context } from '../framework';

export const authAPI: Adapter = (config) => context('authAPI', {
    /**
     * After receiving auth code, use second half of PKCE pair to get a token (PKCE second leg)
     */
    exchangeAuthCode: async (authCode, pair) =>
        new Promise((resolve, reject) => {
            let proxyServer = null;
            if (process.env.http_proxy) {
                proxyServer = process.env.http_proxy;
            }
            resolve(got.post(`https://${config.auth0.domain}/oauth/token`, {
                json: {
                    grant_type: 'authorization_code',
                    client_id: config.auth0.clientId,
                    code_verifier: pair.verifier,
                    code: authCode,
                    redirect_uri: config.auth0.redirectUri
                },
                agent: proxyServer ? {
                    https: new HttpsProxyAgent({
                        keepAlive: true,
                        keepAliveMsecs: 1000,
                        maxSockets: 256,
                        maxFreeSockets: 256,
                        proxy: proxyServer
                    })
                } : {}
            }).json())
        }),

    /**
     * Used to restore login state for persistent login
     */
    exchangeRefreshToken: async (refreshToken) => 
        new Promise((resolve, reject) => {
            let proxyServer = null;
            if (process.env.http_proxy) {
                proxyServer = process.env.http_proxy;
            }
            resolve(got.post(`https://${config.auth0.domain}/oauth/token`, {
                json: {
                    grant_type: 'refresh_token',
                    client_id: config.auth0.clientId,
                    refresh_token: refreshToken
                },
                agent: proxyServer ? {
                    https: new HttpsProxyAgent({
                        keepAlive: true,
                        keepAliveMsecs: 1000,
                        maxSockets: 256,
                        maxFreeSockets: 256,
                        proxy: proxyServer
                    })
                } : {}
            }).json())
        })
});
