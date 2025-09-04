export default {
  presets: [require.resolve('../../../../../packages/preset-bundler')],
  rspack: {},
  jsMinifier: 'esbuild',
  removeConsole: true,
}
