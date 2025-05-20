"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.realFileSystem = void 0;
const path_1 = require("path");
const node_fs_1 = __importDefault(require("node:fs"));
const existsCache = new Map();
const readStatsCache = new Map();
const readFileCache = new Map();
const readDirCache = new Map();
const realPathCache = new Map();
/**
 * It's an implementation of the FileSystem interface which reads and writes directly to the real file system.
 */
exports.realFileSystem = {
    exists(path) {
        return exists(getRealPath(path));
    },
    readFile(path, encoding) {
        return readFile(getRealPath(path), encoding);
    },
    readDir(path) {
        return readDir(getRealPath(path));
    },
    readStats(path) {
        return readStats(getRealPath(path));
    },
    realPath(path) {
        return getRealPath(path);
    },
    normalizePath(path) {
        return (0, path_1.normalize)(path);
    },
    writeFile(path, data) {
        writeFile(getRealPath(path), data);
    },
    deleteFile(path) {
        deleteFile(getRealPath(path));
    },
    createDir(path) {
        createDir(getRealPath(path));
    },
    updateTimes(path, atime, mtime) {
        updateTimes(getRealPath(path), atime, mtime);
    },
    clearCache() {
        existsCache.clear();
        readStatsCache.clear();
        readFileCache.clear();
        readDirCache.clear();
        realPathCache.clear();
    },
};
// read methods
function exists(path) {
    const normalizedPath = (0, path_1.normalize)(path);
    if (!existsCache.has(normalizedPath)) {
        existsCache.set(normalizedPath, node_fs_1.default.existsSync(normalizedPath));
    }
    return !!existsCache.get(normalizedPath);
}
function readStats(path) {
    const normalizedPath = (0, path_1.normalize)(path);
    if (!readStatsCache.has(normalizedPath)) {
        if (exists(normalizedPath)) {
            readStatsCache.set(normalizedPath, node_fs_1.default.statSync(normalizedPath));
        }
    }
    return readStatsCache.get(normalizedPath);
}
function readFile(path, encoding) {
    const normalizedPath = (0, path_1.normalize)(path);
    if (!readFileCache.has(normalizedPath)) {
        const stats = readStats(normalizedPath);
        if (stats && stats.isFile()) {
            readFileCache.set(normalizedPath, node_fs_1.default.readFileSync(normalizedPath, { encoding: encoding }).toString());
        }
        else {
            readFileCache.set(normalizedPath, undefined);
        }
    }
    return readFileCache.get(normalizedPath);
}
function readDir(path) {
    const normalizedPath = (0, path_1.normalize)(path);
    if (!readDirCache.has(normalizedPath)) {
        const stats = readStats(normalizedPath);
        if (stats && stats.isDirectory()) {
            readDirCache.set(normalizedPath, node_fs_1.default.readdirSync(normalizedPath, { withFileTypes: true }));
        }
        else {
            readDirCache.set(normalizedPath, []);
        }
    }
    return readDirCache.get(normalizedPath) || [];
}
function getRealPath(path) {
    const normalizedPath = (0, path_1.normalize)(path);
    if (!realPathCache.has(normalizedPath)) {
        let base = normalizedPath;
        let nested = '';
        while (base !== (0, path_1.dirname)(base)) {
            if (exists(base)) {
                realPathCache.set(normalizedPath, (0, path_1.normalize)((0, path_1.join)(node_fs_1.default.realpathSync(base), nested)));
                break;
            }
            nested = (0, path_1.join)((0, path_1.basename)(base), nested);
            base = (0, path_1.dirname)(base);
        }
    }
    return realPathCache.get(normalizedPath) || normalizedPath;
}
function createDir(path) {
    const normalizedPath = (0, path_1.normalize)(path);
    node_fs_1.default.mkdirSync(normalizedPath, { recursive: true });
    // update cache
    existsCache.set(normalizedPath, true);
    if (readDirCache.has((0, path_1.dirname)(normalizedPath))) {
        readDirCache.delete((0, path_1.dirname)(normalizedPath));
    }
    if (readStatsCache.has(normalizedPath)) {
        readStatsCache.delete(normalizedPath);
    }
}
function writeFile(path, data) {
    const normalizedPath = (0, path_1.normalize)(path);
    if (!exists((0, path_1.dirname)(normalizedPath))) {
        createDir((0, path_1.dirname)(normalizedPath));
    }
    node_fs_1.default.writeFileSync(normalizedPath, data);
    // update cache
    existsCache.set(normalizedPath, true);
    if (readDirCache.has((0, path_1.dirname)(normalizedPath))) {
        readDirCache.delete((0, path_1.dirname)(normalizedPath));
    }
    if (readStatsCache.has(normalizedPath)) {
        readStatsCache.delete(normalizedPath);
    }
    if (readFileCache.has(normalizedPath)) {
        readFileCache.delete(normalizedPath);
    }
}
function deleteFile(path) {
    if (exists(path)) {
        const normalizedPath = (0, path_1.normalize)(path);
        node_fs_1.default.unlinkSync(normalizedPath);
        // update cache
        existsCache.set(normalizedPath, false);
        if (readDirCache.has((0, path_1.dirname)(normalizedPath))) {
            readDirCache.delete((0, path_1.dirname)(normalizedPath));
        }
        if (readStatsCache.has(normalizedPath)) {
            readStatsCache.delete(normalizedPath);
        }
        if (readFileCache.has(normalizedPath)) {
            readFileCache.delete(normalizedPath);
        }
    }
}
function updateTimes(path, atime, mtime) {
    if (exists(path)) {
        const normalizedPath = (0, path_1.normalize)(path);
        node_fs_1.default.utimesSync((0, path_1.normalize)(path), atime, mtime);
        // update cache
        if (readStatsCache.has(normalizedPath)) {
            readStatsCache.delete(normalizedPath);
        }
    }
}
