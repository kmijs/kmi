export default {
  presets: [require.resolve('@kmijs/preset-bundler')],
  rspack: {},
  jsMinifier: 'esbuild',
  removeConsole: true,
}
