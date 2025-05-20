import type * as rspack from '@rspack/core';
import type { TsCheckerRspackPluginConfig } from '../plugin-config';
import type { TsCheckerRspackPluginState } from '../plugin-state';
import type { RpcWorker } from '../rpc';
import type { GetDependenciesWorker } from '../typescript/worker/get-dependencies-worker';
import type { GetIssuesWorker } from '../typescript/worker/get-issues-worker';
declare function tapStartToRunWorkers(compiler: rspack.Compiler, getIssuesWorker: RpcWorker<GetIssuesWorker>, getDependenciesWorker: RpcWorker<GetDependenciesWorker>, config: TsCheckerRspackPluginConfig, state: TsCheckerRspackPluginState): void;
export { tapStartToRunWorkers };
