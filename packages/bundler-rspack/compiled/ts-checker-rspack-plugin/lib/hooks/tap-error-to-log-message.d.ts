import type * as rspack from '@rspack/core';
import type { TsCheckerRspackPluginConfig } from '../plugin-config';
declare function tapErrorToLogMessage(compiler: rspack.Compiler, config: TsCheckerRspackPluginConfig): void;
export { tapErrorToLogMessage };
