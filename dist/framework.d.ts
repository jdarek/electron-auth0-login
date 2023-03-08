import { Adapter, Context, Operation } from './types';
export declare const context: <K extends "authAPI" | "authWindow" | "cryptography" | "logger" | "tokens" | "refreshTokens">(key: K, val: Context[K]) => {
    [x: string]: Context[K];
};
export declare function mergeAdapters(...adapters: Adapter[]): Adapter;
export declare function $applyCtx(ctx: Context): <I, O>(op: Operation<I, O>) => I extends unknown ? () => O : (input: I) => O;
