export default {
  extraBabelIncludes: [
    'jsx',
    '@group/decorator',
    './node_modules/unicode-reg/index.js',
  ],
  externals: {
    'react': 'window.React',
    'react/jsx-runtime': 'window.React',
  },
}
