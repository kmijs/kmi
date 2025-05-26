export default {
  presets: [require.resolve('@kmijs/preset-bundler')],
  plugins: [require.resolve('@kmijs/plugin-code-inspector')],
  codeInspector: {
  },
  rspack: {}
}