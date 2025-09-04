export default {
  presets: [require.resolve('../../../../../packages/preset-bundler')],
  rspack: {},
  jsMinifier: 'terser',
  removeConsole: true,
}
