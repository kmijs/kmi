/// <reference types="node" />
import { PathLike } from 'node:fs';

interface Adapter<T> {
    read: () => Promise<T | null>;
    write: (data: T) => Promise<void>;
}
declare class Low<T = unknown> {
    adapter: Adapter<T>;
    data: T;
    constructor(adapter: Adapter<T>, defaultData: T);
    read(): Promise<void>;
    write(): Promise<void>;
    update(fn: (data: T) => unknown): Promise<void>;
}

declare function JSONFilePreset<Data>(filename: PathLike, defaultData: Data): Promise<Low<Data>>;

export { JSONFilePreset, Low };
