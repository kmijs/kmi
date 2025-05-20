"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbortError = void 0;
class AbortError extends Error {
    constructor(message = 'Task aborted.') {
        super(message);
        this.name = 'AbortError';
    }
    static throwIfAborted(signal) {
        if (signal?.aborted) {
            throw new AbortError();
        }
    }
}
exports.AbortError = AbortError;
