import type * as rspack from '@rspack/core';
interface FilesChange {
    changedFiles?: string[];
    deletedFiles?: string[];
}
declare function getFilesChange(compiler: rspack.Compiler): FilesChange;
declare function consumeFilesChange(compiler: rspack.Compiler): FilesChange;
declare function updateFilesChange(compiler: rspack.Compiler, change: FilesChange): void;
declare function clearFilesChange(compiler: rspack.Compiler): void;
/**
 * Computes aggregated files change based on the subsequent files changes.
 *
 * @param changes List of subsequent files changes
 * @returns Files change that represents all subsequent changes as a one event
 */
declare function aggregateFilesChanges(changes: FilesChange[]): FilesChange;
export { FilesChange, getFilesChange, consumeFilesChange, updateFilesChange, clearFilesChange, aggregateFilesChanges, };
