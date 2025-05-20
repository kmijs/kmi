import type { ChildProcess } from 'node:child_process';
import type { Readable, Writable } from 'node:stream';

export declare function $(pieces: TemplateStringsArray, ...args: any[]): ProcessPromise<ProcessOutput>;

export declare namespace $ {
  let verbose: boolean;
  let shell: string;
  let prefix: string;
  let quote: (arg: string) => string;
}

export class ProcessPromise<T> extends Promise<T> {
  child: ChildProcess;

  readonly stdin: Writable;

  readonly stdout: Readable;

  readonly stderr: Readable;

  readonly exitCode: Promise<number>;

  pipe(dest: ProcessPromise<ProcessOutput> | Writable): ProcessPromise<ProcessOutput>;

  kill(signal?: string | number): Promise<void>;
}

export class ProcessOutput {
  readonly exitCode: number;

  readonly stdout: string;

  readonly stderr: string;

  toString(): string;
}

export declare function cd(path: string): void;
export declare function nothrow(promise: ProcessPromise<ProcessOutput>): ProcessPromise<ProcessOutput>;
export declare function sleep(ms: number):Promise<void>;
