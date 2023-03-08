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
exports.customRefreshTokens = exports.keytarRefreshTokens = void 0;
const framework_1 = require("../framework");
const keytarRefreshTokens = (config) => {
    if (!config.refreshTokens)
        throw new Error(`No config.refreshTokens`);
    if (!('keytar' in config.refreshTokens))
        throw new Error(`No refreshTokens.keytar`);
    if (!('appName' in config.refreshTokens))
        throw new Error(`No refreshTokens.appName`);
    const { keytar, appName } = config.refreshTokens;
    return framework_1.context('refreshTokens', {
        get: () => keytar.getPassword(appName, 'refresh-token'),
        set(password) {
            return __awaiter(this, void 0, void 0, function* () {
                yield keytar.setPassword(appName, 'refresh-token', password);
            });
        },
        delete() {
            return __awaiter(this, void 0, void 0, function* () {
                yield keytar.deletePassword(appName, 'refresh-token');
            });
        }
    });
};
exports.keytarRefreshTokens = keytarRefreshTokens;
const customRefreshTokens = (config) => {
    if (!config.refreshTokens || !('store' in config.refreshTokens)) {
        throw new Error('No refresh token store on config');
    }
    return framework_1.context('refreshTokens', config.refreshTokens.store);
};
exports.customRefreshTokens = customRefreshTokens;
