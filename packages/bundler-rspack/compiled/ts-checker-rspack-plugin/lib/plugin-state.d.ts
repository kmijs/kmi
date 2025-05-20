/// <reference types="node" />
import type { FilesChange } from './files-change';
import type { FilesMatch } from './files-match';
import type { Issue } from './issue';
interface TsCheckerRspackPluginState {
    issuesPromise: Promise<Issue[] | undefined>;
    dependenciesPromise: Promise<FilesMatch | undefined>;
    abortController: AbortController | undefined;
    aggregatedFilesChange: FilesChange | undefined;
    lastDependencies: FilesMatch | undefined;
    watching: boolean;
    initialized: boolean;
    iteration: number;
    DevServerDoneTap: any | undefined;
}
declare function createPluginState(): TsCheckerRspackPluginState;
export { TsCheckerRspackPluginState, createPluginState };
