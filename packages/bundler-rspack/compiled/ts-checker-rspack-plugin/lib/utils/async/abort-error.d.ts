/// <reference types="node" />
declare class AbortError extends Error {
    constructor(message?: string);
    static throwIfAborted(signal: AbortSignal | undefined): void;
}
export { AbortError };
