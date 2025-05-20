import type * as rspack from '@rspack/core';
import type { FormatterConfig } from './formatter';
import type { IssueConfig } from './issue/issue-config';
import type { Logger } from './logger';
import type { TsCheckerRspackPluginOptions } from './plugin-options';
import type { TypeScriptWorkerConfig } from './typescript/type-script-worker-config';
interface TsCheckerRspackPluginConfig {
    async: boolean;
    typescript: TypeScriptWorkerConfig;
    issue: IssueConfig;
    formatter: FormatterConfig;
    logger: Logger;
    devServer: boolean;
}
declare function createPluginConfig(compiler: rspack.Compiler, options?: TsCheckerRspackPluginOptions): TsCheckerRspackPluginConfig;
export { TsCheckerRspackPluginConfig, createPluginConfig };
