import type * as rspack from '@rspack/core';
import type { TsCheckerRspackPluginConfig } from '../plugin-config';
import type { TsCheckerRspackPluginState } from '../plugin-state';
declare function tapDoneToAsyncGetIssues(compiler: rspack.Compiler, config: TsCheckerRspackPluginConfig, state: TsCheckerRspackPluginState): void;
export { tapDoneToAsyncGetIssues };
