"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$applyCtx = exports.mergeAdapters = exports.context = void 0;
const context = (key, val) => ({
    [key]: val
});
exports.context = context;
function mergeAdapters(...adapters) {
    return (config) => adapters.reduce((ctx, item) => (Object.assign(Object.assign({}, ctx), item(config))), {});
}
exports.mergeAdapters = mergeAdapters;
function $applyCtx(ctx) {
    return function (op) {
        return ((input) => op(ctx, input));
    };
}
exports.$applyCtx = $applyCtx;
