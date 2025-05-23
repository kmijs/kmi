export default {
  rspack: {},
  hash: false,
  codeSplitting: {
    jsStrategy: 'depPerChunk',
    override: {
      minSize: 5000,
    },
  },
  polyfill: {},
}
