"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InclusiveNodeWatchFileSystem = void 0;
const path_1 = require("path");
const chokidar_1 = __importDefault(require("@kmijs/shared/compiled/chokidar"));
const minimatch_1 = require("@kmijs/shared/compiled/minimatch");
const files_change_1 = require("../files-change");
const infrastructure_logger_1 = require("../infrastructure-logger");
const is_inside_another_path_1 = require("../utils/path/is-inside-another-path");
const BUILTIN_IGNORED_DIRS = ['.git'];
function createIsIgnored(ignored, excluded) {
    const ignoredPatterns = ignored ? (Array.isArray(ignored) ? ignored : [ignored]) : [];
    const ignoredFunctions = ignoredPatterns.map((pattern) => {
        // ensure patterns are valid - see https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/594
        if (typeof pattern === 'string') {
            return (path) => (0, minimatch_1.minimatch)(path, pattern);
        }
        else if (pattern instanceof RegExp) {
            return (path) => pattern.test(path);
        }
        else {
            // fallback to no-ignore function
            return () => false;
        }
    });
    ignoredFunctions.push((path) => excluded.some((excludedPath) => (0, is_inside_another_path_1.isInsideAnotherPath)(excludedPath, path)));
    ignoredFunctions.push((path) => BUILTIN_IGNORED_DIRS.some((ignoredDir) => path.includes(`/${ignoredDir}/`) || path.includes(`\\${ignoredDir}\\`)));
    return function isIgnored(path) {
        return ignoredFunctions.some((ignoredFunction) => ignoredFunction(path));
    };
}
class InclusiveNodeWatchFileSystem {
    get watcher() {
        return this.watchFileSystem.watcher || this.watchFileSystem.wfs?.watcher;
    }
    constructor(watchFileSystem, compiler, pluginState) {
        this.watchFileSystem = watchFileSystem;
        this.compiler = compiler;
        this.pluginState = pluginState;
        this.paused = true;
        this.watch = (files, dirs, missing, startTime, options, callback, callbackUndelayed) => {
            const { debug } = (0, infrastructure_logger_1.getInfrastructureLogger)(this.compiler);
            (0, files_change_1.clearFilesChange)(this.compiler);
            const isIgnored = createIsIgnored(options?.ignored, this.pluginState.lastDependencies?.excluded || []);
            // use standard watch file system for files and missing
            const standardWatcher = this.watchFileSystem.watch(files, dirs, missing, startTime, options, callback, callbackUndelayed);
            this.watcher?.on('change', (file) => {
                if (typeof file !== 'string') {
                    return;
                }
                if (!isIgnored(file)) {
                    debug('Detected file change', file);
                    this.deletedFiles.delete(file);
                    (0, files_change_1.updateFilesChange)(this.compiler, { changedFiles: [file] });
                }
                else {
                    debug("Detected file change but it's ignored", file);
                }
            });
            this.watcher?.on('remove', (file) => {
                if (typeof file !== 'string') {
                    return;
                }
                if (this.deletedFiles.has(file)) {
                    debug('Skipping duplicated remove event.');
                    return;
                }
                if (!isIgnored(file)) {
                    debug('Detected file remove', file);
                    this.deletedFiles.add(file);
                    (0, files_change_1.updateFilesChange)(this.compiler, { deletedFiles: [file] });
                }
                else {
                    debug("Detected file remove but it's ignored", file);
                }
            });
            // calculate what to change
            const prevDirs = Array.from(this.dirsWatchers.keys());
            const nextDirs = Array.from(this.pluginState.lastDependencies?.dirs || []);
            const dirsToUnwatch = prevDirs.filter((prevDir) => !nextDirs.includes(prevDir));
            const dirsToWatch = nextDirs.filter((nextDir) => !prevDirs.includes(nextDir) && !isIgnored(nextDir));
            // update dirs watcher
            dirsToUnwatch.forEach((dirToUnwatch) => {
                this.dirsWatchers.get(dirToUnwatch)?.close();
                this.dirsWatchers.delete(dirToUnwatch);
            });
            dirsToWatch.forEach((dirToWatch) => {
                const interval = typeof options?.poll === 'number' ? options.poll : undefined;
                const dirWatcher = chokidar_1.default.watch(dirToWatch, {
                    ignoreInitial: true,
                    ignorePermissionErrors: true,
                    ignored: (path) => isIgnored(path),
                    usePolling: options?.poll ? true : undefined,
                    interval: interval,
                    binaryInterval: interval,
                    alwaysStat: true,
                    atomic: true,
                    awaitWriteFinish: true,
                });
                dirWatcher.on('add', (file, stats) => {
                    if (this.paused) {
                        return;
                    }
                    const extension = (0, path_1.extname)(file);
                    const supportedExtensions = this.pluginState.lastDependencies?.extensions || [];
                    if (!supportedExtensions.includes(extension)) {
                        debug('Detected new file add but extension is not supported', file);
                        return;
                    }
                    debug('Detected new file add', file);
                    this.deletedFiles.delete(file);
                    (0, files_change_1.updateFilesChange)(this.compiler, { changedFiles: [file] });
                    this.watcher?._onChange(dirToWatch, stats?.mtimeMs || stats?.ctimeMs || 1, file, 'rename');
                });
                dirWatcher.on('unlink', (file) => {
                    if (this.paused) {
                        return;
                    }
                    const extension = (0, path_1.extname)(file);
                    const supportedExtensions = this.pluginState.lastDependencies?.extensions || [];
                    if (!supportedExtensions.includes(extension)) {
                        debug('Detected new file remove but extension is not supported', file);
                        return;
                    }
                    if (this.deletedFiles.has(file)) {
                        debug('Skipping duplicated unlink event.');
                        return;
                    }
                    debug('Detected new file remove', file);
                    this.deletedFiles.add(file);
                    (0, files_change_1.updateFilesChange)(this.compiler, { deletedFiles: [file] });
                    this.watcher?._onRemove(dirToWatch, file, 'rename');
                });
                this.dirsWatchers.set(dirToWatch, dirWatcher);
            });
            this.paused = false;
            return {
                ...standardWatcher,
                close: () => {
                    (0, files_change_1.clearFilesChange)(this.compiler);
                    if (standardWatcher) {
                        standardWatcher.close();
                    }
                    this.dirsWatchers.forEach((dirWatcher) => {
                        dirWatcher?.close();
                    });
                    this.dirsWatchers.clear();
                    this.paused = true;
                },
                pause: () => {
                    if (standardWatcher) {
                        standardWatcher.pause();
                    }
                    this.paused = true;
                },
            };
        };
        this.dirsWatchers = new Map();
        this.deletedFiles = new Set();
    }
}
exports.InclusiveNodeWatchFileSystem = InclusiveNodeWatchFileSystem;
