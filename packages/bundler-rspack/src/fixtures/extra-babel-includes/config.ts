export default {
  extraBabelIncludes: [
    'jsx',
    '@group/decorator',
    './node_modules/unicode-reg/index.js',
  ],
  alias: {
    react: require.resolve('./react.ts'),
  },
  swc: {
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      transform: {
        react: {
          development: false,
          refresh: false,
          // runtime: 'automatic',
        }
      }
    },
  },
  targets: {
    chrome: 49,
  }
}
