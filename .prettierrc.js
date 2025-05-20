module.exports = {
  semi: false,
  singleQuote: true,
  overrides: [
    {
      files: ['*.json5'],
      options: {
        singleQuote: false,
        quoteProps: 'preserve',
      },
    },
    {
      files: ['*.yml'],
      options: {
        singleQuote: false,
      },
    },
  ],
  importOrder: [
    "^node:",
    "<THIRD_PARTY_MODULES>",
    "^@kmijsjs/",
    "^@/",
    "^[./]"
  ],
  plugins: [
    require.resolve('prettier-plugin-packagejson'),
    require.resolve('@trivago/prettier-plugin-sort-imports'),
    require.resolve('@scripts/prettier-plugin-sort-keys'),
  ],
}
