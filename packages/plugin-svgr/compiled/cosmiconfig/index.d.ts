type Config = any;
type CosmiconfigResult = {
    config: Config;
    filepath: string;
    isEmpty?: boolean;
} | null;
interface Loaders {
    [key: string]: Loader;
}
interface LoadersSync {
    [key: string]: LoaderSync;
}

type LoaderResult = Config | null;
type Loader = ((filepath: string, content: string) => Promise<LoaderResult>) | LoaderSync;
type LoaderSync = (filepath: string, content: string) => LoaderResult;
type Transform = ((CosmiconfigResult: CosmiconfigResult) => Promise<CosmiconfigResult>) | TransformSync;
type TransformSync = (CosmiconfigResult: CosmiconfigResult) => CosmiconfigResult;
interface OptionsBase {
    packageProp?: string | Array<string>;
    searchPlaces?: Array<string>;
    ignoreEmptySearchPlaces?: boolean;
    stopDir?: string;
    cache?: boolean;
}
interface Options extends OptionsBase {
    loaders?: Loaders;
    transform?: Transform;
}
interface OptionsSync extends OptionsBase {
    loaders?: LoadersSync;
    transform?: TransformSync;
}
interface PublicExplorerBase {
    clearLoadCache: () => void;
    clearSearchCache: () => void;
    clearCaches: () => void;
}
interface PublicExplorer extends PublicExplorerBase {
    search: (searchFrom?: string) => Promise<CosmiconfigResult>;
    load: (filepath: string) => Promise<CosmiconfigResult>;
}
interface PublicExplorerSync extends PublicExplorerBase {
    search: (searchFrom?: string) => CosmiconfigResult;
    load: (filepath: string) => CosmiconfigResult;
}
declare const metaSearchPlaces: string[];
declare const defaultLoaders: Readonly<{
    readonly '.cjs': LoaderSync;
    readonly '.js': LoaderSync;
    readonly '.json': LoaderSync;
    readonly '.yaml': LoaderSync;
    readonly '.yml': LoaderSync;
    readonly noExt: LoaderSync;
}>;
declare function cosmiconfig(moduleName: string, options?: Options): PublicExplorer;
declare function cosmiconfigSync(moduleName: string, options?: OptionsSync): PublicExplorerSync;

export { cosmiconfig, cosmiconfigSync, defaultLoaders, metaSearchPlaces };
export type { Loader, LoaderSync, Options, OptionsSync, PublicExplorer, PublicExplorerBase, PublicExplorerSync, Transform, TransformSync };
