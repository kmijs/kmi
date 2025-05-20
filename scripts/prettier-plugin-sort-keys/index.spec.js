// eslint-disable-next-line n/no-extraneous-require
const prettier = require('prettier')

const code = `
// sort-object-keys
const foo = { b, a};

export interface IApi extends IPluginAPI {
  restartServer: () => void;
  writeTmpFile: (opts: {
    content?: string;
    context?: Record<string, any>;
    noPluginDir?: boolean;
    path: string;
    tpl?: string;
    tplPath?: string;
  }) => void;
  addTmpGenerateWatcherPaths: IAdd<null, string[]>;
  onGenerateFiles: IEvent<{
    files?: { event: string; path: string } | null;
    isFirstTime?: boolean;
  }>;
  onPkgJSONChanged: IEvent<{
    current: Record<string, any>;
    origin: Record<string, any>;
  }>;
  onBeforeCompiler: IEvent<{}>;
  onBuildComplete: IEvent<{
    err?: Error;
    isFirstCompile: boolean;
    stats: any;
    time: number;
  }>;
  onCheckPkgJSON: IEvent<ICheckPkgJSONArgs>;
  onCheckConfig: IEvent<ICheckConfigArgs>;
  onCheckCode: IEvent<ICheckCodeArgs>;
  onDevCompileDone: IEvent<{
    isFirstCompile: boolean;
    stats: any;
    time: number;
  }>;
  onPatchRoute: IEvent<{
    route: IRoute;
  }>;
  addEntryImports: IAdd<null, IEntryImport>;
  addEntryImportsAhead: IAdd<null, IEntryImport>;
  addEntryCodeAhead: IAdd<null, string>;
  addEntryCode: IAdd<null, string>;
  addBabelPresets: IAdd<null, any>;
  addExtraBabelPresets: IAdd<null, any>;
  addExtraBabelPlugins: IAdd<null, any>;
  addBeforeBabelPresets: IAdd<null, any>;
  addBeforeBabelPlugins: IAdd<null, any>;
  addBeforeMiddlewares: IAdd<null, RequestHandler>;
  addMiddlewares: IAdd<null, RequestHandler>;
  addHTMLHeadScripts: IAdd<null, IScript>;
  addHTMLScripts: IAdd<null, IScript>;
  addHTMLStyles: IAdd<null, IStyle>;
  addHTMLLinks: IAdd<null, ILink>;
  addHTMLMetas: IAdd<null, IMeta>;
  addLayouts: IAdd<null, { file: string; id: string }>;
  addPolyfillImports: IAdd<null, { source: string; specifier?: string }>;
  addRuntimePlugin: IAdd<null, string>;
  addRuntimePluginKey: IAdd<null, string>;
  modifyHTMLFavicon: IModify<string[], {}>;
  modifyHTML: IModify<CheerioAPI, { path: string }>;
  modifyRendererPath: IModify<string, {}>;
  modifyRoutes: IModify<Record<string, IRoute>, {}>;
  modifyWebpackConfig: IModify<
    webpack.Configuration,
    {
      env: Env;
      webpack: typeof webpack;
    }
  >;
  modifyViteConfig: IModify<
    ViteInlineConfig,
    {
      env: Env;
    }
  >;
  chainWebpack: {
    (fn: {
      (
        memo: WebpackChain,
        args: {
          env: Env;
          webpack: typeof webpack;
        },
      ): void;
    }): void;
  };
  /**
   *
   * 获取命令帮助提示名字
   * @memberof IApi
   */
  getCommandHelpName: () => string;

  /**
   *
   * Check if the project has a plugin with given id
   * @name id {string}
   * @memberof IApi
   * @returns {boolean}
   */
  hasPlugin: (id: string) => boolean;
}
`
const ret = prettier.format(code, {
  parser: 'typescript',
  plugins: [require.resolve('./')],
})
console.log(ret)
