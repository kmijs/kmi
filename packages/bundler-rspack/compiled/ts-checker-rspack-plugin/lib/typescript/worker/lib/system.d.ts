import type * as ts from 'typescript';
import type { FilesMatch } from '../../../files-match';
export interface ControlledTypeScriptSystem extends ts.System {
    invokeFileCreated(path: string): void;
    invokeFileChanged(path: string): void;
    invokeFileDeleted(path: string): void;
    invalidateCache(): void;
    getFileSize(path: string): number;
    watchFile(path: string, callback: ts.FileWatcherCallback, pollingInterval?: number, options?: ts.WatchOptions): ts.FileWatcher;
    watchDirectory(path: string, callback: ts.DirectoryWatcherCallback, recursive?: boolean, options?: ts.WatchOptions): ts.FileWatcher;
    getModifiedTime(path: string | undefined): Date | undefined;
    setModifiedTime(path: string, time: Date): void;
    deleteFile(path: string): void;
    setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
    clearTimeout(timeoutId: any): void;
    waitForQueued(): Promise<void>;
    setArtifacts(artifacts: FilesMatch): void;
}
export declare const system: ControlledTypeScriptSystem;
