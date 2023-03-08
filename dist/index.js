"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth0Login = void 0;
const library_1 = require("./library");
const framework_1 = require("./framework");
const adapters_1 = require("./adapters");
function auth0Login(config) {
    let adapter = framework_1.mergeAdapters(adapters_1.authAPI, adapters_1.authWindow, adapters_1.cryptography, adapters_1.logger, adapters_1.tokens);
    if (config.refreshTokens && 'keytar' in config.refreshTokens) {
        adapter = framework_1.mergeAdapters(adapter, adapters_1.keytarRefreshTokens);
    }
    if (config.refreshTokens && 'store' in config.refreshTokens) {
        adapter = framework_1.mergeAdapters(adapter, adapters_1.customRefreshTokens);
    }
    return library_1.library(adapter, config);
}
exports.auth0Login = auth0Login;
