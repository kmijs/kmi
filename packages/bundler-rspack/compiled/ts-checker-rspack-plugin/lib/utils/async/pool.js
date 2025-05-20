"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPool = void 0;
const abort_error_1 = require("./abort-error");
function createPool(size) {
    let pendingPromises = [];
    const pool = {
        async submit(task, signal) {
            while (pendingPromises.length >= pool.size) {
                abort_error_1.AbortError.throwIfAborted(signal);
                await Promise.race(pendingPromises).catch(() => undefined);
            }
            abort_error_1.AbortError.throwIfAborted(signal);
            const taskPromise = task(signal).finally(() => {
                pendingPromises = pendingPromises.filter((pendingPromise) => pendingPromise !== taskPromise);
            });
            pendingPromises.push(taskPromise);
            return taskPromise;
        },
        size,
        get pending() {
            return pendingPromises.length;
        },
        get drained() {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise(async (resolve) => {
                while (pendingPromises.length > 0) {
                    await Promise.race(pendingPromises).catch(() => undefined);
                }
                resolve(undefined);
            });
        },
    };
    return pool;
}
exports.createPool = createPool;
