export { isCancel } from '@clack/core';

interface TextOptions {
    message: string;
    placeholder?: string;
    defaultValue?: string;
    initialValue?: string;
    validate?: (value: string) => string | void;
}
declare const text: (opts: TextOptions) => Promise<string | symbol>;
interface PasswordOptions {
    message: string;
    mask?: string;
    validate?: (value: string) => string | void;
}
declare const password: (opts: PasswordOptions) => Promise<string | symbol>;
interface ConfirmOptions {
    message: string;
    active?: string;
    inactive?: string;
    initialValue?: boolean;
}
declare const confirm: (opts: ConfirmOptions) => Promise<boolean | symbol>;
type Primitive = Readonly<string | boolean | number>;
type Option<Value> = Value extends Primitive ? {
    value: Value;
    label?: string;
    hint?: string;
} : {
    value: Value;
    label: string;
    hint?: string;
};
interface SelectOptions<Value> {
    message: string;
    options: Option<Value>[];
    initialValue?: Value;
    maxItems?: number;
}
declare const select: <Value>(opts: SelectOptions<Value>) => Promise<symbol | Value>;
declare const selectKey: <Value extends string>(opts: SelectOptions<Value>) => Promise<symbol | Value>;
interface MultiSelectOptions<Value> {
    message: string;
    options: Option<Value>[];
    initialValues?: Value[];
    maxItems?: number;
    required?: boolean;
    cursorAt?: Value;
}
declare const multiselect: <Value>(opts: MultiSelectOptions<Value>) => Promise<symbol | Value[]>;
interface GroupMultiSelectOptions<Value> {
    message: string;
    options: Record<string, Option<Value>[]>;
    initialValues?: Value[];
    required?: boolean;
    cursorAt?: Value;
}
declare const groupMultiselect: <Value>(opts: GroupMultiSelectOptions<Value>) => Promise<symbol | Value[]>;
declare const note: (message?: string, title?: string) => void;
declare const cancel: (message?: string) => void;
declare const intro: (title?: string) => void;
declare const outro: (message?: string) => void;
type LogMessageOptions = {
    symbol?: string;
};
declare const log: {
    message: (message?: string, { symbol }?: LogMessageOptions) => void;
    info: (message: string) => void;
    success: (message: string) => void;
    step: (message: string) => void;
    warn: (message: string) => void;
    /** alias for `log.warn()`. */
    warning: (message: string) => void;
    error: (message: string) => void;
};
declare const spinner: () => {
    start: (msg?: string) => void;
    stop: (msg?: string, code?: number) => void;
    message: (msg?: string) => void;
};
type PromptGroupAwaitedReturn<T> = {
    [P in keyof T]: Exclude<Awaited<T[P]>, symbol>;
};
interface PromptGroupOptions<T> {
    /**
     * Control how the group can be canceled
     * if one of the prompts is canceled.
     */
    onCancel?: (opts: {
        results: Prettify<Partial<PromptGroupAwaitedReturn<T>>>;
    }) => void;
}
type Prettify<T> = {
    [P in keyof T]: T[P];
} & {};
type PromptGroup<T> = {
    [P in keyof T]: (opts: {
        results: Prettify<Partial<PromptGroupAwaitedReturn<Omit<T, P>>>>;
    }) => void | Promise<T[P] | void>;
};
/**
 * Define a group of prompts to be displayed
 * and return a results of objects within the group
 */
declare const group: <T>(prompts: PromptGroup<T>, opts?: PromptGroupOptions<T> | undefined) => Promise<{ [P in keyof PromptGroupAwaitedReturn<T>]: PromptGroupAwaitedReturn<T>[P]; }>;
type Task = {
    /**
     * Task title
     */
    title: string;
    /**
     * Task function
     */
    task: (message: (string: string) => void) => string | Promise<string> | void | Promise<void>;
    /**
     * If enabled === false the task will be skipped
     */
    enabled?: boolean;
};
/**
 * Define a group of tasks to be executed
 */
declare const tasks: (tasks: Task[]) => Promise<void>;

export { type ConfirmOptions, type GroupMultiSelectOptions, type LogMessageOptions, type MultiSelectOptions, type PasswordOptions, type PromptGroup, type PromptGroupAwaitedReturn, type PromptGroupOptions, type SelectOptions, type Task, type TextOptions, cancel, confirm, group, groupMultiselect, intro, log, multiselect, note, outro, password, select, selectKey, spinner, tasks, text };
