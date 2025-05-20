"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginHooks = void 0;
const lite_tapable_1 = require("@kmijs/bundler-shared/rspack-lite-tapable");
const compilerHookMap = new WeakMap();
function createPluginHooks() {
    return {
        start: new lite_tapable_1.AsyncSeriesWaterfallHook([
            'change',
            'compilation',
        ]),
        waiting: new lite_tapable_1.SyncHook(['compilation']),
        canceled: new lite_tapable_1.SyncHook(['compilation']),
        error: new lite_tapable_1.SyncHook(['error', 'compilation']),
        issues: new lite_tapable_1.SyncWaterfallHook([
            'issues',
            'compilation',
        ]),
    };
}
function forwardPluginHooks(source, target) {
    source.start.tapPromise('TsCheckerRspackPlugin', target.start.promise);
    source.waiting.tap('TsCheckerRspackPlugin', target.waiting.call);
    source.canceled.tap('TsCheckerRspackPlugin', target.canceled.call);
    source.error.tap('TsCheckerRspackPlugin', target.error.call);
    source.issues.tap('TsCheckerRspackPlugin', target.issues.call);
}
function getPluginHooks(compiler) {
    let hooks = compilerHookMap.get(compiler);
    if (hooks === undefined) {
        hooks = createPluginHooks();
        compilerHookMap.set(compiler, hooks);
        // proxy hooks for multi-compiler
        if ('compilers' in compiler) {
            compiler.compilers.forEach((childCompiler) => {
                const childHooks = getPluginHooks(childCompiler);
                if (hooks) {
                    forwardPluginHooks(childHooks, hooks);
                }
            });
        }
    }
    return hooks;
}
exports.getPluginHooks = getPluginHooks;
