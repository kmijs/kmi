type OneOrMany<T> = T | T[];
type MaybePromise<T> = T | Promise<T>;
type ConfigChain<T> = OneOrMany<T | ((config: T) => T | void)>;
type ConfigChainWithContext<T, Ctx> = OneOrMany<T | ((config: T, ctx: Ctx) => T | void)>;
type ConfigChainAsyncWithContext<T, Ctx> = OneOrMany<T | ((config: T, ctx: Ctx) => MaybePromise<T | void>)>;
type ConfigChainMergeContext<T, Ctx> = OneOrMany<T | ((merged: {
    value: T;
} & Ctx) => T | void)>;
/**
 * Merge one or more configs into a final config,
 * and allow to modify the config object via a function.
 */
declare function reduceConfigs<T>({ initial, config, mergeFn, }: {
    /**
     * Initial configuration object.
     */
    initial: T;
    /**
     * The configuration object, function, or array of configuration objects/functions
     * to be merged into the initial configuration
     */
    config?: ConfigChain<T> | undefined;
    /**
     * The function used to merge configuration objects.
     * @default Object.assign
     */
    mergeFn?: typeof Object.assign;
}): T;
/**
 * Merge one or more configs into a final config,
 * and allow to modify the config object via a function, the function accepts a context object.
 */
declare function reduceConfigsWithContext<T, Ctx>({ initial, config, ctx, mergeFn, }: {
    /**
     * Initial configuration object.
     */
    initial: T;
    /**
     * The configuration object, function, or array of configuration objects/functions
     * to be merged into the initial configuration
     */
    config?: ConfigChainWithContext<T, Ctx> | undefined;
    /**
     * Context object that can be used within the configuration functions.
     */
    ctx?: Ctx;
    /**
     * The function used to merge configuration objects.
     * @default Object.assign
     */
    mergeFn?: typeof Object.assign;
}): T;
/**
 * Merge one or more configs into a final config,
 * and allow to modify the config object via an async function, the function accepts a context object.
 */
declare function reduceConfigsAsyncWithContext<T, Ctx>({ initial, config, ctx, mergeFn, }: {
    initial: T;
    config?: ConfigChainAsyncWithContext<T, Ctx> | undefined;
    ctx?: Ctx;
    mergeFn?: typeof Object.assign;
}): Promise<T>;
/**
 * Merge one or more configs into a final config,
 * and allow to modify the config object via an async function, the function accepts a merged object.
 */
declare function reduceConfigsMergeContext<T, Ctx>({ initial, config, ctx, mergeFn, }: {
    initial: T;
    config?: ConfigChainMergeContext<T, Ctx> | undefined;
    ctx?: Ctx;
    mergeFn?: typeof Object.assign;
}): T;

export { type ConfigChain, type ConfigChainAsyncWithContext, type ConfigChainMergeContext, type ConfigChainWithContext, reduceConfigs, reduceConfigsAsyncWithContext, reduceConfigsMergeContext, reduceConfigsWithContext };
