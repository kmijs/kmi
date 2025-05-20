import type * as rspack from '@rspack/core';
import type { TsCheckerRspackPluginOptions } from './plugin-options';
declare class TsCheckerRspackPlugin {
    /**
     * Current version of the plugin
     */
    static readonly version: string;
    /**
     * Default pools for the plugin concurrency limit
     */
    static readonly issuesPool: import("./utils/async/pool").Pool;
    static readonly dependenciesPool: import("./utils/async/pool").Pool;
    /**
     * @deprecated Use TsCheckerRspackPlugin.issuesPool instead
     */
    static readonly pool: import("./utils/async/pool").Pool;
    private readonly options;
    constructor(options?: TsCheckerRspackPluginOptions);
    static getCompilerHooks(compiler: rspack.Compiler): {
        start: import("@rspack/lite-tapable").AsyncSeriesWaterfallHook<[import("./files-change").FilesChange, rspack.Compilation], {
            _UnsetAdditionalOptions: true;
        }>;
        waiting: import("@rspack/lite-tapable").SyncHook<[rspack.Compilation], void, {
            _UnsetAdditionalOptions: true;
        }>;
        canceled: import("@rspack/lite-tapable").SyncHook<[rspack.Compilation], void, {
            _UnsetAdditionalOptions: true;
        }>;
        error: import("@rspack/lite-tapable").SyncHook<[unknown, rspack.Compilation], void, {
            _UnsetAdditionalOptions: true;
        }>;
        issues: import("@rspack/lite-tapable").SyncWaterfallHook<[import("./issue/issue").Issue[], rspack.Compilation | undefined], void>;
    };
    apply(compiler: rspack.Compiler): void;
}
export { TsCheckerRspackPlugin };
