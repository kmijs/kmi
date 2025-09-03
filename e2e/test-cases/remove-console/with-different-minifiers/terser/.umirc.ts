export default {
  presets: [require.resolve('@kmijs/preset-bundler')],
  rspack: {},
  jsMinifier: 'terser',
  removeConsole: true,
}
