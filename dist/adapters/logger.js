"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const framework_1 = require("../framework");
const logger = (config) => framework_1.context('logger', {
    debug: (...s) => {
        if (config.debug) {
            console.log(...s);
        }
    },
    warn: (...s) => console.warn(...s)
});
exports.logger = logger;
