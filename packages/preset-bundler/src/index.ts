import type { IApi } from 'umi'

export default (api: IApi) => {
  return {
    plugins: [
      // register methods
      require.resolve('./registerMethods'),
      // features
      require.resolve('./features/bundler'),
      require.resolve('./features/rspack/rspack'),
      require.resolve('./features/rspack/rspackProfile'),
      require.resolve('./features/react/react'),
      require.resolve('./features/bundlerConfig/bundler'),
      require.resolve('./features/bundlerConfig/bundlerChain'),
      require.resolve('./features/transformConfig'),
      require.resolve('./features/define/define'),
      // plugins
      require.resolve('@kmijs/plugin-svgr'),

      // commands
      require.resolve('./commands/inspect'),
    ],
  }
}
