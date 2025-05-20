import { SyncHook, SyncWaterfallHook, AsyncSeriesWaterfallHook } from '@rspack/lite-tapable';
import type * as rspack from '@rspack/core';
import type { FilesChange } from './files-change';
import type { Issue } from './issue';
declare function createPluginHooks(): {
    start: AsyncSeriesWaterfallHook<[FilesChange, rspack.Compilation], {
        _UnsetAdditionalOptions: true;
    }>;
    waiting: SyncHook<[rspack.Compilation], void, {
        _UnsetAdditionalOptions: true;
    }>;
    canceled: SyncHook<[rspack.Compilation], void, {
        _UnsetAdditionalOptions: true;
    }>;
    error: SyncHook<[unknown, rspack.Compilation], void, {
        _UnsetAdditionalOptions: true;
    }>;
    issues: SyncWaterfallHook<[Issue[], rspack.Compilation | undefined], void>;
};
type TsCheckerRspackPluginHooks = ReturnType<typeof createPluginHooks>;
declare function getPluginHooks(compiler: rspack.Compiler | rspack.MultiCompiler): {
    start: AsyncSeriesWaterfallHook<[FilesChange, rspack.Compilation], {
        _UnsetAdditionalOptions: true;
    }>;
    waiting: SyncHook<[rspack.Compilation], void, {
        _UnsetAdditionalOptions: true;
    }>;
    canceled: SyncHook<[rspack.Compilation], void, {
        _UnsetAdditionalOptions: true;
    }>;
    error: SyncHook<[unknown, rspack.Compilation], void, {
        _UnsetAdditionalOptions: true;
    }>;
    issues: SyncWaterfallHook<[Issue[], rspack.Compilation | undefined], void>;
};
export { getPluginHooks, TsCheckerRspackPluginHooks };
