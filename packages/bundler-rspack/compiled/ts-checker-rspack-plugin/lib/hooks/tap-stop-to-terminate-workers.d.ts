import type * as rspack from '@rspack/core';
import type { TsCheckerRspackPluginState } from '../plugin-state';
import type { RpcWorker } from '../rpc';
declare function tapStopToTerminateWorkers(compiler: rspack.Compiler, getIssuesWorker: RpcWorker, getDependenciesWorker: RpcWorker, state: TsCheckerRspackPluginState): void;
export { tapStopToTerminateWorkers };
