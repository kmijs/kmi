/** @type {import('prebundle').Config} */
export default {
  dependencies: [
    {
      name: 'babel-plugin-import',
      ignoreDts: true,
      externals: {
        '@babel/helper-module-imports': '@kmijs/bundler-compiled/compiled/babel/helper-module-imports'
      },
    },
  ],
};
