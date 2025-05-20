import type * as rspack from '@rspack/core';
import type { TsCheckerRspackPluginState } from '../plugin-state';
declare function tapAfterEnvironmentToPatchWatching(compiler: rspack.Compiler, state: TsCheckerRspackPluginState): void;
export { tapAfterEnvironmentToPatchWatching };
