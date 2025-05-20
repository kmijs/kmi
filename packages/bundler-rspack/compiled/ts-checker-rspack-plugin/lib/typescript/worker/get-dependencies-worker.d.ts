import type { FilesChange } from '../../files-change';
import type { FilesMatch } from '../../files-match';
declare const getDependenciesWorker: (change: FilesChange) => FilesMatch;
export type GetDependenciesWorker = typeof getDependenciesWorker;
export {};
